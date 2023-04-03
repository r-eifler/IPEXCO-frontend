import { GeneralSettings } from 'src/app/interface/settings/general-settings';
import { SelectedIterationStepService } from 'src/app/service/planner-runs/selected-iteration-step.service';
import { PPDependencies } from 'src/app/interface/explanations';
import { OnDestroy } from '@angular/core';
import { PlanProperty } from 'src/app/interface/plan-property/plan-property';
import { Observable, Subject } from 'rxjs';
import { PlanPropertyMapService } from 'src/app/service/plan-properties/plan-property-services';
import { RunningDemoService } from 'src/app/service/demo/demo-services';
import { Component, OnInit} from '@angular/core';
import { Demo } from 'src/app/interface/demo';
import { filter, map, takeUntil, take } from 'rxjs/operators';
import { getAllDependencies, getAllReleventDependencies, IterationStep } from 'src/app/interface/run';
import * as d3 from 'd3';
import { combineLatest } from "rxjs/internal/observable/combineLatest";
import { CurrentProjectService } from 'src/app/service/project/project-services';

@Component({
  selector: 'app-mugs-visu-main',
  templateUrl: './mugs-visu-main.component.html',
  styleUrls: ['./mugs-visu-main.component.scss']
})

export class MUGSVisuMainComponent implements OnInit, OnDestroy {

  private unsubscribe$: Subject<any> = new Subject();


  /*
    Stores the general information about the planning task
    The baseTask field stores the planning task.
    One can use it to acess all objects present in the planning task
  */
  demo$: Observable<Demo>;

  /*
    The current selected set. Stores the currently enforced planproperties as
    "hard goals"
  */
  selectedStep$: Observable<IterationStep>

  /*
    MUGS/goal conflicts
    Given by lists of planProperty ids
  */
  conflicts$:  Observable<PPDependencies>;

  /*
    Map of planproperty id to plan property objects
    Those are the elemets of the MUGS/conflicts.
    All mentinoed property have default values which can be changed in the
    properties overview in the project
    They contain:
      - naturalLanguageDescription: a natural language sentence describing the property
      - class: name of the class the property is group into
      - color: hex value
      - icon: mat icon name
    All of these properties can be modified in the demo collection -> Menue --> Modify --> PlanProperties

    There is currently no easy why to access all object conatined in a plan
    property. The only possibility is to parse the formula itself.
    TODO: add fieled storing all objects selected during the creation of the plan property.
  */
  planProperties$: Observable<Map<string, PlanProperty>>;

  settings$: Observable<GeneralSettings>;

  height: number;
  width: number;
  margin: { top: number, right: number, left: number, bottom: number};
  boxSize: number;
  xIndex: number;
  yIndex: number;
  xSort: number;
  ySort: number;
  collapseStart: number = -1;
  fillColor: String = "";
  optioned: String = "option1";
  dummy: Array<any> = [];
  arrPlanProperties: Array<any> = [];
  arrDescription: Array<any> = [];
  arrConflict: Array<any> = [];
  tempArr: Array<any> = [];
  arrSort: Array<any> = [];
  userGoal: Array<any> = [];
  occRate: Array<any> = [];
  group: Array<any> =[];
  stickyHeader;
  svg;
  tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  boxtip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  plantip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

  constructor(
    demoService: RunningDemoService,
    planPropertiesService: PlanPropertyMapService,
    stepService: SelectedIterationStepService,
    private currentProjectService: CurrentProjectService
  ) {

    // Access the data over these observables
    // If you subscribe to one, please add takeUntil(this.unsubscribe$) in the pipe
    this.settings$ = this.currentProjectService.getSelectedObject().pipe(
      filter((p) => !!p),
      map((project) => project.settings)
    );

    this.demo$ = demoService.getSelectedObject();
    this.selectedStep$ = stepService.getSelectedObject();

    this.conflicts$ = combineLatest([this.selectedStep$, this.settings$]).pipe(
      takeUntil(this.unsubscribe$),
      filter(([step, settings]) => !!step && !!settings),
      map(([step, settings]) => settings.globalExplanation ? getAllDependencies(step) : getAllReleventDependencies(step))
    );
    this.planProperties$ = planPropertiesService.getMap();
  }

  generateD3Components(): void {
    //set up svg for sticky header
    this.stickyHeader = d3.select("#head")
      .append("svg")
      .attr("height", 300)
      .attr("width", this.width)
      .style("margin-left", 50)
      .style("position", "absolute");

    //set up svg for drawing
    this.svg = d3.select("#vis")
      .append("svg")
      .attr("height", this.height)
      .attr("width", this.width)
      .attr("id","mainVis")
      .style("margin-left", 50)
      .style("position", "absolute");

    //define a tooltip for MUGS
    this.tooltip = d3.select("#vis")
      .append("div")
      .style("opacity", 0)
      .attr("id", "tooltip")
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("position", "absolute");

    //define a tooltip for box
    this.boxtip = d3.select("#vis")
      .append("div")
      .style("opacity", 0)
      .attr("id", "boxtip")
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("position", "absolute");

    //define a tooltip for plans
    this.plantip = d3.select("#head")
      .append("div")
      .style("opacity", 0)
      .attr("id","plantip")
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("position", "absolute");
  }

