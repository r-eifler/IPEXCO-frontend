import { CreateProjectEffect } from "./create-project.effect";
import { DeleteProjectEffect } from "./delete-project.effect";
import { LoadProjectMetaDataListEffect } from "./load-project-meta-list.effect";

export const homeEffects = [
    CreateProjectEffect,
    DeleteProjectEffect,
    LoadProjectMetaDataListEffect
]