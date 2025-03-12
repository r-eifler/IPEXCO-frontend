import { empty } from "ramda";
import { array, boolean, number, object, record, string, infer as zinfer } from "zod";

export const TrailerZ = object({
    name: string()
})

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
})

export type Rack = zinfer<typeof RackZ>;

export const ProductionLineZ = object({
    name: string(),
    schedule: array(string())
})

export type ProductionLine = zinfer<typeof ProductionLineZ>;

export const FlightZ = object({
    name: string(),
    incoming: array(string()),
    outgoing: array(string())
})

export type Flight = zinfer<typeof FlightZ>;

export const BelugaProblemZ = object({
    trailers_beluga: array(TrailerZ),
    trailers_factory: array(TrailerZ),
    hangars: array(string()),
    jig_types: record(string(),JigTypeZ),
    racks: array(RackZ),
    production_lines: array(ProductionLineZ),
    flights: array(FlightZ)
})

export type BelugaProblem = zinfer<typeof BelugaProblemZ>;