  loadVis():void {

    combineLatest([
      this.planProperties$,
      this.demo$,
      this.conflicts$
    ]).pipe(
      //check if var is defined
      filter(([planProperties, demo, conflict]) => !!planProperties && !!demo && !!conflict),
      //unsubscribe if not needed, save resources
      take(1)
    ).subscribe(([planProperties, demo, conflict]) => {
      //console.log(demo);
      //console.log(planProperties);

      //retrieve all plan properties from here ==> use as x-axis (goal)
      if (this.arrPlanProperties.length  == 0 ) {
        for (var i = 0; i < Array.from(planProperties.values()).length; i++) {
          this.arrPlanProperties.push(Array.from(planProperties.values())[i].name);
          this.arrDescription.push(Array.from(planProperties.values())[i].naturalLanguageDescription);
        }
      }

      //console.log(this.arrPlanProperties);

      if (this.dummy.length == 0 ) {
        //retrieve all conflicts from here ==> use as y-axis (MUGS)
        for (var i = 0; i < conflict.conflicts.length; i++) {
          this.dummy.push("MUGS" + (i + 1));

          for (var j = 0; j < conflict.conflicts[i].elems.length; j++) {
            for (var k = 0; k < Array.from(planProperties.values()).length; k++) {
              if (conflict.conflicts[i].elems[j] == Array.from(planProperties.values())[k]._id) {
                this.tempArr.push(Array.from(planProperties.values())[k].name);
              }
            }
          }
          this.arrConflict.push(this.tempArr);
          this.tempArr = [];
        }
      }
      //console.log(this.arrConflict);
      //console.log(this.arrPlanProperties);

      //setup checkbox with original arrConflict & arrPlanProperties
      if (this.dummy.lastIndexOf("collapsed row") < 0) {
        this.checkboxInit();
      }

      //sort by selection
      this.sort();

      //create new arrays
      if (this.optioned != "option5") {
        this.filter();
      } else {
        //clear the previous vis
        this.svg.selectAll("*").remove();
        this.stickyHeader.selectAll("*").remove();
      }


      //group the mugs
      this.treeGroup();

      if (this.group.length > 0){
        for (var i = 0; i < this.group.length; i= i+3) {
          for (var j = 0; j< this.dummy.length; j++) {
            if (this.dummy[j] == this.group[i][0]) {
              console.log(this.occRate[i]);
              console.log(this.group[i + 1]);
              this.dummy[j] = this.occRate[i / 3 * 2];
              this.arrConflict[j] = this.group[i + 1];
              this.dummy.splice((j + 1), (this.group[i].length - 1));
              this.arrConflict.splice((j + 1), (this.group[i].length - 1));

            }
          }
        }
      }
      //console.log(this.dummy);
      //console.log(this.arrConflict);
      //console.log(this.group);
      //console.log(this.occRate);
      //console.log(this.dummy);
      //console.log(this.arrConflict);
      //console.log(this.arrPlanProperties);

      //re-setup height of svg
      this.height = (this.boxSize + 3) * this.dummy.length + this.margin.top + this.margin.bottom;
      this.svg.attr("height", this.height);

      //set up axis
      var x = d3.scaleBand()
        .domain(this.arrPlanProperties)
        .range([this.margin.left, this.width - this.margin.right]);

      var y = d3.scaleBand()
        .domain(this.dummy)
        .range([this.margin.top, this.height - this.margin.bottom]);

      var xAxis = d3.axisTop(x);
      var yAxis = d3.axisLeft(y);

      //add background color for better difference
      for (var i = 0; i < this.dummy.length; i++) {
        this.svg.append("rect")
          .attr("x", this.margin.left)
          //.attr("y", margin.top + (height - margin.bottom - margin.top) / dummy.length * i)
          //split svg into 2, no need to consider margin-top
          .attr("y", (this.height - this.margin.bottom - this.margin.top) / this.dummy.length * i + 1)
          .attr("width", this.width - this.margin.right - this.margin.left)
          .attr("height", (this.height - this.margin.bottom - this.margin.top) / this.dummy.length)
          .attr("fill", function (d) {
            if (i % 2 == 0) {
              return "#f7f7f7";
            }
            else {
              return "#ffffff";
            }
          });
      }

      //add transparent squares to allow collapse "not include" group
      for (var i = 0; i < this.dummy.length; i++) {
        for (var j = 0; j < this.arrPlanProperties.length; j++) {
          this.svg.append("rect")
            .attr("x", this.margin.left + (this.width - this.margin.right - this.margin.left) / this.arrPlanProperties.length * 0.5 * (2 * j + 1) - 0.5 * this.boxSize)
            .attr("y", 0.5 * (this.height - this.margin.bottom - this.margin.top) / this.dummy.length * (2 * i + 1) - 0.5 * this.boxSize + 1)
            .attr("width", this.boxSize)
            .attr("height", this.boxSize)
            .style("fill", "transparent")
            .on("click", (e: any) => {
              this.collapseRow(e);
            });;
        }
      }

      //add x-axis to svg
      this.stickyHeader.append("g")
        .attr("transform", `translate(0,${this.margin.top})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "translate(0,-10)rotate(-30)")
        .style("text-anchor", "start")
        .on("mouseover" , (e: any, d) => {
          this.plantip.transition()
            .duration(200)
            .style("opacity", 0.9);
          this.plantip.html(this.arrDescription[this.arrPlanProperties.lastIndexOf(d)].toString())
            .style("left", (e.clientX - 550) + "px")
            .style("top", () => {
              if ((e.clientY - 400 - this.margin.top + document.getElementById("vis").scrollTop) < 0) {
                return "1px";
              } else {
                return (e.clientY - 400 - this.margin.top + document.getElementById("vis").scrollTop) + "px";
              }
            });
        })
        .on("mouseout", (e: any, d) => {
          this.plantip.transition()
            .duration(200)
            .style("opacity", 0);
        });

      //add y-axis to svg
      this.svg.append("g")
        //.attr("transform", `translate(${width - margin.right},0)`)
        .attr("transform", `translate(${this.width - this.margin.right},${0 - this.margin.top})`)
        .call(yAxis)
        .selectAll("text")
        .attr("transform", "translate(70,0)")
        .on("mouseover", (e: any, d) => {
          this.tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
          this.tooltip.html(this.arrConflict[this.dummy.lastIndexOf(d)].toString().replace(/,/g, "</br>"))
            .style("left", (e.clientX - 500) + "px")
            .style("top", () => {
              if ((e.clientY - 210 - this.margin.top + document.getElementById("vis").scrollTop) < 0) {
                return "1px";
              } else {
                return (e.clientY - 210 - this.margin.top + document.getElementById("vis").scrollTop) + "px";
              }
            });
        })
        .on("mouseout", (e: any, d) => {
          this.tooltip.transition()
            .duration(200)
            .style("opacity", 0);
        });

      //add box to svg
      for (var i = 0; i < this.arrConflict.length; i++) {
        for (var j = 0; j < this.arrConflict[i].length; j++) {

          this.xIndex = this.arrPlanProperties.lastIndexOf(this.arrConflict[i][j]);
          this.yIndex = i;
          //match color
          for (var k = 0; k < Array.from(planProperties.values()).length; k++) {
            if (this.arrConflict[i][j] == Array.from(planProperties.values())[k].name) {
              this.fillColor = Array.from(planProperties.values())[k].color;
            }
          }

          if (this.dummy[i].indexOf("collapsed row") < 0) {

              this.svg.append("rect")
                .attr("x", this.margin.left + (this.width - this.margin.right - this.margin.left) / this.arrPlanProperties.length * 0.5 * (2 * this.xIndex + 1) - 0.5 * this.boxSize)
                //split svg into 2, no need to consider margin-top
                //.attr("y", margin.top + 0.5 * (height - margin.bottom - margin.top) / dummy.length * (2 * yIndex + 1) - 0.5 * boxSize)
                .attr("y", 0.5 * (this.height - this.margin.bottom - this.margin.top) / this.dummy.length * (2 * this.yIndex + 1) - 0.5 * this.boxSize + 1)
                .attr("width", this.boxSize)
                .attr("height", this.boxSize)
                .style("fill", this.fillColor)
                .text("rect")
                //add tooltip function
                .on("mouseover", (e: any) => {

                  this.boxtip.transition()
                    .duration(200)
                    .style("opacity", 0.9)
                    .style("pointer-events", "auto");
                  //boxtip.html(dataset[dummy.lastIndexOf(d)].toString().replace(/,/g, "</br>"))
                  //console.log("d.x: " + this.x.animVal.value);
                  //console.log("recalc: " + Math.round(((this.x.animVal.value + 0.5 * boxSize - margin.left) / 0.5 * arrPlanProperties.length / (width - margin.right - margin.left) - 1) / 2))

                  var newX = Math.round(((e.target.x.animVal.value + 0.5 * this.boxSize - this.margin.left) / 0.5 * this.arrPlanProperties.length / (this.width - this.margin.right - this.margin.left) - 1) / 2);
                  var newY = Math.round(((e.target.y.animVal.value + 0.5 * this.boxSize - 1) / 0.5 * this.dummy.length / (this.height - this.margin.bottom - this.margin.top) - 1) / 2);

                  this.boxtip.html("Goal: " + this.arrPlanProperties[newX] + "</br>" + "belongs to: " + this.dummy[newY])
                    .style("left", (e.clientX - 500) + "px")
                    .style("top", () => {
                      //console.log("scrollTop: " + document.getElementById("vis").scrollTop);
                      if ((e.clientY - 210 - this.margin.top + document.getElementById("vis").scrollTop) < 0) {
                        return "1px";
                      } else {
                        return (e.clientY - 210 - this.margin.top + document.getElementById("vis").scrollTop) + "px";
                      }
                    });

                  //highlight those rect in column
                  var reColor = document.getElementsByTagName("rect");
                  //console.log(reColor);
                  for (var i = 0; i < reColor.length; i++) {
                    if (reColor[i].x.animVal.value == e.target.x.animVal.value && reColor[i].style.fill != "transparent") {
                      reColor[i].style.stroke = "#000000";
                      reColor[i].style.strokeWidth = "2";
                    }
                  }

                })
                .on("mouseout", (e: any) => {
                  this.boxtip.transition()
                    .duration(200)
                    .style("opacity", 0)
                    .style("pointer-events", "none");

                  //unhighlight those rect in column
                  var noColor = document.getElementsByTagName("rect");
                  //console.log(noColor);
                  for (var i = 0; i < noColor.length; i++) {
                    noColor[i].style.stroke = "none";
                  }
                })
                .on("click", (e: any) => {
                  this.collapseRow(e);
                });

          } else {
            //when a row is collapsed row
            //draw a darker background first
            this.svg.append("rect")
              .attr("x", this.margin.left)
              .attr("y", (this.height - this.margin.bottom - this.margin.top) / this.dummy.length * i + 1)
              .attr("width", this.width - this.margin.right - this.margin.left)
              .attr("height", (this.height - this.margin.bottom - this.margin.top) / this.dummy.length)
              .style("fill", "#b2b2b2")
              .style("opacity", "0.1")
              .style("border", "20px groove black")
              .style("border-radius", "5px")
              .style("pointer-events", "none");

            var rateSearch = this.occRate.indexOf(this.dummy[i]);

            //draw rect
            this.svg.append("rect")
              .attr("x", this.margin.left + (this.width - this.margin.right - this.margin.left) / this.arrPlanProperties.length * 0.5 * (2 * this.xIndex + 1) - 0.5 * this.boxSize)
              .attr("y", 0.5 * (this.height - this.margin.bottom - this.margin.top) / this.dummy.length * (2 * this.yIndex + 1) - 0.5 * this.boxSize + 1 + (1 - this.occRate[rateSearch + 1][this.xIndex]) * this.boxSize)
              .attr("width", this.boxSize)
              .attr("height", this.occRate[rateSearch + 1][this.xIndex] * this.boxSize)
              .style("fill", this.fillColor)
              .text("rect")
              //add tooltip function
              .on("mouseover", (e: any) => {

                this.boxtip.transition()
                  .duration(200)
                  .style("opacity", 0.9)
                  .style("pointer-events", "auto");

                var newX = Math.round(((e.target.x.animVal.value + 0.5 * this.boxSize - this.margin.left) / 0.5 * this.arrPlanProperties.length / (this.width - this.margin.right - this.margin.left) - 1) / 2);

                this.boxtip.html("Goal: " + this.arrPlanProperties[newX] + "</br>" + "Occurence rate: " + 100 * this.occRate[rateSearch + 1][newX] + "%")
                  .style("left", (e.clientX - 500) + "px")
                  .style("top", () => {
                    if ((e.clientY - 210 - this.margin.top + document.getElementById("vis").scrollTop) < 0) {
                      return "1px";
                    } else {
                      return (e.clientY - 210 - this.margin.top + document.getElementById("vis").scrollTop) + "px";
                    }
                  });
              })
              .on("mouseout", (e: any) => {
                this.boxtip.transition()
                  .duration(200)
                  .style("opacity", 0)
                  .style("pointer-events", "none");
              });

            //draw a marker of start of collapse
            this.svg.append("rect")
              .attr("x", this.margin.left + (this.width - this.margin.right - this.margin.left) / this.arrPlanProperties.length * 0.5 * (2 * this.group[rateSearch / 2 * 3 + 2] + 1) - 1.25 * this.boxSize)
              .attr("y", 0.5 * (this.height - this.margin.bottom - this.margin.top) / this.dummy.length * (2 * this.yIndex + 1) - 0.5 * this.boxSize + 1)
              .attr("width", 0.25 * this.boxSize)
              .attr("height", this.boxSize)
              .style("fill", "#696969")
              .style("opacity", "0.5")
              .style("border", "2px groove black")
              .style("border-radius", "5px")

              .on("click", (e: any) => {
                this.uncollapseRow(e);
              });

            /*//add click function to un collapse the rows
            //use a transparent rect to block onmouseover and provide new function
            this.svg.append("rect")
              .attr("x", this.margin.left)
              .attr("y", (this.height - this.margin.bottom - this.margin.top) / this.dummy.length * this.yIndex + 1)
              .attr("width", this.width - this.margin.right - this.margin.left)
              .attr("height", (this.height - this.margin.bottom - this.margin.top) / this.dummy.length)
              .style("fill", "transparent")
              .on("click", (e: any) => {
                this.uncollapseRow(e);
              });*/
          }
        }
      }
    });
  }

  varInit = function (): void {
    this.height = 1200;
    this.width = 1200;
    this.margin = { top: 120, right: 200, left: 30, bottom: 0 };
    this.boxSize = 30;
    this.xIndex = 0;
    this.yIndex = 0;
    this.xSort = 0;
    this.ySort = 0;
    this.fillColor = "";
    this.dummy = [];
    this.arrPlanProperties = [];
    this.arrDescription = [];
    this.arrConflict = [];
    this.tempArr = [];
    this.arrSort = [];

    //console.log(this.arrPlanProperties);
  }

  sort = function (): void {
    //console.log(this.arrPlanProperties);
    //clear 0 occur plan properties
    var occurGoal = 0;
    for (var i = 0; i < this.arrPlanProperties.length; i++) {
      for (var j = 0; j < this.arrConflict.length; j++) {
        if (this.arrConflict[j].indexOf(this.arrPlanProperties[i]) > -1) {
          occurGoal += 1;
        }
      }
      //console.log(occurGoal);
      if (occurGoal == 0) {
        for (var k = 0; k < document.getElementById("mugsFilterSection").getElementsByTagName("input").length; k++) {
          if (document.getElementById("mugsFilterSection").getElementsByTagName("input")[k].name == this.arrPlanProperties[i]) {
            document.getElementById("mugsFilterSection").getElementsByTagName("input")[k].checked = false;
            this.arrPlanProperties.splice(i, 1);
            i = i - 1;
          }
        }

      }
      occurGoal = 0;
    }
    //console.log(this.dummy);
    //console.log(this.dummy.lastIndexOf("collapsed row"));
    //console.log(this.arrPlanProperties);

    if (this.dummy.lastIndexOf("collapsed row") < 0) {
      //initial sorting array
      if (this.arrSort.length == 0) {
        for (var i = 0; i < this.arrPlanProperties.length; i++) {
          this.arrSort.push([this.arrPlanProperties[i], 0]);
        }
      }

      //console.log(this.arrConflict);
      //calculate occurence for each plan property
      for (var i = 0; i < this.arrConflict.length; i++) {
        for (var j = 0; j < this.arrConflict[i].length; j++) {
          var xSort = this.arrPlanProperties.lastIndexOf(this.arrConflict[i][j]);
          //console.log(xSort);
          if (xSort > -1) {
            this.arrSort[xSort][0] = this.arrConflict[i][j];
            this.arrSort[xSort][1] += 1;
          }
        }
      }
      var order = this.arrSort; //temp var
      var avgOcc = 0; //temp var
      console.log(order);
      //sort the array if needed
      switch (this.optioned) {
        case "option1": //no sort
          break;
        case "option2": //least occur first
          //use a bubble sorting to find min -> max
          for (var i = 0; i < order.length - 1; i++) {
            for (var j = 0; j < order.length - 1 - i; j++) {
              if (order[j][1] > order[j + 1][1]) {
                //change goal number
                var tempOccur = order[j + 1][1];
                order[j + 1][1] = order[j][1];
                order[j][1] = tempOccur;
                //change goal name
                var tempName = order[j + 1][0];
                order[j + 1][0] = order[j][0];
                order[j][0] = tempName;
              }
            }
          }
          break;
        case "option3": //most occur first
          //use a bubble sorting to find max -> min
          for (var i = 0; i < order.length - 1; i++) {
            for (var j = 0; j < order.length - 1 - i; j++) {
              if (order[j][1] < order[j + 1][1]) {
                var tempOccur = order[j + 1][1];
                order[j + 1][1] = order[j][1];
                order[j][1] = tempOccur;
                var tempName = order[j + 1][0];
                order[j + 1][0] = order[j][0];
                order[j][0] = tempName;
              }
            }
          }
          break;
        case "option4": //most deviation first
          //calculate average occurance
          for (var i = 0; i < order.length; i++) {
            avgOcc += order[i][1];
          }
          avgOcc = avgOcc / order.length;
          //calculate deviation
          for (var i = 0; i < order.length; i++) {
            order[i][1] = Math.abs(order[i][1] - avgOcc);
          }
          //console.log(order);
          //
          //use a bubble sorting to find max -> min
          for (var i = 0; i < order.length - 1; i++) {
            for (var j = 0; j < order.length - 1 - i; j++) {
              if (order[j][1] < order[j + 1][1]) {
                var tempOccur = order[j + 1][1];
                order[j + 1][1] = order[j][1];
                order[j][1] = tempOccur;
                var tempName = order[j + 1][0];
                order[j + 1][0] = order[j][0];
                order[j][0] = tempName;
              }
            }
          }
          break;
        case "option5": //sort goals by user

          var panel = document.getElementById("orderPanel");
          var buttonField = document.getElementById("button");
          var textField = document.getElementById("construct");

          if (this.userGoal.length == 0) {
            panel.style.display = "block";
          }

          while (buttonField.firstChild) {
            buttonField.removeChild(buttonField.firstChild);
          }

          //textField.innerHTML = "";
          //while (textField.firstChild) {
           // textField.removeChild(buttonField.firstChild);
          //}

          console.log(this.arrPlanProperties);
          console.log(panel.getElementsByTagName("input").length);
          if (panel.getElementsByTagName("input").length == 1) {

            for (var i = 0; i < order.length; i++) {
              var button = document.createElement("input");
              button.type = "button";
              button.id = "button" + (i + 1);
              button.name = order[i][0];
              button.value = order[i][0];
              button.addEventListener("click", () => {
                this.constructGoal(event);
              });

              buttonField.appendChild(button);
              buttonField.appendChild(document.createElement("br"));
            }
          }

          break;

      }

      if (this.userGoal.length == order.length && this.optioned == "option5") {
        this.arrPlanProperties = this.userGoal;
        console.log(this.arrPlanProperties);

      } else {
        this.arrSort = order;
        var goalSort = [];
        for (var i = 0; i < this.arrSort.length; i++) {
          //console.log(sort[i][0])
          var sortIndex = this.arrPlanProperties.lastIndexOf(this.arrSort[i][0]);
          //console.log("sort Index" + i + ": " + sortIndex);
          goalSort.push(this.arrPlanProperties[sortIndex]);
          //console.log("goalSort: " + goalSort);
        }
        this.arrPlanProperties = goalSort;

        this.arrSort = [];
      }
    }

    console.log(this.arrPlanProperties);
  }

  setOrder = function (event: any): void {
    //clear the previous vis
    this.svg.selectAll("*").remove();
    this.stickyHeader.selectAll("*").remove();
      //console.log(event.value);
    this.optioned = event.value;
      //console.log(this.optioned);
    this.varInit();

    this.loadVis();
  }

  extendFilter = function (event: any): void {
    if (event.target.innerHTML == "Filter MUGS by Plan Properties ◀") {
      event.target.innerHTML = "Filter MUGS by Plan Properties ▼";
      document.getElementById("mugsFilterSection").style.display = "block";
    } else {
      event.target.innerHTML = "Filter MUGS by Plan Properties ◀";
      document.getElementById("mugsFilterSection").style.display = "none";
    }
  }

  extendGroup = function (event: any): void {
    if (event.target.innerHTML == "Group MUGS ◀") {
      event.target.innerHTML = "Group MUGS ▼";
      document.getElementById("groupSection").style.display = "block";
    } else {
      event.target.innerHTML = "Group MUGS ◀";
      document.getElementById("groupSection").style.display = "none";
    }
  }

  constructGoal = function (event: any): void {

    //console.log(event.srcElement.name);

    document.getElementById("construct").innerHTML += event.srcElement.name;
    document.getElementById("construct").innerHTML += "</br>";

    this.userGoal.push(event.srcElement.name);

    event.srcElement.disabled = true;

    console.log(this.userGoal.length);
    console.log(document.getElementById("button").getElementsByTagName("input").length);
    if (this.userGoal.length == document.getElementById("button").getElementsByTagName("input").length) {
      console.log("success");
      document.getElementById("orderPanel").style.display = "none";
      this.loadVis();
    }
  }

  closePanel = function (event: any): void {
    document.getElementById("orderPanel").style.display = "none";
  }

  checkboxInit = function () {
    if (document.getElementById("mugsFilterSection").childElementCount == 0) {
      for (var i = 0; i < this.arrPlanProperties.length; i++) {
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "checkbox" + (i + 1);
        checkbox.name = this.arrPlanProperties[i];

        checkbox.checked = true;
        checkbox.addEventListener("change", () => {
          this.varInit();
          this.loadVis();
        })

        var label = document.createElement("label");
        label.appendChild(document.createTextNode(this.arrPlanProperties[i]));

        var filterArea = document.getElementById("mugsFilterSection")
        filterArea.appendChild(checkbox);
        filterArea.appendChild(label);
        filterArea.appendChild(document.createElement("br"));
      }
    }
    if (document.getElementById("groupSection").childElementCount == 0) {
      var treeGroup = document.createElement("input");
      treeGroup.type = "checkbox";
      treeGroup.id = "treeGroup";
      treeGroup.name = "treeGroup";
      treeGroup.checked = false;
      treeGroup.addEventListener("change", () => {
        this.varInit();
        this.loadVis();
      });

      var treeLabel = document.createElement("label");
      treeLabel.appendChild(document.createTextNode("Tree Struture Grouping"));
      document.getElementById("groupSection").append(treeGroup);
      document.getElementById("groupSection").append(treeLabel);
    }
  }

  filter = function (): void {
    if (this.dummy.lastIndexOf("collapsed row") < 0) {


    //clear the previous vis
    this.svg.selectAll("*").remove();
    this.stickyHeader.selectAll("*").remove();
    //console.log(this.arrConflict);

    var filterCondition = [];
    var tempProperty = [];

    //console.log(tempFilterDummy);
      console.log(this.arrPlanProperties);
    var checkbox = document.getElementById("mugsFilterSection").getElementsByTagName("input");
    for (var i = 0; i < checkbox.length; i++) {
      if (checkbox[i].checked == false) {
        filterCondition.push(checkbox[i].name);
        if (this.arrPlanProperties.lastIndexOf(checkbox[i].name) > -1) {
          this.arrPlanProperties.splice(this.arrPlanProperties.lastIndexOf(checkbox[i].name), 1);
          //i = i - 1;
        }
      }
      //else {
      //  tempProperty.push(checkbox[i].name);
      //}
    }
    //console.log(this.arrConflict);

    for (var i = 0; i < this.arrConflict.length; i++) {
      for (var j = 0; j < this.arrConflict[i].length; j++) {
        if (filterCondition.lastIndexOf(this.arrConflict[i][j]) >= 0) {
          this.arrConflict.splice(i, 1);
          this.dummy.splice(i, 1);

          i = i - 1;
          break;
        }
      }
    }
    //console.log(tempConflict);
    //console.log(tempFilterDummy);
    //this.arrConflict = tempFilterConflict;
    //this.dummy = tempFilterDummy;
    //this.arrPlanProperties = tempProperty;
    console.log(this.arrPlanProperties);
    //console.log(this.dummy);
    //console.log(this.arrConflict);
    }
  }

  treeGroup = function (): void {
    var input = document.getElementById("groupSection").getElementsByTagName("input");
    console.log(this.arrPlanProperties);
    if (input[0].checked == true && this.dummy.lastIndexOf("collapsed row") < 0) {

      //clear the previous vis
      //this.svg.selectAll("*").remove();
      //this.stickyHeader.selectAll("*").remove();

      //clear 0 occur plan properties
      var occurGoal = 0;
      for (var i = 0; i < this.arrPlanProperties.length; i++) {
        for (var j = 0; j < this.arrConflict.length; j++) {
          if (this.arrConflict[j].indexOf(this.arrPlanProperties[i]) > -1) {
            occurGoal += 1;
          }
        }
        //console.log(occurGoal);
        if (occurGoal == 0) {
          for (var k = 0; k < document.getElementById("mugsFilterSection").getElementsByTagName("input").length; k++) {
            if (document.getElementById("mugsFilterSection").getElementsByTagName("input")[k].name == this.arrPlanProperties[i]) {
              document.getElementById("mugsFilterSection").getElementsByTagName("input")[k].checked = false;
              this.arrPlanProperties.splice(i, 1);
              i = i - 1;
            }
          }

        }
        occurGoal = 0;

      }
      var sumFlagArray = [];
      var sumFlag = 0;
      var flag = true;
      //console.log(this.arrConflict);

      for (var i = 0; i < this.arrPlanProperties.length; i++) {
        for (var j = 0; j < this.arrConflict.length; j++) {
          if (this.arrConflict[j].lastIndexOf(this.arrPlanProperties[i]) >= 0) {
            sumFlag += 1;
          }
          else if (this.arrConflict[j].length == 1 && this.arrConflict[j] == "collapsed row") {
            sumFlag += 1;
          }
        }
        sumFlagArray.push(sumFlag);
        sumFlag = 0;

      }
      //console.log(sumFlagArray);

      for (var k = 0; k < this.arrPlanProperties.length; k++) {

        for (var i = 0; i < this.arrConflict.length - 1; i++) {
          for (var j = 0; j < this.arrConflict.length - 1 - i; j++) {
            //console.log(this.arrConflict[i][j]);
            if (k > 0) {

              if (sumFlagArray[k - 1] != 0) {

                if (this.arrConflict[j].length == 1 && this.arrConflict[j] == "collapsed row") {

                  break;
                } else if (this.arrConflict[j].lastIndexOf(this.arrPlanProperties[k]) < this.arrConflict[j + 1].lastIndexOf(this.arrPlanProperties[k])) {

                  for (var m = k; m > 0; m--) {
                    flag = flag && (this.arrConflict[j].lastIndexOf(this.arrPlanProperties[m - 1]) >= 0) == (this.arrConflict[j + 1].lastIndexOf(this.arrPlanProperties[m - 1]) >= 0)
                  }

                  if (flag) {
                    var tempConflict = this.arrConflict[j];
                    this.arrConflict[j] = this.arrConflict[j + 1];
                    this.arrConflict[j + 1] = tempConflict;
                    var tempDummy = this.dummy[j];
                    this.dummy[j] = this.dummy[j + 1];
                    this.dummy[j + 1] = tempDummy;
                  } else {
                    flag = true;
                  }

                }

              } else {

                for (var m = k - 1; m >= 0; m--) {
                  if (this.arrConflict[j].length == 1 && this.arrConflict[j] == "collapsed row") {

                    break;
                  }
                  else if (sumFlagArray[m] > 0) {
                    if (this.arrConflict[j].lastIndexOf(this.arrPlanProperties[k]) < this.arrConflict[j + 1].lastIndexOf(this.arrPlanProperties[k])) {

                      for (var n = k; n > 0; n--) {
                        flag = flag && (this.arrConflict[j].lastIndexOf(this.arrPlanProperties[n - 1]) >= 0) == (this.arrConflict[j + 1].lastIndexOf(this.arrPlanProperties[n - 1]) >= 0)
                      }
                      if (flag) {
                        var tempConflict = this.arrConflict[j];
                        this.arrConflict[j] = this.arrConflict[j + 1];
                        this.arrConflict[j + 1] = tempConflict;
                        var tempDummy = this.dummy[j];
                        this.dummy[j] = this.dummy[j + 1];
                        this.dummy[j + 1] = tempDummy;
                      } else {
                        flag = true;
                      }

                    }
                    break;
                  }
                }
              }
            } else if (k == 0) {
              if (this.arrConflict[j].length == 1 && this.arrConflict[j] == "collapsed row") {

                break;
              }
              else if (this.arrConflict[j].lastIndexOf(this.arrPlanProperties[k]) < this.arrConflict[j + 1].lastIndexOf(this.arrPlanProperties[k])) {
                var tempConflict = this.arrConflict[j];
                this.arrConflict[j] = this.arrConflict[j + 1];
                this.arrConflict[j + 1] = tempConflict;
                var tempDummy = this.dummy[j];
                this.dummy[j] = this.dummy[j + 1];
                this.dummy[j + 1] = tempDummy;
              }
            }
          }
        }

      }
    }


  }

  collapseRow = function (e: any): void {

    //create a id array to compare place in the tree
    var idArray = [];
    var compareArray = [];
    var collapseArray = [];
    var arr = [];
    var localOccRate = []
    var tempDummy = [];
    var tempConflict = [];
    var tempGroup = [];
    var doCollapse = 1;

    var newX = Math.round(((e.target.x.animVal.value + 0.5 * this.boxSize - this.margin.left) / 0.5 * this.arrPlanProperties.length / (this.width - this.margin.right - this.margin.left) - 1) / 2);
    var newY = Math.round(((e.target.y.animVal.value + 0.5 * this.boxSize - 1) / 0.5 * this.dummy.length / (this.height - this.margin.bottom - this.margin.top) - 1) / 2);

    this.collapseStart = newX;

    for (var i = 0; i < this.arrPlanProperties.length; i++) {
      localOccRate.push(0);
    }

    for (var i = 0; i < newX + 1; i++) {
      if (this.arrConflict[newY].indexOf(this.arrPlanProperties[i]) > -1) {
        idArray.push(1);
      } else {
        idArray.push(0);
      }
    }
    //console.log(idArray);

    //when grouped in a tree structure (checkbox ticked)
    if (document.getElementById("groupSection").getElementsByTagName("input")[0].checked == true) {
      for (var i = 0; i < this.arrConflict.length; i++) {
        for (var j = 0; j < newX + 1; j++) {
          if (this.arrConflict[i].indexOf(this.arrPlanProperties[j]) > -1) {
            compareArray.push(1);
          } else {
            compareArray.push(0);
          }
        }

        //create array contain the rows number that need to be collpsed
        if (compareArray.every(function (value, k) { return value === idArray[k] })) {
          /*this.svg.append("rect")
            .attr("x", 5)
            .attr("y", 0.5 * (this.height - this.margin.bottom - this.margin.top) / this.dummy.length * (2 * i + 1) - 0.5 * this.boxSize + 1)
            .attr("height", 10)
            .attr("width", 10);
          console.log(compareArray);
          console.log("collapse");*/
          collapseArray.push(i);
        }

        compareArray = [];
      }
    }

    console.log(collapseArray);

    for (var i = 0; i < collapseArray.length; i++) {
      console.log(this.dummy[collapseArray[i]].indexOf("collapsed row"));
      if (this.dummy[collapseArray[i]].indexOf("collapsed row") > -1) {
        doCollapse = doCollapse & 0;
        //console.log(doCollapse);
        break;
      }
    }


    //do collapse operation
    //not taking groups that only have 1 component
    if (collapseArray.length > 1 && doCollapse > 0) {

      //if (!this.dummy.includes("collapsed row")) {

        //calculate the occurence rate of each planProperty
        for (var i = 0; i < collapseArray.length; i++) {
          for (var j = 0; j < this.arrPlanProperties.length; j++) {
            if (this.arrConflict[collapseArray[i]].indexOf(this.arrPlanProperties[j]) > -1) {
              localOccRate[j] += 1;
            }
          }
        }

        for (var i = 0; i < localOccRate.length; i++) {
          localOccRate[i] = localOccRate[i] / collapseArray.length;
        }
        this.occRate.push(("collapsed row" + (this.occRate.length / 2 + 1)), localOccRate);

        console.log(this.occRate);

        //change arrConflict and dummy accordingly
        for (var i = 0; i < collapseArray[0]; i++) {
          tempDummy.push(this.dummy[i]);
          tempConflict.push(this.arrConflict[i]);
        }

        //insert one empty line
        tempDummy.push("collapsed row" + (this.occRate.length / 2));
        for (var i = 0; i < collapseArray.length; i++) {
          for (var j = 0; j < this.arrConflict[collapseArray[i]].length; j++) {

            if (this.arrPlanProperties.indexOf(this.arrConflict[collapseArray[i]][j]) > -1 && arr.lastIndexOf(this.arrConflict[collapseArray[i]][j]) < 0) {
              arr.push(this.arrPlanProperties[this.arrPlanProperties.indexOf(this.arrConflict[collapseArray[i]][j])]);
            }

          }
        }


        tempConflict.push(arr);

        for (var i = 0; i < collapseArray.length; i++) {
          tempGroup.push(this.dummy[collapseArray[i]]);
        }
        this.group.push(tempGroup, arr, this.collapseStart);
        console.log(this.group);

        //finish rest rows
        for (var i = Number(collapseArray[collapseArray.length - 1]) + 1; i < this.dummy.length; i++) {
          tempDummy.push(this.dummy[i]);
          tempConflict.push(this.arrConflict[i]);
        }

        //console.log(tempDummy);
        //console.log(tempConflict);

        this.dummy = tempDummy;
        this.arrConflict = tempConflict;
        console.log(this.dummy);
        console.log(this.arrConflict);
        console.log(this.arrPlanProperties);
      }
        //clear the previous vis
        this.svg.selectAll("*").remove();
        this.stickyHeader.selectAll("*").remove();

        this.loadVis();


    //}
  }

  uncollapseRow = function (e: any): void {
    //console.log("TODO");
   /* this.arrConflict = [];
    this.dummy = [];
    //this.arrPlanProperties = [];*/

    var uncollapseY = Math.round(((e.target.y.animVal.value + 0.5 * this.boxSize - 1) / 0.5 * this.dummy.length / (this.height - this.margin.bottom - this.margin.top) - 1) / 2);

    this.group.splice(this.occRate.indexOf(this.dummy[uncollapseY]) / 2 * 3, 3);
    this.occRate.splice(this.occRate.indexOf(this.dummy[uncollapseY]), 2);

    console.log(this.occRate);
    console.log(this.group);

    this.varInit();
    //clear the previous vis
    this.svg.selectAll("*").remove();
    this.stickyHeader.selectAll("*").remove();

    this.loadVis();
  }

  ngOnInit(): void {
    this.varInit();
    this.generateD3Components();
    this.loadVis();

/*    //this.planProperties$.subscribe(p => { console.log(p); });
    combineLatest([
      this.planProperties$,
      this.demo$,
      this.conflicts$
    ]).pipe(
      //check if var is defined
      filter(([planProperties, demo, conflict]) => !!planProperties && !!demo && !!conflict),
      //unsubscribe if not needed, save resources
      takeUntil(this.unsubscribe$)
    ).subscribe(([planProperties, demo, conflict]) => {     //then do sth. here


      console.log(planProperties);
      console.log(conflict.conflicts[0].elems);
      console.log(conflict.conflicts.length);


      //console.log(goal);
      //console.log(planProperties["637df31f78942a00077cc0de"]);  //print out obj by the map from id to the obj
      console.log(demo);

    }); //end of pipe
*/
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
