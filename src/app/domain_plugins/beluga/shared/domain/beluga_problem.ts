import { array, boolean, number, object, optional, record, string, infer as zinfer } from "zod";


export type Side = 'bside' | 'fside'

export const TrailerZ = object({
    name: string(),
    jig: optional(string()),
}).transform(o => ({
    ...o,
    stageType: 'trailer' as const,
}));

export type Trailer = zinfer<typeof TrailerZ>;

export const JigTypeZ = object({
    name: string(),
    size_empty: number(),
    size_loaded: number(),
})

export type JigType = zinfer<typeof JigTypeZ>;

export const JigZ = object({
    name: string(),
    type: string(),
    empty: boolean(),
})

export type Jig = zinfer<typeof JigZ>;

export const RackZ = object({
    name: string(),
    size: number(),
    jigs: array(string())
}).transform(o => ({
    ...o,
    stageType: 'rack' as const,
}));

export type Rack = zinfer<typeof RackZ>;

export const ProductionLineZ = object({
    name: string(),
    schedule: array(string())
})

export const HangarZ = object({
    name: string(),
    jig: optional(string()),
}).transform(o => ({
    ...o,
    stageType: 'hangar' as const,
}));

export type Hangar = zinfer<typeof HangarZ>;

export type ProductionLine = zinfer<typeof ProductionLineZ>;

export const FlightZ = object({
    name: string(),
    incoming: array(string()),
    outgoing: array(string())
}).transform(o => ({
    ...o,
    stageType: 'flight' as const,
}));

export type Flight = zinfer<typeof FlightZ>;

export const BelugaProblemZ = object({
    trailers_beluga: array(TrailerZ),
    trailers_factory: array(TrailerZ),
    hangars: array(string()),
    jig_types: record(string(),JigTypeZ),
    racks: array(RackZ),
    jigs: record(string(),JigZ),
    production_lines: array(ProductionLineZ),
    flights: array(FlightZ)
})

export type BelugaProblem = zinfer<typeof BelugaProblemZ>;

export function getRackSize(rackName: string, model: BelugaProblem): number | undefined {
    return model.racks.find(r => r.name == rackName)?.size
}

export function occupiedSpace(rack: string[], jigs: Record<string,Jig>, jigTypes: Record<string,JigType>): number {
    return rack.map(jigName => getJigSize(jigs[jigName], jigTypes[jigs[jigName].type])).reduce((sum, c) => sum + c, 0);
}


export function getJigSize(jig: Jig, jigType: JigType): number {
    if (jig.empty){
        return jigType.size_empty;
    }
    return jigType.size_loaded;
}