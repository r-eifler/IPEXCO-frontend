import { inject, Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { map, switchMap } from "rxjs";
import { PlanRunStatus } from "src/app/iterative_planning/domain/plan";
import { selectSection, updateConfiguration, updateConfigurationOfSectionAndConfigIndex } from "../flight-section-planning.actions";
import { selectProject, selectSelectedSection } from "../flight-section-planning.selector";


@Injectable()
export class GoToConfigurationUpdateEffect{

    private actions$ = inject(Actions);
    private store = inject(Store);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);

    public start$ = createEffect(() => this.actions$.pipe(
        ofType(updateConfiguration),
        concatLatestFrom(() => [this.store.select(selectProject), this.store.select(selectSelectedSection)]),
        map(([_, project, section]) => {
            if(section !== undefined && project !== undefined){
                if(section.status == PlanRunStatus.PENDING){
                    console.log('Activated route: ' + this.activatedRoute)
                    this.router.navigate(["../configuration-update/" + section._id], {relativeTo: this.activatedRoute})
                }
            }
        })
        
    ), {dispatch: false});

     public startForSection$ = createEffect(() => this.actions$.pipe(
        ofType(updateConfigurationOfSectionAndConfigIndex),
        concatLatestFrom(() => [this.store.select(selectProject)]),
        map(([{section, index}, project]) => {
            if(project !== undefined && section.status == PlanRunStatus.PENDING){
                console.log('Activated route: ' + this.activatedRoute)
                this.router.navigate(["../configuration-update/" + section._id], {relativeTo: this.activatedRoute})
            }
        })
        
    ), {dispatch: false});
}