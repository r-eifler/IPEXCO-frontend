import { literal, nativeEnum, object, string, union, infer as zinfer } from "zod";

export enum BelugaActionType {
    UNLOAD_BELUGA = "unload_beluga",
    LOAD_BELUGA = "load_beluga",
    PUT_DOWN_RACK = "put_down_rack",
    PICK_UP_RACK = "pick_up_rack",
    DELIVER_TO_HANGER = "deliver_to_hangar",
    GET_FROM_HANGER = "get_from_hangar",
    SWITCH_TO_NEXT_BELUGA = "switch_to_next_beluga"
}

export const ServiceTypeZ = nativeEnum(BelugaActionType);

export const UnloadBelugaZ = object({
    name: literal("unload_beluga"),
    j: string(),
    b: string(),
    t: string(),
});

export type UnloadBeluga = zinfer<typeof UnloadBelugaZ>;

export const LoadBelugaZ = object({
    name: literal("load_beluga"),
    j: string(),
    b: string(),
    t: string(),
});

export type LoadBeluga = zinfer<typeof LoadBelugaZ>;

export const PutDownRackZ = object({
    name: literal("put_down_rack"),
    j: string(),
    t: string(),
    r: string(),
    s: string()
});

export type PutDownRackZ = zinfer<typeof PutDownRackZ>;

export const PickUpRackZ = object({
    name: literal("pick_up_rack"),
    j: string(),
    t: string(),
    r: string(),
    s: string()
});

export type PickUpRack = zinfer<typeof PickUpRackZ>;

export const DeliverToHangerZ = object({
    name: literal("deliver_to_hangar"),
    j: string(),
    h: string(),
    t: string(),
    pl: string()
});

export type DeliverToHanger = zinfer<typeof DeliverToHangerZ>;

export const GetFromHangerZ = object({
    name: literal("get_from_hangar"),
    j: string(),
    h: string(),
    t: string(),
});

export type GetFromHanger = zinfer<typeof GetFromHangerZ>;

export const SwitchBelugaZ = object({
    name: literal("switch_to_next_beluga"),
});

export type SwitchBeluga = zinfer<typeof SwitchBelugaZ>;

export const BelugaActionZ = union([
    UnloadBelugaZ,
    LoadBelugaZ,
    PickUpRackZ,
    PutDownRackZ,
    DeliverToHangerZ,
    GetFromHangerZ,
    SwitchBelugaZ
])