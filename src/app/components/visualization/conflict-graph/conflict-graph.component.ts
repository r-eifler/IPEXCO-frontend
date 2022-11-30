import { SelectedIterationStepService } from 'src/app/service/planner-runs/selected-iteration-step.service';
import { PPDependencies } from 'src/app/interface/explanations';
import { OnDestroy } from '@angular/core';
import { PlanProperty } from 'src/app/interface/plan-property/plan-property';
import { Observable, Subject } from 'rxjs';
import { PlanPropertyMapService } from 'src/app/service/plan-properties/plan-property-services';
import { RunningDemoService } from 'src/app/service/demo/demo-services';
import { Component, OnInit } from '@angular/core';
import { Demo } from 'src/app/interface/demo';
import { filter, map, takeUntil } from 'rxjs/operators';
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

 

  constructor(
    demoService: RunningDemoService,
    planPropertiesService: PlanPropertyMapService,
    stepService: SelectedIterationStepService,
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

  ngOnInit(): void {
    var height = 1200;
    var width = 1200;
    var margin = { top: 120, right: 200, left: 30, bottom: 0 }
    var boxSize = 30;
    var xIndex;
    var yIndex;
    var xSort;
    var ySort;
    var fillColor;
    var selectedIndex = d3.select("#sorting").property("value");
    var dummy = new Array();
    var arrPlanProperties = new Array();
    var arrDescription = new Array();
    var arrConflict = new Array();
    var tempArr = new Array();

    //set up svg for sticky header
    var stickyHeader = d3.select("#head")
      .append("svg")
      .attr("height", 300)
      .attr("width", width)
      .style("margin-left", 50)
      .style("position", "absolute");

    //set up svg for drawing
    var svg = d3.select("#vis")
      .append("svg")
      .attr("height", height)
      .attr("width", width)
      .style("margin-left", 50)
      .style("position", "absolute");

    //define a tooltip for MUGS
    var tooltip = d3.select("#vis")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("position", "absolute");

    //define a tooltip for box
    var boxtip = d3.select("#vis")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("position", "absolute");

    //define a tooltip for plans
    var plantip = d3.select("#head")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("position", "absolute");

    //this.planProperties$.subscribe(p => { console.log(p); });
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
      //retrieve all plan properties from here ==> use as x-axis (goal)
      for (var i = 0; i < Array.from(planProperties.values()).length; i++) {
        arrPlanProperties.push(Array.from(planProperties.values())[i].name);
        arrDescription.push(Array.from(planProperties.values())[i].naturalLanguageDescription);
      }
      console.log(planProperties);
      //retrieve all conflicts from here ==> use as y-axis (MUGS)
      for (var i = 0; i < conflict.conflicts.length; i++) {
        dummy.push("MUGS" + (i + 1));
        for (var j = 0; j < conflict.conflicts[i].elems.length; j++) {
          for (var k = 0; k < Array.from(planProperties.values()).length; k++) {
            if (conflict.conflicts[i].elems[j] == Array.from(planProperties.values())[k]._id) {
              tempArr.push(Array.from(planProperties.values())[k].name);
            }
          }
        }
        arrConflict.push(tempArr);
        tempArr = [];
        console.log(arrConflict);
      }
      height = (boxSize + 3) * dummy.length + margin.top + margin.bottom;
      //console.log(dummy);
      //console.log(arrConflict);
      
      //set up axis
      var x = d3.scaleBand()
        .domain(arrPlanProperties)
        .range([margin.left, width - margin.right]);

      var y = d3.scaleBand()
        .domain(dummy)
        .range([margin.top, height - margin.bottom]);

      var xAxis = d3.axisTop(x);
      var yAxis = d3.axisLeft(y);

      //add background color for better difference
      for (var i = 0; i < dummy.length; i++) {
        svg.append("rect")
          .attr("x", margin.left)
          //.attr("y", margin.top + (height - margin.bottom - margin.top) / dummy.length * i)
          //split svg into 2, no need to consider margin-top
          .attr("y", (height - margin.bottom - margin.top) / dummy.length * i + 1)
          .attr("width", width - margin.right - margin.left)
          .attr("height", (height - margin.bottom - margin.top) / dummy.length)
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
      stickyHeader.append("g")
        .attr("transform", `translate(0,${margin.top})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "translate(0,-10)rotate(-30)")
        .style("text-anchor", "start")
        .on("mouseover", function (e: any, d) {
          plantip.transition()
            .duration(200)
            .style("opacity", 0.9);
          plantip.html(arrDescription[arrPlanProperties.lastIndexOf(d)].toString())
            .style("left", (e.clientX - 550) + "px")
            .style("top", function () {
              if ((e.clientY - 400 - margin.top + document.getElementById("vis").scrollTop) < 0) {
                return "1px";
              } else {
                return (e.clientY - 400 - margin.top + document.getElementById("vis").scrollTop) + "px";
              }
            });
        })
        .on("mouseout", function (e: any, d) {
          plantip.transition()
            .duration(200)
            .style("opacity", 0);
        });

      //add y-axis to svg
      svg.append("g")
        //.attr("transform", `translate(${width - margin.right},0)`)
        .attr("transform", `translate(${width - margin.right},${0 - margin.top})`)
        .call(yAxis)
        .selectAll("text")
        .attr("transform", "translate(70,0)")
        .on("mouseover", function (e: any, d) {
          tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
          tooltip.html(arrConflict[dummy.lastIndexOf(d)].toString().replace(/,/g, "</br>"))
            .style("left", (e.clientX - 480) + "px")
            .style("top", function () {
              if ((e.clientY - 210 - margin.top + document.getElementById("vis").scrollTop) < 0) {
                return "1px";
              } else {
                return (e.clientY - 210 - margin.top + document.getElementById("vis").scrollTop) + "px";
              }
            });
        })
        .on("mouseout", function (e: any, d) {
          tooltip.transition()
            .duration(200)
            .style("opacity", 0);
        });

      //add box to svg
      for (var i = 0; i < arrConflict.length; i++) {
        for (var j = 0; j < arrConflict[i].length; j++) {
          xIndex = arrPlanProperties.lastIndexOf(arrConflict[i][j]);
          yIndex = i;
          //match color
          for (var k = 0; k < Array.from(planProperties.values()).length; k++) {
            if (arrConflict[i][j] == Array.from(planProperties.values())[k].name) {
              fillColor = Array.from(planProperties.values())[k].color;
            }
          }

          svg.append("rect")
            .attr("x", margin.left + (width - margin.right - margin.left) / arrPlanProperties.length * 0.5 * (2 * xIndex + 1) - 0.5 * boxSize)
            //split svg into 2, no need to consider margin-top
            //.attr("y", margin.top + 0.5 * (height - margin.bottom - margin.top) / dummy.length * (2 * yIndex + 1) - 0.5 * boxSize)
            .attr("y", 0.5 * (height - margin.bottom - margin.top) / dummy.length * (2 * yIndex + 1) - 0.5 * boxSize + 1)
            .attr("width", boxSize)
            .attr("height", boxSize)
            .style("fill", fillColor)
            //add tooltip function
            .on("mouseover", function (e: any, d) {

              boxtip.transition()
                .duration(200)
                .style("opacity", 0.9)
                .style("pointer-events", "auto");
              //boxtip.html(dataset[dummy.lastIndexOf(d)].toString().replace(/,/g, "</br>"))
              //console.log("d.x: " + this.x.animVal.value);
              //console.log("recalc: " + Math.round(((this.x.animVal.value + 0.5 * boxSize - margin.left) / 0.5 * goal.length / (width - margin.right - margin.left) - 1) / 2))
              var newX = Math.round(((this.x.animVal.value + 0.5 * boxSize - margin.left) / 0.5 * arrConflict.length / (width - margin.right - margin.left) - 1) / 2);
              var newY = Math.round(((this.y.animVal.value + 0.5 * boxSize - 1) / 0.5 * dummy.length / (height - margin.bottom - margin.top) - 1) / 2);
              boxtip.html("Goal: " + arrConflict[newX] + "</br>" + "belongs to: " + dummy[newY])
                .style("left", (e.clientX - 480) + "px")
                .style("top", function () {
                  //console.log("scrollTop: " + document.getElementById("vis").scrollTop);
                  if ((e.clientY - 210 - margin.top + document.getElementById("vis").scrollTop) < 0) {
                    return "1px";
                  } else {
                    return (e.clientY - 210 - margin.top + document.getElementById("vis").scrollTop) + "px";
                  }
                });

              //highlight those rect in column
              var reColor = document.getElementsByTagName("rect");
              //console.log(reColor);
              for (var i = 0; i < reColor.length; i++) {
                if (reColor[i].x.animVal.value == this.x.animVal.value) {
                  reColor[i].style.stroke = "#000000";
                  reColor[i].style.strokeWidth = "2";
                }
              }
            })
            .on("mouseout", function (e: any, d) {
              boxtip.transition()
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

      /**************************************************/
      console.log(planProperties);
      test();
      console.log(conflict.conflicts[0].elems);
      console.log(conflict.conflicts.length);
      for (var i = 0; i < conflict.conflicts.length; i++) {
        for (var j = 0; j < conflict.conflicts[i].elems.length; j++) {
          //var toName = planProperties[conflict.conflicts[i].elems[j]].values().name;

          /*if (!goal.includes(conflict.conflicts[i].elems[j])) {
            console.log(toName);
            goal.push(toName);
          }*/
        }
      }
      //console.log(goal);
      //console.log(planProperties["637df31f78942a00077cc0de"]);  //print out obj by the map from id to the obj
      console.log(demo);

      


    });

    //console.log("open page: " + height);
    //console.log(selectedIndex);
function test() {
        console.log("test complete");
      }

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  
}
