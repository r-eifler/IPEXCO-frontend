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
import { getAllDependencies, IterationStep } from 'src/app/interface/run';
import * as d3 from 'd3';
import { combineLatest } from "rxjs/internal/observable/combineLatest";

@Component({
  selector: 'app-conflict-graph',
  templateUrl: './conflict-graph.component.html',
  styleUrls: ['./conflict-graph.component.scss']
})

export class ConflictGraphComponent implements OnInit, OnDestroy {

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

  height = 1200;
  width = 1200;
  margin = { top: 120, right: 200, left: 30, bottom: 0 };
  boxSize = 30;
  xIndex = 0;
  yIndex = 0;
  xSort = 0;
  ySort = 0;
  fillColor = "";
  optioned = "option1";
  dummy: Array<any> = [];
  arrPlanProperties: Array<any> = [];
  arrDescription: Array<any> = [];
  arrConflict: Array<any> = [];
  tempArr: Array<any> = [];
  arrSort: Array<any> = [];
  stickyHeader;
  svg;
  tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  boxtip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  plantip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

  constructor(
    demoService: RunningDemoService,
    planPropertiesService: PlanPropertyMapService,
    stepService: SelectedIterationStepService
  ) {

    // Access the data over these observables
    // If you subscribe to one, please add takeUntil(this.unsubscribe$) in the pipe
    this.demo$ = demoService.getSelectedObject();
    this.selectedStep$ = stepService.getSelectedObject();
    this.conflicts$ = this.selectedStep$.pipe(
      takeUntil(this.unsubscribe$),
      filter(step => !!step),
      map(step => getAllDependencies(step))
    );
    this.planProperties$ = planPropertiesService.getMap();
  }

  generateD3Components(): void {
    //set up svg for sticky header
    this.stickyHeader = d3.select("#head")
      .append("svg")
      .attr("height", 300)
      .attr("width", this.width)
      .style("fill", "red")
      .style("margin-left", 50)
      .style("position", "absolute");
    
    //set up svg for drawing
    this.svg = d3.select("#vis")
      .append("svg")
      .attr("height", this.height)
      .attr("width", this.width)
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
      console.log(planProperties);
      //retrieve all plan properties from here ==> use as x-axis (goal)
      for (var i = 0; i < Array.from(planProperties.values()).length; i++) {
        this.arrPlanProperties.push(Array.from(planProperties.values())[i].name);
        this.arrDescription.push(Array.from(planProperties.values())[i].naturalLanguageDescription);
      }
      //console.log(this.arrPlanProperties);

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
      //console.log(this.arrConflict);

      //setup checkbox with original arrConflict & arrPlanProperties
      this.checkboxInit();

      //create new arrays
      this.filter();

      //sort by selection
      this.sort();

      //setup height of svg
      this.height = (this.boxSize + 3) * this.dummy.length + this.margin.top + this.margin.bottom;
      //console.log(dummy);
      //console.log(arrConflict);

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
            .style("left", (e.clientX - 480) + "px")
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
                .style("left", (e.clientX - 480) + "px")
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
                if (reColor[i].x.animVal.value == e.target.x.animVal.value) {
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
            });
        }
      }
    });
  }

  varInit = function (): void {
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
  }

  sort = function (): void {
    //initial sorting array
    for (var i = 0; i < this.arrPlanProperties.length; i++) {
      this.arrSort.push([this.arrPlanProperties[i], 0]);
    }
    
    //calculate occurence for each plan property
    for (var i = 0; i < this.arrConflict.length; i++) {
      for (var j = 0; j < this.arrConflict[i].length; j++) {
        var xSort = this.arrPlanProperties.lastIndexOf(this.arrConflict[i][j]);
        this.arrSort[xSort][0] = this.arrConflict[i][j];
        this.arrSort[xSort][1] += 1;
      }
    }
    var order = this.arrSort; //temp var
    var avgOcc = 0; //temp var

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
        console.log(order);
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
    }

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

  checkboxInit = function () {
    if (document.getElementsByTagName("input").length ==0){
      for (var i = 0; i < this.arrPlanProperties.length; i++) {
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "checkbox" + (i + 1);
        checkbox.name = this.arrPlanProperties[i];

        checkbox.checked = true;
        checkbox.addEventListener("change", (event) => {
          this.varInit();
          this.loadVis();
        })

        var label = document.createElement("label");
        label.htmlFor = "mugs";
        label.appendChild(document.createTextNode(this.arrPlanProperties[i]));

        var filterArea = document.getElementById("mugsFilterSection")
        filterArea.appendChild(checkbox);
        filterArea.appendChild(label);
          filterArea.appendChild(document.createElement("br"));
      }
    } 
  }

  filter = function (): void {
    //clear the previous vis
    this.svg.selectAll("*").remove();
    this.stickyHeader.selectAll("*").remove();


    var filterCondition = [];
    var tempDummy = [];
    var tempConflict = [];
    var flag = 1;

    var checkbox = document.getElementsByTagName("input");
    for (var i = 0; i < checkbox.length; i++) {
      if (checkbox[i].checked == false) {
        filterCondition.push(checkbox[i].name);
      }
    }
    //console.log(filterCondition);
    
    for (var i = 0; i < this.arrConflict.length;i++) {
      for (var j = 0; j < this.arrConflict[i].length; j++) {
        if (filterCondition.lastIndexOf(this.arrConflict[i][j]) < 0) {
          flag = flag && 1;
        } else {
          flag = flag && 0;
        }
      }

      if (flag) {
        tempConflict.push(this.arrConflict[i]);
        tempDummy.push(this.dummy[i]);
      }
      flag = 1;

    }
    //console.log(tempConflict);
    //console.log(tempDummy);
    this.arrConflict = tempConflict;
    this.dummy = tempDummy;

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
