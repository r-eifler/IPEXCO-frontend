import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  ViewChild,
} from "@angular/core";
import colorsys from "colorsys";
import * as fabric from "fabric";
import { BelugaProblem, BelugaProblemZ } from "../../domain/beluga_problem";
import { array } from "zod";
import {
  BelugaActionZ,
  BelugaAction,
  UnloadBeluga,
  LoadBeluga,
  PutDownRack,
  PickUpRack,
  DeliverToHanger,
  GetFromHanger,
} from "../../domain/beluga_plan";
import {
  Rack as RackBP,
  Jig as JigBP,
  Trailer as TrailerBP,
  ProductionLine as ProductionLineBP,
} from "../../domain/beluga_problem";
import { Plan } from "src/app/planning/domain/plan";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSliderDragEvent, MatSliderModule } from "@angular/material/slider";
import { NgIf } from "@angular/common";
import { Subject, takeUntil, takeWhile, timer } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

export interface Part {
  name: string;
  length: number;
  id: number; // unique id in the scene
  fObj: fabric.Object | null;
}

export interface Jig {
  name: string;
  length: number;
  msn: Part | null; // depend on current state
  id: number; // unique id in the scene
  fObj: fabric.Object | null;
}

export interface Rack {
  name: string;
  length: number;
  type: string;
  location: string;
  contains: Jig[]; // depend on current state
  at: {
    rack: Rack | null;
    side: string | null;
    hangar: Hangar | null;
  } | null; // only for trailers, depend on current state
  bside_trailer: Rack | null; // only for static racks (i.e. not trailers)
  fside_trailer: Rack | null; // only for static racks (i.e. not trailers)
  fObj: fabric.Object | null;
}

export interface Hangar {
  name: string;
  craning: Jig | null; // depend on current state
  trailer: Rack | null; // depend on current state
  fObj: fabric.Object | null;
}

export interface Factory {
  name: string;
  contains: Part[]; // depend on current state
  fObj: fabric.Object | null;
}

export interface Flight {
  name: string;
  num: number; // flight order
  ins: Rack;
  outs: Rack;
  trailer: Rack | null; // depend on current state
}

class State {
  flight: Flight | null = null;
  racks: Rack[] = [];
  trailers: Rack[] = [];
  factories: Factory[] = [];
  hangars: Hangar[] = [];

  copy(): State {
    const state = new State();
    state.racks = this.racks.map((r) => State._copyRack(r));
    let rackNameMap = new Map<string, Rack>(
      state.racks.map((r) => [r.name, r])
    );
    if (this.flight != undefined) {
      state.flight = { ...this.flight };
      state.flight.ins = State._copyRack(this.flight.ins);
      state.flight.outs = State._copyRack(this.flight.outs);
      rackNameMap.set(state.flight.ins.name, state.flight.ins);
      rackNameMap.set(state.flight.outs.name, state.flight.outs);
    } else {
      state.flight = null;
    }
    state.factories = this.factories.map((f) => State._copyFactory(f));
    state.hangars = this.hangars.map((h) => State._copyHangar(h));
    let hangarNameMap = new Map<string, Hangar>(
      state.hangars.map((h) => [h.name, h])
    );
    state.trailers = this.trailers.map((t) =>
      State._copyTrailer(t, rackNameMap, hangarNameMap)
    );
    let trailerNameMap = new Map<string, Rack>(
      state.trailers.map((t) => [t.name, t])
    );
    for (let r of state.racks) {
      if (r.bside_trailer) {
        let bside_trailer = trailerNameMap.get(r.bside_trailer.name);
        r.bside_trailer = bside_trailer ? bside_trailer : null;
      }
      if (r.fside_trailer) {
        let fside_trailer = trailerNameMap.get(r.fside_trailer.name);
        r.fside_trailer = fside_trailer ? fside_trailer : null;
      }
    }
    for (let h of state.hangars) {
      if (h.trailer) {
        let trailer = trailerNameMap.get(h.trailer.name);
        h.trailer = trailer ? trailer : null;
      }
    }
    if (state.flight && state.flight.trailer) {
      let trailer = trailerNameMap.get(state.flight.trailer.name);
      state.flight.trailer = trailer ? trailer : null;
    }
    return state;
  }

  static _copyPart(part: Part) {
    return { ...part };
  }

  static _copyJig(jig: Jig) {
    let newJig: Jig = { ...jig };
    if (jig.msn != null) {
      newJig.msn = { ...jig.msn };
    }
    return newJig;
  }

  static _copyRack(rack: Rack) {
    let newRack: Rack = { ...rack };
    newRack.contains = rack.contains.map((j) => State._copyJig(j));
    return newRack;
  }

  static _copyTrailer(
    trailer: Rack,
    rackNameMaps: Map<string, Rack>,
    hangarNameMap: Map<string, Hangar>
  ) {
    let newTrailer: Rack = { ...trailer };
    newTrailer.contains = trailer.contains.map((j) => State._copyJig(j));
    if (trailer.at != null) {
      newTrailer.at = { ...trailer.at };
      if (trailer.at.rack != null) {
        let atRack: Rack | undefined = rackNameMaps.get(trailer.at.rack.name);
        if (atRack != undefined) {
          newTrailer.at.rack = atRack;
        }
      }
      if (trailer.at.hangar != null) {
        let atHangar: Hangar | undefined = hangarNameMap.get(
          trailer.at.hangar.name
        );
        if (atHangar != undefined) {
          newTrailer.at.hangar = atHangar;
        }
      }
    }
    return newTrailer;
  }

  static _copyFactory(factory: Factory) {
    let newFactory: Factory = { ...factory };
    newFactory.contains = factory.contains.map((p) => State._copyPart(p));
    return newFactory;
  }

  static _copyHangar(hangar: Hangar) {
    let newHangar = { ...hangar };
    if (hangar.craning != null) {
      newHangar.craning = State._copyJig(hangar.craning);
    }
    return newHangar;
  }
}

@Component({
  selector: "app-beluga-plan-animation",
  imports: [MatButtonModule, MatIconModule, MatSliderModule, NgIf],
  templateUrl: "./beluga-plan-animation.component.html",
  styleUrl: "./beluga-plan-animation.component.scss",
})
export class BelugaPlanAnimationComponent {
  @ViewChild("sceneRendering") sceneRendering?: ElementRef;
  canvas: fabric.Canvas = new fabric.Canvas();

  site: string = "";
  dates: [startDate: Date, endDate: Date] = [new Date(), new Date()];
  solutionPlan: BelugaAction[] = new Array<BelugaAction>();
  simulationActivated: boolean = false;
  canMoveForward: boolean = false;
  canMoveBackward: boolean = false;
  currentAction: number = -1;

  lastPoint: fabric.Point = new fabric.Point();
  sceneWidth: number = 0;
  sceneHeight: number = 0;
  expandedCanvas: boolean = false;

  initialState: State = new State();
  currentState: State = new State();
  stateHistory: State[] = []; // speed up simulation interaction
  rackNameToIndex: Map<string, number> = new Map<string, number>();
  trailerNameToIndex: Map<string, number> = new Map<string, number>();
  factoryNameToIndex: Map<string, number> = new Map<string, number>();
  hangarNameToIndex: Map<string, number> = new Map<string, number>();

  jigColors: Array<{ r: number; g: number; b: number }> = [];
  initiallyRegisteredJigsInScene: number = 0; // each jig entering scene consumes new color
  registeredJigsInScene: number = 0; // each jig entering scene consumes new color
  partColors: Array<{ r: number; g: number; b: number }> = [];
  initiallyRegisteredPartsInScene: number = 0; // ech part entering scene consumes new color
  registeredPartsInScene: number = 0; // ech part entering scene consumes new color
  maxNbJigs: number = 0; // maximum nb of jig colors to generate
  maxNbParts: number = 0; // maximum nb of part colors to generate

  readonly canvasWindowMargin: number = 10;
  readonly rackSpace: number = 75;
  readonly rackPaneSpace: number = 15;
  readonly rackWheelSpace: number = 45;
  readonly factoryCrenelSpace: number = 30;
  readonly rackScale: number = 5;

  private startPlanSimulationSource = new Subject<void>();
  startPlanSimulation$ = this.startPlanSimulationSource.asObservable();

  private stopPlanSimulationSource = new Subject<void>();
  stopPlanSimulation$ = this.stopPlanSimulationSource.asObservable();

  plan = input.required<Plan>();
  actions = computed(() => {
    let plan = this.plan();
    if (plan !== null && plan.actions !== undefined && plan.actions !== null) {
      return array(BelugaActionZ).parse(plan.actions);
    }
    return null;
  });

