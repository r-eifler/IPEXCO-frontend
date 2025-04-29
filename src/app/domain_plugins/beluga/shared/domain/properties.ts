import { GoalType } from "src/app/shared/domain/plan-property/plan-property";
import { generatePlanProperty, PlanPropertyTemplate } from "src/app/shared/domain/plan-property/plan-property-template";

let deliverJigTemplate: PlanPropertyTemplate = {
    class: "deliver",
    color: "#ed736b",
    icon: "flight",
    type: GoalType.goalFact,
    variables: {
        "$J": ["jig"],
		"$PL": ["production_line"],
		"$I": ["number"]
    },
    nameTemplate: "$J delivered at pos $I to production line $PL",
    definitionTemplate: {
        "name": "deliver_to_production_line",
        "parameters": [
            "$J",
            "$PL",
            "$I"
        ]
    },
    sentenceTemplate: "$J is the $I -th jig delivered to production line $PL"
}; 

export function createDeliverJigGoal(jigName:string, productionLineName: string, position: number){

    return generatePlanProperty(
        deliverJigTemplate,
        {
            "$J": {name: jigName, type: 'jig'},
            "$PL": {name: productionLineName, type: 'production_line'},
        },
        {
            "$I": position
        }
    )
}


let loadBeluga: PlanPropertyTemplate = {
    class: "flights",
    color: "#ed736b",
    icon: "flight_takeoff",
    type: GoalType.goalFact,
    variables: {
        "$J": ["jig"],
		"$B": ["flight"],
		"$UI": ["number"]
    },
    nameTemplate: "$J loaded at pos $UI from beluga $B",
    definitionTemplate: {
        "name": "load_beluga",
        "parameters": [
            "$J",
            "$B",
            "$UI"
        ]
    },
    sentenceTemplate: "$J is the $UI -th jig loaded into beluga $B"
}; 

export function createLoadBelugaGoal(jigName:string, flightName: string, position: number){

    return generatePlanProperty(
        loadBeluga,
        {
            "$J": {name: jigName, type: 'jig'},
            "$B": {name: flightName, type: 'flight'},
        },
        {
            "$UI": position
        }
    )
}


let unloadBeluga: PlanPropertyTemplate = {
    class: "flights",
    color: "#ed736b",
    icon: "flight_land",
    type: GoalType.goalFact,
    variables: {
        "$J": ["jig"],
		"$B": ["flight"],
		"$UI": ["number"]
    },
    nameTemplate: "$J unloaded at pos $UI from beluga $B ",
    definitionTemplate: {
        "name": "load_beluga",
        "parameters": [
            "$J",
            "$B",
            "$UI"
        ]
    },
    sentenceTemplate: "$J is the $UI -th jig unloaded from beluga $B"
}; 

export function createUnloadBelugaGoal(jigName:string, flightName: string, position: number){

    return generatePlanProperty(
        unloadBeluga,
        {
            "$J": {name: jigName, type: 'jig'},
            "$B": {name: flightName, type: 'flight'},
        },
        {
            "$UI": position
        }
    )
}