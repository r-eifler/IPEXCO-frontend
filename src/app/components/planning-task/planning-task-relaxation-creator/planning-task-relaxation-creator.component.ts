import { MatCardModule } from '@angular/material/card';
import { logging } from 'protractor';
import { PlanningTaskRelaxation } from './../../../interface/planning-task-relaxation';
import { Fact, PlanningTask, Predicat } from 'src/app/interface/plannig-task';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Project } from 'src/app/interface/project';
import { Subject } from 'rxjs';
import { CurrentProjectService } from 'src/app/service/project/project-services';
import { PropertyCreatorComponent } from '../../plan_properties/property-creator/property-creator.component';
import { MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChildActivationEnd } from '@angular/router';
import { max } from 'd3';

interface Node {
  id: number;
  pos?: number;
  level: number;
  parents: Node[];
  children: Node[];
  facts: Fact[];
}

@Component({
  selector: 'app-planning-task-relaxation-creator',
  templateUrl: './planning-task-relaxation-creator.component.html',
  styleUrls: ['./planning-task-relaxation-creator.component.scss']
})
export class PlanningTaskRelaxationCreatorComponent implements OnInit, OnDestroy {

  math = Math;
  private ngUnsubscribe: Subject<any> = new Subject();

  currentProject: Project;
  task: PlanningTask;

  selctedInitialPredicate: Predicat = null;
  initialFacts: Fact[] = [];
  selectedInitialFacts: Fact[] = [];

  selctedPredicate: Predicat = null;
  possibleFacts: Fact[] = [];
  selectedFacts: Fact[] = [];

  relaxationHead: Node
  relaxationLevels: Node[][];

  relax_id = 0;
  min_unit = 200;

  linkNode: Node = null;

  constructor(
    private currentProjectService: CurrentProjectService,
    public dialogRef: MatDialogRef<PropertyCreatorComponent>
  ) {
    this.currentProjectService.getSelectedObject()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(project => {
      this.currentProject = project;
      this.task = project.baseTask;
    });

    this.relaxationHead = {id: this.relax_id++, parents: [], children: [], level: 0, facts: this.selectedInitialFacts}
    this.relaxationLevels = [[this.relaxationHead]];
   }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  updateInitialFacts(predicate: Predicat): void {
    this.selctedInitialPredicate = predicate;
    this.initialFacts = this.task.init.filter(f => f.name == this.selctedInitialPredicate.name && ! this.selectedInitialFacts.includes(f))
  }

  removeInitFact(fact: Fact){
    this.selectedInitialFacts = this.selectedInitialFacts.filter(f => f != fact);
    this.selectedFacts = this.selectedFacts.filter(e => e != fact);
    this.initialFacts = this.task.init.filter(f => f.name == this.selctedPredicate.name && ! this.selectedInitialFacts.includes(f))
  }

  updateFacts(predicate: Predicat): void {
    this.selctedPredicate = predicate;
    console.log(this.selectedFacts.some(e => e.name == predicate.name))
    this.possibleFacts = this.selctedPredicate.instantiateAll(this.task.getObjectTypeMap());
    this.possibleFacts = this.possibleFacts.
    filter(f =>  ! this.selectedFacts.some(e => e.name == f.name && JSON.stringify(e.arguments) === JSON.stringify(f.arguments)));
  }

  addUpper(parent: Node, level: number): void {
    let new_node: Node = {id: this.relax_id++, level, parents: [parent], children: [], facts: []}
    parent.children.push(new_node);
    if(this.relaxationLevels.length <= level){
        this.relaxationLevels.push([]);
    }
    this.relaxationLevels[level].push(new_node);

    setTimeout(() => { this.updateGrid() }, 0);
    // this.updatePositions();
   }