  model = input.required<unknown>();
  belugaProblem = computed(() => {
    return BelugaProblemZ.parse(this.model());
  });

  constructor(private _el: ElementRef) {
    this.startPlanSimulation$.pipe(takeUntilDestroyed()).subscribe(() => {
      timer(0, 500)
        .pipe(
          takeUntil(this.stopPlanSimulation$),
          takeWhile(() => this.currentAction < this.solutionPlan.length)
        )
        .subscribe(() => {
          this.onSimulationNextAction();
        });
    });

    effect(() => {
      this.loadProblem();
      this.loadPlan();
    });
  }

  ngAfterViewChecked(): void {
    this.resizeCanvas();
  }

  resizeCanvas() {
    if (this.canvas) {
      this.canvas.setWidth(
        this.sceneRendering?.nativeElement.clientWidth -
          2 * this.canvasWindowMargin
      );
      if (this.expandedCanvas) {
        this.canvas.setHeight(window.innerHeight - 2 * this.canvasWindowMargin);
      } else {
        this.canvas.setHeight(
          window.innerHeight -
            this._el.nativeElement.offsetTop -
            2 * this.canvasWindowMargin
        );
      }
      this.canvas.renderAll();
    }
  }

  expandCanvas() {
    this.expandedCanvas = true;
    this.resizeCanvas();
  }

  shrinkCanvas() {
    this.expandedCanvas = false;
    this.resizeCanvas();
  }

