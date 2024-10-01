
import { MapStore } from "./generic-map.store";
import { ViewSettings } from "../interface/settings/view-settings";
import { ListStore } from "./generic-list.store";
import { DomainSpecificationFile, PDDLFile } from "../interface/files/files";
import { ItemStore } from "./generic-item.store";
import { TaskSchema } from "../interface/task-schema";
import { DomainSpecification } from "../interface/files/domain-specification";
import { Demo } from "../interface/demo";
import { User } from "../interface/user";
import { UserStudy } from "../interface/user-study/user-study";
import { MetaStudy } from "../interface/user-study/meta-study";
import {
  FinishedStepInterfaceStatus,
  NewStepInterfaceStatus,
} from "../interface/interface-status";
import { UserStudyData } from "../interface/user-study/user-study-store";
import { Project } from "../project/domain/project";
import { PlanProperty } from "../iterative_planning/domain/plan-property/plan-property";
import { PlanRun } from "../iterative_planning/domain/run";
import { IterationStep, ModIterationStep } from "../iterative_planning/domain/iteration_step";

// User/Authentication
export class UserStore extends ItemStore<User> {}

// Files
export class DomainFilesStore extends ListStore<PDDLFile> {}
export class ProblemFilesStore extends ListStore<PDDLFile> {}
export class DomainSpecificationFilesStore extends ListStore<DomainSpecificationFile> {}

// Project
export class ProjectsStore extends ListStore<Project> {}
export class CurrentProjectStore extends ItemStore<Project> {}

// Plan-Properties
export class PlanPropertyMapStore extends MapStore<string, PlanProperty> {}

// PlanRun and ExpRun
export class SelectedIterationStepStore extends ItemStore<IterationStep> {}
export class NewIterationStepStore extends ItemStore<ModIterationStep> {}
export class IterationStepsStore extends ListStore<IterationStep> {}
export class RunsStore extends ListStore<PlanRun> {}
export class CurrentRunStore extends ItemStore<PlanRun> {}
// export class CurrentQuestionStore extends ItemStore<DepExplanationRun> {}

// Additional Task Info
export class TaskSchemaStore extends ItemStore<TaskSchema> {}
export class DomainSpecStore extends ItemStore<DomainSpecification> {}

// Settings
export class ViewSettingsStore extends ItemStore<ViewSettings> {}

// Demo
export class DemosStore extends ListStore<Demo> {}
export class RunningDemoStore extends ItemStore<Demo> {}

// User Study
export class UserStudiesStore extends ListStore<UserStudy> {}
export class RunningUserStudyStore extends ItemStore<UserStudy> {}

export class MetaStudiesStore extends ListStore<MetaStudy> {}
export class SelectedMetaStudyStore extends ItemStore<MetaStudy> {}

export class UserStudyCurrentDataStore extends ItemStore<UserStudyData> {}
export class UserStudyDataStore extends ListStore<UserStudyData> {}


//Interface stati
export class FinishedStepInterfaceStatiStore extends ListStore<FinishedStepInterfaceStatus> {}
export class NewStepInterfaceStatusStore extends ItemStore<NewStepInterfaceStatus> {}
