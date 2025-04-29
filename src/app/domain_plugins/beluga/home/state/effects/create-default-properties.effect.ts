import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap } from "rxjs/operators";
import { BelugaProblemZ } from "../../../shared/domain/beluga_problem";
import { PlanPropertyService } from "../../services/plan-properties.service";
import { createDefaultPlanProperties, createPlanProperty } from "../home.actions";
import { createDeliverJigGoal, createLoadBelugaGoal, createUnloadBelugaGoal } from "../../../shared/domain/properties";
 
@Injectable()
export class CreateDefaultPropertiesEffect{

    private actions$ = inject(Actions)

    public createProperties$ = createEffect(() => this.actions$.pipe(
        ofType(createDefaultPlanProperties),
        switchMap(({project}) => {
            let belugaModel = BelugaProblemZ.parse(project.baseTask.model);
            return  [
                belugaModel.production_lines.flatMap(pl => 
                    pl.schedule.map((jigName, index) => 
                        createPlanProperty({planProperty: {project: project._id, ...createDeliverJigGoal(jigName, pl.name, index)}})
                    ),
                ),
                belugaModel.flights.flatMap(flight => [
                    flight.incoming.map((jigName, index) =>
                        createPlanProperty({planProperty: {project: project._id, ...createUnloadBelugaGoal(jigName, flight.name, index)}})
                    ),
                    flight.outgoing.map((jigName, index) =>
                        createPlanProperty({planProperty: {project: project._id, ...createLoadBelugaGoal(jigName, flight.name, index)}})
                    )
                ].flat())
            ].flat()
        })
    ))
}