  public ngOnInit(): void {
    this.canvas = new fabric.Canvas("renderingCanvas", {
      backgroundColor: "#e5f3ef",
      selection: false,
    });
    window.addEventListener("resize", this.resizeCanvas, false);
    var canvas = this.canvas;

    canvas.on("mouse:wheel", function (opt) {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint(
        new fabric.Point({ x: opt.e.offsetX, y: opt.e.offsetY }),
        zoom
      );
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    var panning = false;
    var lastPoint = this.lastPoint;
    canvas.on("mouse:up", function (opt) {
      panning = false;
    });

    canvas.on("mouse:down", function (opt) {
      panning = true;
      lastPoint = canvas.getScenePoint(opt.e);
    });

    canvas.on("mouse:move", function (opt) {
      if (panning && opt && opt.e) {
        var currentPoint = canvas.getScenePoint(opt.e);
        var delta = new fabric.Point(
          currentPoint.x - lastPoint.x,
          currentPoint.y - lastPoint.y
        );
        canvas.relativePan(delta);
      }
    });
  }

  onZoomIn() {
    var zoom = this.canvas.getZoom();
    zoom *= 0.999 ** -100;
    if (zoom > 20) zoom = 20;
    this.canvas.setZoom(zoom);
  }

  onZoomOut() {
    var zoom = this.canvas.getZoom();
    zoom *= 0.999 ** 100;
    if (zoom < 0.01) zoom = 0.01;
    this.canvas.setZoom(zoom);
  }

  resetViewport() {
    // Adapt zoom and center of view to see the whole scene
    let zoom: number = Math.min(
      (this.canvas.getWidth() - 2 * this.canvasWindowMargin) / this.sceneWidth,
      (this.canvas.getHeight() - 2 * this.canvasWindowMargin) / this.sceneHeight
    );
    this.canvas.setZoom(zoom);
    this.canvas.absolutePan(
      new fabric.Point({
        x: 0.5 * (zoom * this.sceneWidth - this.canvas.getWidth()),
        y: 0.5 * (zoom * this.sceneHeight - this.canvas.getHeight()),
      })
    );
  }

  onSimulationPlay() {
    this.startPlanSimulationSource.next();
  }

  onSimulationPause() {
    this.stopPlanSimulationSource.next();
  }

  onSimulationNextAction() {
    if (this.currentAction < this.solutionPlan.length) {
      if (this.currentAction >= this.stateHistory.length - 1) {
        this.changeState(this.solutionPlan[this.currentAction]);
        this.stateHistory.push(this.currentState.copy());
      } else {
        this.currentState = this.stateHistory[this.currentAction + 1].copy();
      }
      this.drawScene();
      this.currentAction += 1;
      this.canMoveBackward = true;
      this.canMoveForward = this.currentAction < this.solutionPlan.length;
    }
  }

  onSimulationPreviousAction() {
    if (
      this.currentAction > 0 &&
      this.currentAction <= this.stateHistory.length
    ) {
      this.currentState = this.stateHistory[this.currentAction - 1].copy();
      this.drawScene();
      this.currentAction -= 1;
      this.canMoveForward = true;
      this.canMoveBackward = this.currentAction > 0;
    }
  }

  onSimulationGotoAction(event: MatSliderDragEvent) {
    let targetAction: number = event.value;
    if (targetAction <= this.currentAction) {
      this.currentState = this.stateHistory[targetAction].copy();
    } else {
      for (let step = this.currentAction; step <= targetAction; step++) {
        if (step >= this.stateHistory.length - 1) {
          this.currentAction = step;
          this.changeState(this.solutionPlan[step]);
          this.stateHistory.push(this.currentState.copy());
        } else {
          this.currentState = this.stateHistory[step + 1].copy();
        }
      }
    }
    this.drawScene();
    this.canMoveForward = this.currentAction < this.solutionPlan.length - 1;
    this.canMoveBackward = this.currentAction > 0;
  }

  changeState(action: BelugaAction) {
    console.log(action);
    if (["unload_beluga", "load_beluga"].includes(action.name)) {
      let unloadOrLoad: UnloadBeluga | LoadBeluga =
        action.name === "unload_beluga"
          ? (action as UnloadBeluga)
          : (action as LoadBeluga);
      let trailerIndex = this.trailerNameToIndex.get(unloadOrLoad.t);
      if (trailerIndex === undefined) {
        console.error(
          `${action.name} action: unknown trailer ${unloadOrLoad.t}`
        );
        return false;
      }
      let trailerAtBeluga: Rack = this.currentState.trailers[trailerIndex];
      if (this.currentState.flight) {
        if (
          this.currentState.flight.trailer !== null &&
          this.currentState.flight.trailer.name !== trailerAtBeluga.name
        ) {
          if (
            !this.relocateTrailer(this.currentState.flight.trailer, "beluga")
          ) {
            console.error(
              `Cannot relocate trailer ${this.currentState.flight.trailer.name}`
            );
          }
        }
        this.releaseTrailerLocation(trailerAtBeluga);
        trailerAtBeluga.at = {
          rack: this.currentState.flight?.ins,
          side: "beluga",
          hangar: null,
        };
        this.currentState.flight.trailer = trailerAtBeluga;
      } else {
        console.error(`${action.name} action: no flight to load or unload`);
      }
      let jig: Jig | undefined =
        action.name === "unload_beluga"
          ? this.currentState.flight?.ins.contains.shift()
          : trailerAtBeluga.contains.shift();
      if (!jig) {
        if (action.name === "unload_beluga") {
          console.error(
            `${action.name} action: no jig to unload from flight ${this.currentState.flight?.name}`
          );
        }
        if (action.name === "load_beluga") {
          console.error(
            `${action.name} action: no jig to load from trailer ${trailerAtBeluga.name}`
          );
        }
        return false;
      }
      if (jig.name != unloadOrLoad.j) {
        console.error(
          `${action.name} action: inconsistent jig (${jig.name}) ` +
            `with planner's one (${unloadOrLoad.j}`
        );
        return false;
      }
      if (action.name === "unload_beluga") {
        trailerAtBeluga.contains.unshift(jig);
      } else if (action.name === "load_beluga") {
        this.currentState.flight?.outs.contains.unshift(jig);
      }
    } else if (action.name === "switch_to_next_beluga") {
      if (
        this.currentState.flight &&
        this.currentState.flight.num < this.belugaProblem().flights.length - 1
      ) {
        this.currentState.flight.num += 1;
        this.currentState.flight.name =
          this.belugaProblem().flights[this.currentState.flight.num].name;
        this.currentState.flight.ins.contains = new Array<Jig>();
        this.currentState.flight.outs.contains = new Array<Jig>();
        for (let ctn of this.belugaProblem().flights[
          this.currentState.flight.num
        ].incoming) {
          let jig: Jig | undefined = this.createAndRegisterJig(ctn);
          if (jig) {
            this.currentState.flight.ins.contains.push(jig);
          }
        }
      } else {
        this.currentState.flight = null;
      }
    } else if (["put_down_rack", "pick_up_rack"].includes(action.name)) {
      let putOrPick: PutDownRack | PickUpRack =
        action.name === "put_down_rack"
          ? (action as PutDownRack)
          : (action as PickUpRack);
      let side: string = putOrPick.s;
      let rackIndex = this.rackNameToIndex.get(putOrPick.r);
      if (rackIndex === undefined) {
        console.error(`${action.name} action: unknown rack ${putOrPick.r}`);
        return false;
      }
      let trailerIndex = this.trailerNameToIndex.get(putOrPick.t);
      if (trailerIndex === undefined) {
        console.error(`${action.name} action: unknown trailer ${putOrPick.t}`);
        return false;
      }
      let trailer: Rack = this.currentState.trailers[trailerIndex];
      if (
        side === "fside" &&
        trailer.at !== null &&
        trailer.at.hangar !== null
      ) {
        let jigOnTrailer: Jig | undefined = trailer.contains.pop();
        trailer.at.hangar.craning =
          jigOnTrailer !== undefined ? jigOnTrailer : null;
      }
      let rack: Rack = this.currentState.racks[rackIndex];
      if (
        side === "bside" &&
        rack.bside_trailer !== null &&
        rack.bside_trailer.name !== trailer.name
      ) {
        if (!this.relocateTrailer(rack.bside_trailer, "beluga")) {
          console.error(`Cannot relocate trailer ${rack.bside_trailer.name}`);
        }
      } else if (
        side === "fside" &&
        rack.fside_trailer !== null &&
        rack.fside_trailer.name !== trailer.name
      ) {
        if (!this.relocateTrailer(rack.fside_trailer, "factory")) {
          console.error(`Cannot relocate trailer ${rack.fside_trailer.name}`);
        }
      }
      this.releaseTrailerLocation(trailer);
      trailer.at = {
        rack: rack,
        side: side === "bside" ? "beluga" : "factory",
        hangar: null,
      };
      if (side === "bside") {
        rack.bside_trailer = trailer;
      } else {
        rack.fside_trailer = trailer;
      }
      let jig: Jig | undefined =
        action.name === "put_down_rack"
          ? side === "bside"
            ? trailer.contains.pop()
            : trailer.contains.shift()
          : side === "bside"
          ? rack.contains.shift()
          : rack.contains.pop();
      if (!jig) {
        if (action.name === "put_down_rack") {
          console.error(
            `${action.name} action: no jig to put down from trailer ${trailer.name}`
          );
        }
        if (action.name === "pick_up_rack") {
          console.error(
            `${action.name} action: no jig to pick up from rack ${rack.name}`
          );
        }
        return false;
      }
      if (jig.name != putOrPick.j) {
        console.error(
          `${action.name} action: inconsistent jig (${jig.name}) ` +
            `with planner's one (${putOrPick.j})`
        );
        return false;
      }
      if (action.name === "put_down_rack") {
        if (side === "bside") {
          rack.contains.unshift(jig);
        } else if (side === "fside") {
          rack.contains.push(jig);
        }
      } else if (action.name === "pick_up_rack") {
        if (side === "bside") {
          trailer.contains.push(jig);
        } else if (side === "fside") {
          trailer.contains.unshift(jig);
        }
      }
    } else if (["deliver_to_hangar", "get_from_hangar"].includes(action.name)) {
      let deliverOrGet: DeliverToHanger | GetFromHanger =
        action.name === "deliver_to_hangar"
          ? (action as DeliverToHanger)
          : (action as GetFromHanger);
      let hangarIndex = this.hangarNameToIndex.get(deliverOrGet.h);
      if (hangarIndex === undefined) {
        console.error(
          `${action.name} action: unknown hangar ${deliverOrGet.h}`
        );
        return false;
      }
      let trailerIndex = this.trailerNameToIndex.get(deliverOrGet.t);
      if (trailerIndex === undefined) {
        console.error(
          `${action.name} action: unknown trailer ${deliverOrGet.t}`
        );
        return false;
      }
      let trailer: Rack = this.currentState.trailers[trailerIndex];
      let hangar: Hangar = this.currentState.hangars[hangarIndex];
      if (hangar.trailer !== null && hangar.trailer.name !== trailer.name) {
        if (!this.relocateTrailer(hangar.trailer, "factory")) {
          console.error(`Cannot relocate trailer ${hangar.trailer.name}`);
        }
      }
      if (
        trailer.at !== null &&
        trailer.at.hangar !== null &&
        trailer.at.hangar.name !== hangar.name
      ) {
        let jigOnTrailer: Jig | undefined = trailer.contains.pop();
        trailer.at.hangar.craning =
          jigOnTrailer !== undefined ? jigOnTrailer : null;
      }
      let trailerAlreadyInHangar =
        trailer.at !== null &&
        trailer.at.hangar !== null &&
        trailer.at.hangar.name === hangar.name;
      this.releaseTrailerLocation(trailer);
      trailer.at = {
        rack: null,
        side: "factory",
        hangar: hangar,
      };
      hangar.trailer = trailer;
      if (action.name === "deliver_to_hangar") {
        if (trailer.contains.length === 0) {
          console.error(
            `${action.name} action: no jig on trailer ${trailer.name}`
          );
          return false;
        }
        let jig: Jig = trailer.contains[trailer.contains.length - 1];
        if (jig.name != deliverOrGet.j) {
          console.error(
            `${action.name} action: inconsistent jig (${jig.name}) ` +
              `with planner's one (${deliverOrGet.j})`
          );
          return false;
        }
        if (!jig.msn) {
          console.error(
            `${action.name} action: no MSN to send to factory from trailer ${trailer.name}`
          );
          return false;
        }
        let factoryIndex: number | undefined = this.factoryNameToIndex.get(
          (action as DeliverToHanger).pl
        );
        if (factoryIndex === undefined) {
          console.error(
            `${action.name} action: unknown factory ${
              (action as DeliverToHanger).pl
            }`
          );
          return false;
        }
        let factory: Factory = this.currentState.factories[factoryIndex];
        factory.contains.unshift(jig.msn);
        trailer.contains[trailer.contains.length - 1].msn = null;
      } else {
        if (!trailerAlreadyInHangar && trailer.contains.length > 0) {
          console.error(
            `${action.name} action: trailer ${trailer.name} not empty`
          );
          return false;
        }
        if (hangar.craning === null) {
          console.error(
            `${action.name} action: No jig in hangar ${hangar.name}`
          );
        } else {
          if (hangar.craning.name !== deliverOrGet.j) {
            console.error(
              `${action.name} action: inconsistent jig (${hangar.craning.name}) ` +
                `with planner's one (${deliverOrGet.j})`
            );
          }
          console.log(`craning: ${hangar.craning.name}`);
          trailer.contains.push(hangar.craning);
          hangar.craning = null;
          console.log(`trailer: ${trailer.contains.length}`);
          console.log(trailer.contains);
        }
      }
    } else {
      console.error(`Unknown action ${action.name}`);
      return false;
    }

    return true;
  }

  relocateTrailer(trailer: Rack, side: string) {
    for (let a = this.currentAction + 1; a < this.solutionPlan.length; a++) {
      switch (this.solutionPlan[a].name) {
        case "switch_to_next_beluga":
          continue;
        case "unload_beluga":
        case "load_beluga":
          if (
            (this.solutionPlan[a] as UnloadBeluga | LoadBeluga).t ===
            trailer.name
          ) {
            if (
              this.currentState.flight !== null &&
              this.currentState.flight.trailer === null
            ) {
              this.currentState.flight.trailer = trailer;
              trailer.at = {
                rack: this.currentState.flight.ins,
                side: "beluga",
                hangar: null,
              };
              return true;
            } else {
              return this.relocateTrailerToNearestRack(trailer, side, -1);
            }
          }
          break;
        case "put_down_rack":
        case "pick_up_rack":
          let putOrPick = this.solutionPlan[a] as PutDownRack | PickUpRack;
          if (putOrPick.t === trailer.name) {
            let ri = this.rackNameToIndex.get(putOrPick.r);
            let aside = putOrPick.s;
            if (ri) {
              if (
                side === "beluga" &&
                aside === "bside" &&
                this.currentState.racks[ri].bside_trailer === null
              ) {
                this.currentState.racks[ri].bside_trailer = trailer;
                trailer.at = {
                  rack: this.currentState.racks[ri],
                  side: side,
                  hangar: null,
                };
                return true;
              } else if (
                side === "factory" &&
                aside === "fside" &&
                this.currentState.racks[ri].fside_trailer === null
              ) {
                this.currentState.racks[ri].fside_trailer = trailer;
                trailer.at = {
                  rack: this.currentState.racks[ri],
                  side: side,
                  hangar: null,
                };
                return true;
              }
              return this.relocateTrailerToNearestRack(trailer, side, ri);
            } else {
              return this.relocateTrailerToNearestRack(trailer, side, -1);
            }
          }
          break;
        case "deliver_to_hangar":
        case "get_from_hangar":
          let deliverOrGet = this.solutionPlan[a] as
            | DeliverToHanger
            | GetFromHanger;
          if (deliverOrGet.t === trailer.name) {
            let hi = this.hangarNameToIndex.get(deliverOrGet.h);
            if (
              hi &&
              side === "factory" &&
              this.currentState.hangars[hi].trailer === null
            ) {
              this.currentState.hangars[hi].trailer = trailer;
              trailer.at = {
                rack: null,
                side: "factory",
                hangar: this.currentState.hangars[hi],
              };
              return true;
            } else {
              return this.relocateTrailerToNearestRack(trailer, side, -1);
            }
          }
          break;
      }
    }
    return false;
  }

  releaseTrailerLocation(trailer: Rack) {
    if (
      this.currentState.flight != null &&
      this.currentState.flight.trailer &&
      this.currentState.flight.trailer.name === trailer.name
    ) {
      this.currentState.flight.trailer = null;
    } else {
      if (trailer.at !== null) {
        if (trailer.at.rack !== null) {
          if (trailer.at.side === "beluga") {
            trailer.at.rack.bside_trailer = null;
          } else if (trailer.at.side === "factory") {
            trailer.at.rack.fside_trailer = null;
          }
        } else if (trailer.at.hangar !== null) {
          trailer.at.hangar.trailer = null;
        }
      }
    }
  }

  relocateTrailerToNearestRack(trailer: Rack, side: string, ri: number) {
    let racks_permutation = Array<number>(
      this.currentState.racks.length - (ri < 0 ? 0 : 1)
    );
    let left_index = ri - 1;
    let right_index = ri + 1;
    let idx = 0;
    while (idx < racks_permutation.length) {
      if (left_index >= 0) {
        racks_permutation[idx] = left_index;
        left_index--;
        idx++;
      }
      if (right_index < this.currentState.racks.length) {
        racks_permutation[idx] = right_index;
        right_index++;
        idx++;
      }
    }
    for (let i = 0; i < racks_permutation.length; i++) {
      let r = this.currentState.racks[racks_permutation[i]];
      if (side === "beluga" && r.bside_trailer === null) {
        r.bside_trailer = trailer;
        trailer.at = {
          rack: r,
          side: side,
          hangar: null,
        };
        return true;
      } else if (side === "factory" && r.fside_trailer === null) {
        r.fside_trailer = trailer;
        trailer.at = {
          rack: r,
          side: side,
          hangar: null,
        };
        return true;
      }
    }
    return false;
  }

  drawScene(resetViewport: boolean = false) {
    // Clear the scene
    this.canvas.remove(...this.canvas.getObjects());

    this.sceneWidth = 0;
    this.sceneHeight = 0;

    if (this.currentState.flight) {
      // Draw Beluga aircraft
      let belugaAircraft = this.drawBelugaAircraft();
      this.setTooltip(belugaAircraft, this.currentState.flight.name);
      this.canvas.add(belugaAircraft);
      this.sceneWidth = Math.max(
        this.sceneWidth,
        belugaAircraft.getX() + belugaAircraft.width
      );
      this.sceneHeight = Math.max(
        this.sceneHeight,
        belugaAircraft.getY() + belugaAircraft.height
      );

      // Draw Beluga rack(s) / contents
      let belugaRackSplit: number = 0;
      let currentSplitOccupation: number = 0;
      let currentJigStart: number = belugaAircraft.getX();
      let maxJigHeight: number = 0;
      for (let bRack of [
        this.currentState.flight.ins,
        this.currentState.flight.outs,
      ]) {
        let belugaJigs: Array<fabric.Group> = [];
        for (let j = 0; j < bRack.contains.length; j++) {
          let jj: Jig = bRack.contains[bRack.contains.length - 1 - j];
          let jigLength = jj.msn === null ? jj.length : jj.msn.length;
          if (currentSplitOccupation + jigLength > bRack.length) {
            belugaRackSplit += 1;
            currentSplitOccupation = jigLength;
            currentJigStart = belugaAircraft.getX();
          } else {
            currentSplitOccupation += jigLength;
          }
          let jig: fabric.Group = this.drawJig(jj);
          jig.set("left", currentJigStart);
          jig.set(
            "top",
            belugaAircraft.getY() +
              belugaAircraft.height +
              belugaRackSplit * (maxJigHeight + this.rackSpace)
          );
          belugaJigs.push(jig);
          currentJigStart += jig.width + 0.1 * this.rackSpace;
          maxJigHeight = Math.max(maxJigHeight, jig.height);
        }
        let belugaRack: fabric.Group = new fabric.Group([...belugaJigs]);
        this.canvas.add(belugaRack);
        bRack.fObj = belugaRack;
        this.sceneWidth = Math.max(
          this.sceneWidth,
          belugaRack.getX() + belugaRack.width
        );
        this.sceneHeight = Math.max(
          this.sceneHeight,
          belugaRack.getY() + belugaRack.height
        );
        belugaRackSplit += 1;
      }
    }

    // Draw Beluga Hangar
    let belugaHangarPart1 = this.drawHangar((length = 150));
    let belugaHangarPart2 = this.drawHangar((length = 20));
    belugaHangarPart2.set("scaleX", 0.7);
    belugaHangarPart2.set("scaleY", 0.7);
    belugaHangarPart2.set("left", 102);
    belugaHangarPart2.set("top", 122);
    for (let o in belugaHangarPart2.getObjects()) {
      belugaHangarPart2.getObjects()[o].set("fill", "#454545");
    }
    let belugaHangar = new fabric.Group([belugaHangarPart1, belugaHangarPart2]);
    this.setTooltip(belugaHangar, "Beluga hangar");
    belugaHangar.set("left", 200);
    belugaHangar.set("top", 50);
    this.canvas.add(belugaHangar);
    this.sceneWidth = Math.max(
      this.sceneWidth,
      belugaHangar.getX() + belugaHangar.width
    );
    this.sceneHeight = Math.max(
      this.sceneHeight,
      belugaHangar.getY() + belugaHangar.height
    );

    // Compute rack lengths
    let rNum: number = 0;
    let rLengths = this.currentState.racks.map((r: Rack) => r.length);
    let rMaxLength: number = Math.max(...rLengths);
    let itLengths = this.currentState.trailers
      .filter((r: Rack) => r.location.includes("inside"))
      .map((r: Rack) => r.length);
    let itMaxLength: number = Math.max(...itLengths);
    let otLengths = this.currentState.trailers
      .filter((r: Rack) => r.location.includes("outside"))
      .map((r: Rack) => r.length);
    let otMaxLength: number = Math.max(...otLengths);

    // Draw static racks
    this.currentState.racks.forEach((r: Rack) => {
      let rack: fabric.Group | null = null;
      rack = this.drawStorageRack(r.length * this.rackScale);
      rack.set(
        "left",
        belugaHangar.getX() +
          belugaHangar.width +
          2 * this.rackSpace +
          itMaxLength * this.rackScale
      );
      rack.set(
        "top",
        belugaHangar.getY() +
          belugaHangar.height -
          rack.height +
          rNum * this.rackSpace
      );
      r.fObj = rack;
      this.sceneWidth = Math.max(this.sceneWidth, rack.getX() + rack.width);
      this.sceneHeight = Math.max(this.sceneHeight, rack.getY() + rack.height);
      rNum += 1;
    });

    // Draw hangars
    for (let h: number = 0; h < this.currentState.hangars.length; h++) {
      let hangar = this.drawHangar(otMaxLength * this.rackScale);
      this.setTooltip(hangar, this.currentState.hangars[h].name);
      hangar.set(
        "left",
        belugaHangar.getX() +
          belugaHangar.width +
          4 * this.rackSpace +
          itMaxLength * this.rackScale +
          rMaxLength * this.rackScale +
          otMaxLength * this.rackScale
      );
      hangar.set(
        "top",
        belugaHangar.getY() +
          belugaHangar.height -
          hangar.height +
          2 * h * this.rackSpace
      );
      this.currentState.hangars[h].fObj = hangar;
      this.canvas.add(hangar);
      if (this.currentState.hangars[h].craning !== null) {
        let craningJig: Jig = this.currentState.hangars[h].craning as Jig;
        let jig = this.drawJig(craningJig);
        jig.set("top", hangar.getY() + hangar.height - jig.height);
        jig.set(
          "left",
          hangar.getX() +
            0.5 * hangar.width -
            0.5 * this.rackScale * craningJig.length
        );
        craningJig.fObj = jig;
        this.canvas.add(jig);
      }
      this.sceneWidth = Math.max(this.sceneWidth, hangar.getX() + hangar.width);
      this.sceneHeight = Math.max(
        this.sceneHeight,
        hangar.getY() + hangar.height
      );
    }

    // Draw factories
    for (let f: number = 0; f < this.currentState.factories.length; f++) {
      let factory = this.drawFactory(otMaxLength * this.rackScale);
      this.setTooltip(factory, this.currentState.factories[f].name);
      factory.set(
        "left",
        belugaHangar.getX() +
          belugaHangar.width +
          5 * this.rackSpace +
          itMaxLength * this.rackScale +
          rMaxLength * this.rackScale +
          2 * otMaxLength * this.rackScale
      );
      factory.set(
        "top",
        belugaHangar.getY() +
          belugaHangar.height -
          factory.height +
          2 * f * this.rackSpace
      );
      this.currentState.factories[f].fObj = factory;
      this.canvas.add(factory);
      this.sceneWidth = Math.max(
        this.sceneWidth,
        factory.getX() + factory.width
      );
      this.sceneHeight = Math.max(
        this.sceneHeight,
        factory.getY() + factory.height
      );
      let currentPartLeft =
        factory.getX() + factory.width + 0.2 * this.rackSpace;
      for (let p of this.currentState.factories[f].contains) {
        let part = this.drawPart(p);
        this.setTooltip(part, p.name.toString());
        part.set("left", currentPartLeft);
        part.set("top", factory.getY() + factory.height - part.height);
        currentPartLeft += part.width + 0.2 * this.rackSpace;
        this.canvas.add(part);
      }
    }

    // Draw mobile racks (aka trailers)
    this.currentState.trailers.forEach((t: Rack) => {
      let trailer: fabric.Group | null = null;
      trailer = this.drawStorageRack(t.length * this.rackScale, true);
      if (t.at != null) {
        let atHangar: Hangar | null = t.at.hangar;
        if (atHangar && atHangar.fObj) {
          trailer.set("left", atHangar.fObj.getX() + 20);
          trailer.set(
            "top",
            atHangar.fObj.getY() + atHangar.fObj.height - trailer.height
          );
        }

        let atRack: Rack | null = t.at.rack;
        let atSide: string | null = t.at.side;
        if (atRack && atSide) {
          if (atRack.name.includes("beluga")) {
            trailer.set("left", belugaHangar.getX() - 20);
            trailer.set(
              "top",
              belugaHangar.getY() + belugaHangar.height - trailer.height
            );
          } else if (atRack.fObj) {
            if (atSide === "beluga") {
              trailer.set(
                "left",
                atRack.fObj.getX() -
                  this.rackSpace -
                  itMaxLength * this.rackScale
              );
            } else if (atSide === "factory") {
              trailer.set(
                "left",
                atRack.fObj.getX() +
                  rMaxLength * this.rackScale +
                  this.rackSpace
              );
            }
            trailer.set("top", atRack.fObj.getY());
          }
        }
      }
      t.fObj = trailer;
      this.sceneWidth = Math.max(
        this.sceneWidth,
        trailer.getX() + trailer.width
      );
      this.sceneHeight = Math.max(
        this.sceneHeight,
        trailer.getY() + trailer.height
      );
    });

    // Draw rack tooltips
    let rackTooltipAndJigs = (r: Rack) => {
      let rack: fabric.Object | null = r.fObj;
      if (rack != null) {
        this.setTooltip(rack, r.name);
        this.canvas.add(rack);
        let jigStarts: number[] = [0];
        let used_space: number = 0;
        r.contains.forEach((j: Jig) => {
          if (jigStarts.length < r.contains.length) {
            jigStarts.push(
              jigStarts[jigStarts.length - 1] +
                (j.msn === null ? j.length : j.msn.length) * this.rackScale +
                0.1 * this.rackSpace
            );
            used_space +=
              (j.msn === null ? j.length : j.msn.length) * this.rackScale +
              0.1 * this.rackSpace;
          } else {
            used_space +=
              (j.msn === null ? j.length : j.msn.length) * this.rackScale;
          }
        });
        // Draw in reverse order to take rendering perspective into account
        let jigShift =
          rack.left + 0.5 * (r.length * this.rackScale - used_space);
        for (var ji: number = 0; ji < r.contains.length; ji++) {
          let j = r.contains[r.contains.length - 1 - ji];
          let jig = this.drawJig(j);
          jig.set("left", jigShift + jigStarts[jigStarts.length - 1 - ji]);
          jig.set("top", rack.top - 10 - 10 * (j.msn !== null ? 1 : 0));
          this.canvas.add(jig);
        }
      }
    };
    this.currentState.racks.forEach((r: Rack) => {
      rackTooltipAndJigs(r);
    });
    this.currentState.trailers.forEach((t: Rack) => {
      rackTooltipAndJigs(t);
    });

    if (resetViewport) {
      this.resetViewport();
    }

    this.canvas.renderAll();
  }

  canvasBelugaLoaded() {
    this.drawScene();
  }

  drawHangar(length: number = 100) {
    const hangarWall1 = new fabric.Rect({
      left: 150,
      top: 150,
      width: length,
      height: 20,
      fill: new fabric.Gradient({
        type: "linear",
        gradientUnits: "percentage",
        coords: { x1: 0, y1: 0, x2: 1, y2: 1 },
        colorStops: [
          { offset: 0, color: "#E8E8E8" },
          { offset: 1, color: "#808080" },
        ],
      }),
      stroke: "#000000",
      strokeWidth: 1,
    });

    const hangarWall2 = new fabric.Polygon(
      [
        { x: 0, y: 0 },
        { x: 40, y: 20 },
        { x: 40, y: 40 },
        { x: 0, y: 20 },
      ],
      {
        left: 110,
        top: 130,
        fill: new fabric.Gradient({
          type: "linear",
          gradientUnits: "percentage",
          coords: { x1: 1, y1: 0, x2: 0, y2: 1 },
          colorStops: [
            { offset: 0, color: "#E8E8E8" },
            { offset: 1, color: "#808080" },
          ],
        }),
        stroke: "#000000",
        strokeWidth: 1,
      }
    );

    const hangarWall3 = new fabric.Path("M 110 130 Q 135 100 150 150", {
      fill: new fabric.Gradient({
        type: "linear",
        gradientUnits: "percentage",
        coords: { x1: 1, y1: 0, x2: 0, y2: 1 },
        colorStops: [
          { offset: 0, color: "#E8E8E8" },
          { offset: 1, color: "#808080" },
        ],
      }),
      stroke: "#000000",
      strokeWidth: 1,
    });

    let end1 = (128 + length).toString();
    let end2 = (140 + length).toString();
    let end3 = (150 + length).toString();
    const hangarCeiling = new fabric.Path(
      `M 128 119 L ${end1} 119, Q ${end2} 120 ${end3} 150, L 150 150, Q 140 120 128 119`,
      {
        fill: new fabric.Gradient({
          type: "linear",
          gradientUnits: "percentage",
          coords: { x1: 0, y1: 1, x2: 1, y2: 0 },
          colorStops: [
            { offset: 0, color: "#E8E8E8" },
            { offset: 1, color: "#808080" },
          ],
        }),
        stroke: "#000000",
        strokeWidth: 1,
      }
    );

    return new fabric.Group([
      hangarWall1,
      hangarWall2,
      hangarWall3,
      hangarCeiling,
    ]);
  }

  drawBelugaAircraft() {
    return new fabric.FabricImage("beluga-image", {
      top: 30,
      left: -30,
      scaleX: 0.75,
      scaleY: 0.75,
      selectable: false,
      hoverCursor: "text",
    });
  }

  drawStorageRack(length: number, mobile: boolean = false) {
    let supports1: Array<fabric.Circle | fabric.Triangle> = [];
    let supportShift =
      length - this.rackWheelSpace * Math.floor(length / this.rackWheelSpace);
    if (mobile) {
      for (let i = 0; i <= Math.floor(length / this.rackWheelSpace); i++) {
        supports1.push(
          new fabric.Circle({
            radius: this.rackScale,
            left: -this.rackScale + supportShift / 2 + i * this.rackWheelSpace,
            top: this.rackScale,
            fill: new fabric.Gradient({
              type: "linear",
              gradientUnits: "percentage",
              coords: { x1: 1, y1: 1, x2: 0, y2: 0 },
              colorStops: [
                { offset: 0, color: "#E8E8E8" },
                { offset: 1, color: "#808080" },
              ],
            }),
            stroke: "#000000",
            strokeWidth: 1,
          })
        );
      }
    } else {
      for (let i = 0; i <= Math.floor(length / this.rackWheelSpace); i++) {
        supports1.push(
          new fabric.Triangle({
            left: -this.rackScale + supportShift / 2 + i * this.rackWheelSpace,
            top: this.rackScale,
            width: 2 * this.rackScale,
            height: 2 * this.rackScale,
            fill: new fabric.Gradient({
              type: "linear",
              gradientUnits: "percentage",
              coords: { x1: 1, y1: 1, x2: 0, y2: 0 },
              colorStops: [
                { offset: 0, color: "#E8E8E8" },
                { offset: 1, color: "#808080" },
              ],
            }),
            stroke: "#000000",
            strokeWidth: 1,
          })
        );
      }
    }

    const rackPane1 = new fabric.Rect({
      left: 0,
      top: 0,
      width: length,
      height: 5,
      fill: new fabric.Gradient({
        type: "linear",
        gradientUnits: "percentage",
        coords: { x1: 0, y1: 0, x2: 1, y2: 1 },
        colorStops: [
          { offset: 0, color: "#E8E8E8" },
          { offset: 1, color: "#808080" },
        ],
      }),
      stroke: "#000000",
      strokeWidth: 1,
    });

    const rackPane2 = new fabric.Polygon(
      [
        { x: 0, y: 0 },
        { x: 20, y: 10 },
        { x: 20, y: 15 },
        { x: 0, y: 5 },
      ],
      {
        left: 0,
        top: 0,
        fill: new fabric.Gradient({
          type: "linear",
          gradientUnits: "percentage",
          coords: { x1: 1, y1: 0, x2: 0, y2: 1 },
          colorStops: [
            { offset: 0, color: "#E8E8E8" },
            { offset: 1, color: "#808080" },
          ],
        }),
        stroke: "#000000",
        strokeWidth: 1,
      }
    );

    const rackPane3 = new fabric.Polygon(
      [
        { x: 0, y: 0 },
        { x: 20, y: 10 },
        { x: 20, y: 15 },
        { x: 0, y: 5 },
      ],
      {
        left: length,
        top: 0,
        fill: new fabric.Gradient({
          type: "linear",
          gradientUnits: "percentage",
          coords: { x1: 1, y1: 0, x2: 0, y2: 1 },
          colorStops: [
            { offset: 0, color: "#E8E8E8" },
            { offset: 1, color: "#808080" },
          ],
        }),
        stroke: "#000000",
        strokeWidth: 1,
      }
    );

    const rackPane4 = new fabric.Rect({
      left: 20,
      top: 10,
      width: length,
      height: 5,
      fill: new fabric.Gradient({
        type: "linear",
        gradientUnits: "percentage",
        coords: { x1: 0, y1: 0, x2: 1, y2: 1 },
        colorStops: [
          { offset: 0, color: "#E8E8E8" },
          { offset: 1, color: "#808080" },
        ],
      }),
      stroke: "#000000",
      strokeWidth: 1,
    });

    let panes: Array<fabric.Polygon> = [];
    let paneShift =
      length - this.rackPaneSpace * Math.floor(length / this.rackPaneSpace);
    for (let i = 0; i <= Math.floor(length / this.rackPaneSpace); i++) {
      panes.push(
        new fabric.Polygon(
          [
            { x: 0, y: 0 },
            { x: 5, y: 0 },
            { x: 25, y: 10 },
            { x: 20, y: 10 },
          ],
          {
            left: paneShift / 2 + i * this.rackPaneSpace - 2.5,
            top: 0,
            fill: new fabric.Gradient({
              type: "linear",
              gradientUnits: "percentage",
              coords: { x1: 1, y1: 1, x2: 0, y2: 0 },
              colorStops: [
                { offset: 0, color: "#E8E8E8" },
                { offset: 1, color: "#808080" },
              ],
            }),
            stroke: "#000000",
            strokeWidth: 1,
          }
        )
      );
    }

    let supports2: Array<fabric.Circle | fabric.Triangle> = [];
    if (mobile) {
      for (let i = 0; i <= Math.floor(length / this.rackWheelSpace); i++) {
        supports2.push(
          new fabric.Circle({
            radius: this.rackScale,
            left:
              20 - this.rackScale + supportShift / 2 + i * this.rackWheelSpace,
            top: 10 + this.rackScale,
            fill: new fabric.Gradient({
              type: "linear",
              gradientUnits: "percentage",
              coords: { x1: 1, y1: 1, x2: 0, y2: 0 },
              colorStops: [
                { offset: 0, color: "#E8E8E8" },
                { offset: 1, color: "#808080" },
              ],
            }),
            stroke: "#000000",
            strokeWidth: 1,
          })
        );
      }
    } else {
      for (let i = 0; i <= Math.floor(length / this.rackWheelSpace); i++) {
        supports2.push(
          new fabric.Triangle({
            left:
              20 - this.rackScale + supportShift / 2 + i * this.rackWheelSpace,
            top: 10 + this.rackScale,
            width: 2 * this.rackScale,
            height: 2 * this.rackScale,
            fill: new fabric.Gradient({
              type: "linear",
              gradientUnits: "percentage",
              coords: { x1: 1, y1: 1, x2: 0, y2: 0 },
              colorStops: [
                { offset: 0, color: "#E8E8E8" },
                { offset: 1, color: "#808080" },
              ],
            }),
            stroke: "#000000",
            strokeWidth: 1,
          })
        );
      }
    }

    return new fabric.Group([
      ...supports1,
      rackPane1,
      rackPane2,
      rackPane3,
      rackPane4,
      ...panes,
      ...supports2,
    ]);
  }

  drawFactory(length: number = 100) {
    const factoryWall1 = new fabric.Rect({
      left: 0,
      top: 0,
      width: length,
      height: 20,
      fill: new fabric.Gradient({
        type: "linear",
        gradientUnits: "percentage",
        coords: { x1: 0, y1: 0, x2: 1, y2: 1 },
        colorStops: [
          { offset: 0, color: "#E8E8E8" },
          { offset: 1, color: "#808080" },
        ],
      }),
      stroke: "#000000",
      strokeWidth: 1,
    });

    const factoryWall2 = new fabric.Polygon(
      [
        { x: 0, y: 0 },
        { x: 40, y: 20 },
        { x: 40, y: 40 },
        { x: 0, y: 20 },
      ],
      {
        left: -40,
        top: -20,
        fill: new fabric.Gradient({
          type: "linear",
          gradientUnits: "percentage",
          coords: { x1: 1, y1: 0, x2: 0, y2: 1 },
          colorStops: [
            { offset: 0, color: "#E8E8E8" },
            { offset: 1, color: "#808080" },
          ],
        }),
        stroke: "#000000",
        strokeWidth: 1,
      }
    );

    let nbCrenels: number = Math.floor(length / this.factoryCrenelSpace);
    let crenelSpace: number =
      this.factoryCrenelSpace +
      (length - this.factoryCrenelSpace * nbCrenels) / nbCrenels;
    let crenels: fabric.Group[] = [];
    for (let c = 0; c < nbCrenels; c++) {
      let crenelWall = new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: -crenelSpace, y: 0 },
          { x: 0, y: -30 },
        ],
        {
          left: length - (c + 1) * crenelSpace,
          top: -30,
          fill: new fabric.Gradient({
            type: "linear",
            gradientUnits: "percentage",
            coords: { x1: 0, y1: 1, x2: 1, y2: 1 },
            colorStops: [
              { offset: 0, color: "#E8E8E8" },
              { offset: 1, color: "#808080" },
            ],
          }),
          stroke: "#000000",
          strokeWidth: 1,
        }
      );
      let crenelCeiling = new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: crenelSpace, y: -30 },
          { x: 40 + crenelSpace, y: -10 },
          { x: 40, y: 20 },
        ],
        {
          left: length - (c + 1) * crenelSpace - 40,
          top: -50,
          fill: new fabric.Gradient({
            type: "linear",
            gradientUnits: "percentage",
            coords: { x1: 1, y1: 1, x2: 0, y2: 0 },
            colorStops: [
              { offset: 0, color: "#E8E8E8" },
              { offset: 1, color: "#808080" },
            ],
          }),
          stroke: "#000000",
          strokeWidth: 1,
        }
      );
      crenels.push(new fabric.Group([crenelCeiling, crenelWall]));
    }

    return new fabric.Group([factoryWall1, factoryWall2, ...crenels]);
  }

  drawJig(jig: Jig) {
    let jigColor: { r: number; g: number; b: number } =
      // trick to space out jig colors when the first few jigs are in the scene
      this.jigColors[
        jig.id * 2 < this.jigColors.length
          ? jig.id * 2
          : jig.id * 2 - this.jigColors.length + 1
      ];
    let floor = new fabric.Polygon(
      [
        { x: 0, y: 0 },
        { x: this.rackScale * jig.length, y: 0 },
        { x: 20 + this.rackScale * jig.length, y: 10 },
        { x: 20, y: 10 },
      ],
      {
        fill: new fabric.Gradient({
          type: "linear",
          gradientUnits: "percentage",
          coords: { x1: 1, y1: 1, x2: 0, y2: 0 },
          colorStops: [
            {
              offset: 0,
              color: `rgb(${jigColor.r}, ${jigColor.g}, ${jigColor.b})`,
            },
            {
              offset: 1,
              color: `rgb(${0.5 * jigColor.r}, ${0.5 * jigColor.g}, ${
                0.5 * jigColor.b
              })`,
            },
          ],
        }),
        stroke: "#000000",
        strokeWidth: 1,
        opacity: 0.75,
      }
    );

    let rearPane = new fabric.Rect({
      left: 0,
      top: -10,
      width: jig.length * this.rackScale,
      height: 10,
      stroke: `rgb(${jigColor.r}, ${jigColor.g}, ${jigColor.b})`,
      strokeWidth: 2,
      fill: "transparent",
    });

    let frontPane = new fabric.Rect({
      left: 20,
      top: 0,
      width: jig.length * this.rackScale,
      height: 10,
      stroke: `rgb(${jigColor.r}, ${jigColor.g}, ${jigColor.b})`,
      strokeWidth: 2,
      fill: "transparent",
    });

    let nbRungs: number = Math.floor(
      (jig.length * this.rackScale) / (0.5 * this.rackPaneSpace)
    );
    let rungSpace: number =
      0.5 * this.rackPaneSpace +
      (jig.length * this.rackScale - 0.5 * this.rackPaneSpace * nbRungs) /
        nbRungs;
    let rearRungs: Array<fabric.Line> = [];
    let frontRungs: Array<fabric.Line> = [];
    for (let i = 1; i < nbRungs; i++) {
      rearRungs.push(
        new fabric.Line([i * rungSpace, -10, i * rungSpace, 0], {
          stroke: `rgb(${jigColor.r}, ${jigColor.g}, ${jigColor.b})`,
          strokeWidth: 2,
        })
      );
      frontRungs.push(
        new fabric.Line([20 + i * rungSpace, 0, 20 + i * rungSpace, 10], {
          stroke: `rgb(${jigColor.r}, ${jigColor.g}, ${jigColor.b})`,
          strokeWidth: 2,
        })
      );
    }

    if (jig.msn === null) {
      let g = new fabric.Group([
        floor,
        rearPane,
        ...rearRungs,
        frontPane,
        ...frontRungs,
      ]);
      this.setTooltip(g, jig.name);
      jig.fObj = g;
      return g;
    } else {
      let part = this.drawPart(jig.msn);
      part.set("left", -0.5 * (jig.msn.length - jig.length) * this.rackScale);
      jig.msn.fObj = part;
      let g1 = new fabric.Group([floor, rearPane, ...rearRungs]);
      let g2 = new fabric.Group([frontPane, ...frontRungs]);
      let g = new fabric.Group([g1, part, g2]);
      jig.fObj = g;
      this.setTooltip(g, jig.name + " (loaded)");
      return g;
    }
  }

  drawPart(part: Part) {
    let index =
      part.id * 2 < this.partColors.length
        ? part.id * 2
        : 2 * (this.partColors.length - part.id) - 1;
    // trick to space out part colors when the first few parts are in the scene

    let partColor: { r: number; g: number; b: number } = this.partColors[index];
    let rearPane = new fabric.Rect({
      left: 0,
      top: -20,
      width: part.length * this.rackScale,
      height: 20,
      fill: new fabric.Gradient({
        type: "linear",
        gradientUnits: "percentage",
        coords: { x1: 1, y1: 1, x2: 0, y2: 0 },
        colorStops: [
          {
            offset: 0,
            color: `rgb(${partColor.r} ${partColor.g} ${partColor.b})`,
          },
          {
            offset: 1,
            color: `rgb(${0.5 * partColor.r} ${0.5 * partColor.g} ${
              0.5 * partColor.b
            })`,
          },
        ],
      }),
      stroke: `rgb(${partColor.r} ${partColor.g} ${partColor.b})`,
      strokeWidth: 1,
      opacity: 0.75,
    });

    let bottomPane = new fabric.Polygon(
      [
        { x: 0, y: 0 },
        { x: part.length * this.rackScale, y: 0 },
        { x: 20 + part.length * this.rackScale, y: 10 },
        { x: 20, y: 10 },
      ],
      {
        fill: new fabric.Gradient({
          type: "linear",
          gradientUnits: "percentage",
          coords: { x1: 1, y1: 1, x2: 0, y2: 0 },
          colorStops: [
            {
              offset: 0,
              color: `rgb(${partColor.r} ${partColor.g} ${partColor.b})`,
            },
            {
              offset: 1,
              color: `rgb(${0.5 * partColor.r} ${0.5 * partColor.g} ${
                0.5 * partColor.b
              })`,
            },
          ],
        }),
        stroke: `rgb(${partColor.r} ${partColor.g} ${partColor.b})`,
        strokeWidth: 1,
        opacity: 0.75,
      }
    );

    let rightPane = new fabric.Polygon(
      [
        { x: part.length * this.rackScale, y: -20 },
        { x: 20 + part.length * this.rackScale, y: -10 },
        { x: 20 + part.length * this.rackScale, y: 10 },
        { x: part.length * this.rackScale, y: 0 },
      ],
      {
        fill: new fabric.Gradient({
          type: "linear",
          gradientUnits: "percentage",
          coords: { x1: 1, y1: 1, x2: 0, y2: 0 },
          colorStops: [
            {
              offset: 0,
              color: `rgb(${partColor.r} ${partColor.g} ${partColor.b})`,
            },
            {
              offset: 1,
              color: `rgb(${0.5 * partColor.r} ${0.5 * partColor.g} ${
                0.5 * partColor.b
              })`,
            },
          ],
        }),
        stroke: `rgb(${partColor.r} ${partColor.g} ${partColor.b})`,
        strokeWidth: 1,
        opacity: 0.75,
      }
    );

    let topPane = new fabric.Polygon(
      [
        { x: 0, y: -20 },
        { x: part.length * this.rackScale, y: -20 },
        { x: 20 + part.length * this.rackScale, y: -10 },
        { x: 20, y: -10 },
      ],
      {
        fill: new fabric.Gradient({
          type: "linear",
          gradientUnits: "percentage",
          coords: { x1: 1, y1: 1, x2: 0, y2: 0 },
          colorStops: [
            {
              offset: 0,
              color: `rgb(${partColor.r} ${partColor.g} ${partColor.b})`,
            },
            {
              offset: 1,
              color: `rgb(${0.5 * partColor.r} ${0.5 * partColor.g} ${
                0.5 * partColor.b
              })`,
            },
          ],
        }),
        stroke: `rgb(${partColor.r} ${partColor.g} ${partColor.b})`,
        strokeWidth: 1,
        opacity: 0.75,
      }
    );

    let leftPane = new fabric.Polygon(
      [
        { x: 0, y: -20 },
        { x: 20, y: -10 },
        { x: 20, y: 10 },
        { x: 0, y: 0 },
      ],
      {
        fill: new fabric.Gradient({
          type: "linear",
          gradientUnits: "percentage",
          coords: { x1: 1, y1: 1, x2: 0, y2: 0 },
          colorStops: [
            {
              offset: 0,
              color: `rgb(${partColor.r} ${partColor.g} ${partColor.b})`,
            },
            {
              offset: 1,
              color: `rgb(${0.5 * partColor.r} ${0.5 * partColor.g} ${
                0.5 * partColor.b
              })`,
            },
          ],
        }),
        stroke: `rgb(${partColor.r} ${partColor.g} ${partColor.b})`,
        strokeWidth: 1,
        opacity: 0.75,
      }
    );

    let frontPane = new fabric.Rect({
      left: 20,
      top: -10,
      width: part.length * this.rackScale,
      height: 20,
      fill: new fabric.Gradient({
        type: "linear",
        gradientUnits: "percentage",
        coords: { x1: 1, y1: 1, x2: 0, y2: 0 },
        colorStops: [
          {
            offset: 0,
            color: `rgb(${partColor.r} ${partColor.g} ${partColor.b})`,
          },
          {
            offset: 1,
            color: `rgb(${0.5 * partColor.r} ${0.5 * partColor.g} ${
              0.5 * partColor.b
            })`,
          },
        ],
      }),
      stroke: `rgb(${partColor.r} ${partColor.g} ${partColor.b})`,
      strokeWidth: 1,
      opacity: 0.75,
    });

    return new fabric.Group([
      bottomPane,
      rearPane,
      rightPane,
      topPane,
      leftPane,
      frontPane,
    ]);
  }

  loadProblem() {
    let problem: BelugaProblem = this.belugaProblem();
    this.initialState = new State();
    this.currentState = new State();
    this.rackNameToIndex.clear();
    this.trailerNameToIndex.clear();
    this.factoryNameToIndex.clear();
    this.hangarNameToIndex.clear();

    this.currentState.flight = null;
    this.maxNbJigs = 0;
    this.maxNbParts = 0;
    this.registeredJigsInScene = 0;
    this.registeredPartsInScene = 0;

    if (problem.flights.length > 0) {
      this.currentState.flight = {
        name: problem.flights[0].name,
        ins: {
          name: "beluga-ins",
          length: 50, // hard coded,
          location: "beluga",
          contains: new Array<Jig>(),
          at: null,
          fObj: null,
        },
        outs: {
          name: "beluga-outs",
          length: 50, // hard coded,
          location: "beluga",
          contains: new Array<Jig>(),
          at: null,
          fObj: null,
        },
        num: 0,
        trailer: null,
      } as Flight;
      for (let ctn of problem.flights[0].incoming) {
        let jig: Jig | undefined = this.createAndRegisterJig(ctn);
        if (jig) {
          this.currentState.flight.ins.contains.push(jig);
        }
        this.maxNbJigs += 1;
        if (!problem.jigs[ctn].empty) {
          this.maxNbParts += 1;
        }
      }
    }

    for (let ri = 0; ri < problem.racks.length; ri++) {
      let rack: RackBP = problem.racks[ri];
      this.rackNameToIndex.set(rack.name, ri);
      this.currentState.racks.push({
        name: rack.name,
        length: rack.size,
        type: "Static Rack",
        location: "outside",
        contains: [],
        at: null,
        bside_trailer: null,
        fside_trailer: null,
        fObj: null,
      } as Rack);
      for (let ctn of problem.racks[ri].jigs) {
        let jig: Jig | undefined = this.createAndRegisterJig(ctn);
        if (jig) {
          this.currentState.racks[ri].contains.push(jig);
        }
        this.maxNbJigs += 1;
        if (!problem.jigs[ctn].empty) {
          this.maxNbParts += 1;
        }
      }
    }
    this.currentState.trailers.forEach((trailer: Rack) => {
      trailer.contains = new Array<Jig>();
    });
    for (let ti = 0; ti < problem.trailers_beluga.length; ti++) {
      let trailer: TrailerBP = problem.trailers_beluga[ti];
      this.trailerNameToIndex.set(trailer.name, ti);
      this.currentState.trailers.push({
        name: trailer.name,
        length: 50, // hard coded
        type: "Mobile Rack",
        location: "inside",
        contains: [],
        at: {
          rack: this.currentState.racks[ti],
          side: "beluga",
          hangar: null,
        },
        bside_trailer: null,
        fside_trailer: null,
        fObj: null,
      } as Rack);
      this.currentState.racks[ti].bside_trailer =
        this.currentState.trailers[ti];
    }
    for (let ti = 0; ti < problem.trailers_factory.length; ti++) {
      let trailer: TrailerBP = problem.trailers_factory[ti];
      this.trailerNameToIndex.set(
        trailer.name,
        problem.trailers_beluga.length + ti
      );
      this.currentState.trailers.push({
        name: trailer.name,
        length: 50, // hard coded
        type: "Mobile Rack",
        location: "outside",
        contains: [],
        at: {
          rack: this.currentState.racks[ti],
          side: "factory",
          hangar: null,
        },
        bside_trailer: null,
        fside_trailer: null,
        fObj: null,
      } as Rack);
      this.currentState.racks[ti].fside_trailer =
        this.currentState.trailers[ti];
    }
    for (let hi = 0; hi < problem.hangars.length; hi++) {
      this.hangarNameToIndex.set(problem.hangars[hi], hi);
      this.currentState.hangars.push({
        name: problem.hangars[hi],
        craning: null,
        trailer: null,
        fObj: null,
      });
    }
    this.currentState.factories.forEach((factory: Factory) => {
      factory.contains = new Array<Part>();
    });
    for (let fi = 0; fi < problem.production_lines.length; fi++) {
      let factory: ProductionLineBP = problem.production_lines[fi];
      this.factoryNameToIndex.set(factory.name, fi);
      this.currentState.factories.push({
        name: factory.name,
        contains: [],
        fObj: null,
      });
    }
    for (let flight of problem.flights) {
      for (let ctn of flight.incoming) {
        this.maxNbJigs += 1;
        if (!problem.jigs[ctn].empty) {
          this.maxNbParts += 1;
        }
      }
    }
    this.jigColors = [];
    for (let c = 0; c < this.maxNbJigs; c++) {
      this.jigColors.push(
        colorsys.hsv2Rgb(
          (c * 360.0) / (this.maxNbJigs + this.maxNbParts),
          50,
          50
        )
      );
    }
    this.partColors = [];
    for (let c = 0; c < this.maxNbParts; c++) {
      this.partColors.push(
        colorsys.hsv2Rgb(
          ((c + this.maxNbJigs) * 360.0) / (this.maxNbJigs + this.maxNbParts),
          50,
          50
        )
      );
    }
    this.initiallyRegisteredJigsInScene = this.registeredJigsInScene;
    this.initiallyRegisteredPartsInScene = this.registeredPartsInScene;
    this.initialState = this.currentState.copy();
    this.stateHistory = [];

    // Draw the scene
    this.drawScene();
  }

  loadPlan() {
    let plan = this.actions();
    if (plan !== null) {
      this.solutionPlan = plan;
      this.currentAction = 0;
      this.stateHistory = [];
      this.stateHistory.push(this.initialState.copy());
      this.currentState = this.initialState.copy();
      this.simulationActivated = this.solutionPlan.length > 0;
      this.canMoveForward = this.solutionPlan.length > 0;
      this.canMoveBackward = false;
      this.registeredJigsInScene = this.initiallyRegisteredJigsInScene;
      this.registeredPartsInScene = this.initiallyRegisteredPartsInScene;
      this.drawScene();
    }
  }

  createAndRegisterJig(ctn: string) {
    if (ctn in this.belugaProblem().jigs) {
      let jigBP: JigBP = this.belugaProblem().jigs[ctn];
      let part: Part | null = null;
      if (!jigBP.empty) {
        part = {
          name: "",
          length: this.belugaProblem().jig_types[jigBP.type].size_loaded,
          id: this.registeredPartsInScene,
          fObj: null,
        };
        this.registeredPartsInScene += 1;
      }
      const jig: Jig = {
        name: jigBP.name,
        length: this.belugaProblem().jig_types[jigBP.type].size_empty,
        msn: part,
        id: this.registeredJigsInScene,
        fObj: null,
      };
      this.registeredJigsInScene += 1;
      return jig;
    } else {
      return undefined;
    }
  }

  setTooltip(obj: fabric.FabricObject, tooltip: string) {
    let text = new fabric.FabricText(tooltip, {
      fontSize: 30,
      shadow: new fabric.Shadow({
        color: "grey",
        blur: 2,
        offsetX: 3,
        offsetY: 3,
      }),
      fill: "green",
      stroke: "black",
      originX: "left",
      originY: "top",
    });

    obj.on("mouseover", (e: any) => {
      obj.scale(1.25);
      obj.opacity = 0.5;
      obj.setX(obj.getX() - 0.5 * (0.25 / 1.25) * obj.getScaledWidth());
      obj.setY(obj.getY() - 0.5 * (0.25 / 1.25) * obj.getScaledHeight());
      obj.set(
        "shadow",
        new fabric.Shadow({
          color: "grey",
          blur: 2,
          offsetX: 3,
          offsetY: 3,
        })
      );
      text.set("left", e.target.left);
      text.set("top", e.target.top);
      this.canvas.add(text);
      // this.canvas.setCursor('finger');
      this.canvas.renderAll();
    });

    obj.on("mouseout", (e: any) => {
      obj.setX(obj.getX() + 0.5 * (0.25 / 1.25) * obj.getScaledWidth());
      obj.setY(obj.getY() + 0.5 * (0.25 / 1.25) * obj.getScaledHeight());
      obj.scale(1);
      obj.opacity = 1;
      obj.set("shadow", {});
      this.canvas.remove(text);
      this.canvas.renderAll();
    });
  }
}