  updateGrid(){
    let s = 2;
    let max_c = Math.max(...this.relaxationLevels.map(l => Math.max(...l.map(e => e.children.length))));
    let max_p = Math.max(...this.relaxationLevels.map(l => Math.max(...l.map(e => e.parents.length))));
    let max_l = Math.max(...this.relaxationLevels.map(l => l.length));
    let max_b = Math.max(max_c, max_p);
    let num_columns = max_b * max_l * s;
    if (num_columns % 2 == 0)
    num_columns++;
    const col_style = "grid-template-columns: " + new Array(num_columns).fill("1fr").join(" ") + ";"
    const row_style = "grid-template-rows: " + new Array(this.relaxationLevels.length).fill("1fr").join(" ") + ";"
    let div = document.getElementById("relax_level");
    div.setAttribute("style", col_style + "\n " + row_style);

    this.relaxationHead.pos = Math.floor(num_columns/2);

    for(let i = 0; i < this.relaxationLevels.length; i++){

      for(let node of this.relaxationLevels[i]) {
        let card = document.getElementById("relax_card_" + node.id);
        card.setAttribute("style", "grid-column-start:" + (node.pos + 1) + ";" + "\n " + "grid-row-start:" + (node.level + 1) + ";");

        let c_index = 0;
        for(let child_node of node.children){
          if(child_node.parents.length == 1){
            let pos = c_index - Math.floor(node.children.length/2)
            if(pos >= 0 && node.children.length % 2 == 0){
              pos++;
            }
            child_node.pos = child_node.parents[0].pos + pos;
            c_index++;
          }
          if(child_node.parents.length == 2){
            child_node.pos = Math.round((child_node.parents[0].pos + child_node.parents[1].pos)/2)
            if (child_node.pos < node.pos){
              c_index++;
            }
          }
        }
      }
    }
  }

  deleteRelaxation(node: Node, level: number): void {
    for (let c of node.children){
      this.deleteRelaxation(c, level+1);
    }
    this.relaxationLevels[level] = this.relaxationLevels[level].filter(e => e != node);
    this.relaxationLevels = this.relaxationLevels.filter(e => e.length > 0);
    for(let p of node.parents){
      p.children = p.children.filter(e => e != node);
    }

    for(let fact of node.facts){
      this.selectedFacts = this.selectedFacts.filter(e => e != fact);
      if (fact.name == this.selctedPredicate.name){
        this.possibleFacts.push(fact);
        this.possibleFacts = this.possibleFacts.sort();
      }
    }
    setTimeout(() => { this.updateGrid() }, 0);
  }

  deleteFactFromRelax(fact: Fact, node: Node){
    console.log("deleteFactFromRelax");
    node.facts = node.facts.filter(e => e != fact);
    this.selectedFacts = this.selectedFacts.filter(e => e != fact);
    if (fact.name == this.selctedPredicate.name){
      this.possibleFacts.push(fact);
      this.possibleFacts = this.possibleFacts.sort();
    }
  }

  canAdd(node: Node): boolean {
    return node.children.length < this.selectedInitialFacts.length;
  }

  canLink(n1: Node, n2: Node): boolean {
    if (Math.abs(n1.level - n2.level) != 1) {
      return false;
    }
    let l = this.selectedInitialFacts.length;
    if (n1.children.includes(n2) || n1.parents.includes(n2) || n2.children.includes(n1) || n2.parents.includes(n1)) {
        return false;
    }
    if (n1.level > n2.level && (n2.children.length ==  l || n1.parents.length == l)){ // n2 parent
      return false;
    }
    if (n1.level < n2.level && (n1.children.length ==  l || n2.parents.length == l)){ // n1 parent
      return false;
    }
    return true;
  }

  canInitLink(n: Node): boolean {
    let l = this.selectedInitialFacts.length;
    return  n.children.length <  l || n.parents.length < l;
  }

  startLink(node: Node) {
    this.linkNode = node
  }

  stopLink(node: Node) {
    let parent = this.linkNode;
    let child = node;
    if (this.linkNode.level > node.level){
      parent = node;
      child = this.linkNode;
    }
    this.linkNode = null;

    parent.children.push(child);
    child.parents.push(parent);
    setTimeout(() => { this.updateGrid() }, 0);
  }

  abortLink(){
    this.linkNode = null;
  }

  onSave(): void {

    this.dialogRef.close();
  }

  onBack(): void {
    this.dialogRef.close();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  updateSelectedFacts(event: {container: {data: Fact[]}}){
    this.selectedFacts.push(event.container.data[0]);
    this.possibleFacts = this.possibleFacts.filter(f =>  ! this.selectedFacts.includes(f));
  }

  getGridStyle(i: number): string {
    return "grid-template-columns: " + this.relaxationLevels[i].map(e => "1fr").join(" ") + ";"
  }

}
