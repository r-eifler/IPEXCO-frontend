import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';

import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MAT_BOTTOM_SHEET_DEFAULT_OPTIONS } from '@angular/material/bottom-sheet';

// Components
import { NavigationComponent } from './base/components/navigation/navigation.component';


// State
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { UserDataFeature, UserDataReducer } from './user/state/user.reducer';
import { LoginEffect } from './user/state/effects/login.effect';
import { LogoutEffect } from './user/state/effects/logout.effect';

import { projectFeature, projectReducer } from './project/state/project.reducer';
import { LoadProjectEffect } from './project/state/effects/load-project.effect';
import { UpdateProjectEffect } from './project/state/effects/update-project.effect';
import { LoadProjectPlanPropertiesEffect } from './project/state/effects/load-plan-properties.effect';

import { projectMetaDataFeature, projectMetaDataReducer } from './project-meta/state/project-meta.reducer';
import { LoadProjectMetaDataListEffect } from './project-meta/state/effects/load-project-meta-list.effect';
import { CreateProjectEffect } from './project-meta/state/effects/create-project.effect';
import { DeleteProjectEffect } from './project-meta/state/effects/delete-project.effect';


import { iterativePlanningFeature, iterativePlanningReducer } from './iterative_planning/state/iterative-planning.reducer';
import { ComputeExplanationEffect } from './iterative_planning/state/effects/compute-explanation.effect';
import { ComputePlanEffect } from './iterative_planning/state/effects/compute-plan.effect';
import { CreateIterationStepEffect } from './iterative_planning/state/effects/create-iteration-step.effect';
import { CreatePlanPropertyEffect } from './iterative_planning/state/effects/create-plan-property.effect';
import { DeletePlanPropertyEffect } from './iterative_planning/state/effects/delete-plan-property.effect';
import { LoadIterationStepsEffect } from './iterative_planning/state/effects/load-iteration-steps.effect';
import { LoadPlanPropertiesEffect } from './iterative_planning/state/effects/load-plan-properties.effect';
import { LoadIterativePlanningProjectEffect } from './iterative_planning/state/effects/load-project.effect';
import { QuestionQueueEffect } from './iterative_planning/state/effects/question-queue.effect';
import { UpdatePlanPropertyEffect } from './iterative_planning/state/effects/update-plan-property.effect'
import { CreateLLMContextEffect } from './iterative_planning/state/effects/create-llm-context.effect'

// Services
import { LLMService } from './LLM/service/llm.service';
import { ExplainerMonitoringService } from './iterative_planning/service/explainer-monitoring.service';
import { ExplainerService } from './iterative_planning/service/explainer.service';
import { IterationStepService } from './iterative_planning/service/iteration-step.service';
import { PlanPropertyService } from './iterative_planning/service/plan-properties.service';
import { PlannerService } from './iterative_planning/service/planner.service';
import { IterativePlanningProjectService } from './iterative_planning/service/project.service';
import { CreateProjectService } from './project-meta/service/create-project.service';
import { ProjectMetaDataService } from './project-meta/service/project-meta-data.service';
import { ProjectService } from './project/service/project.service';
import { ProjectDemoService } from './project/service/demo.service';
import { ProjectPlanPropertyService } from './project/service/plan-properties.service';


// Interceptors
import { AuthenticationInterceptor } from './interceptor/authentication.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterEffect } from './user/state/effects/register.effect';
import { LoggedInEffect } from './user/state/effects/loggedIn.effect';
import { LoadTokenEffect } from './user/state/effects/loadToken.effect';
import { LoadUserEffect } from './user/state/effects/loadUser.effect';
import { SendMessageToLLMEffect } from './iterative_planning/state/effects/send-message.effect';
import { CreateDemoEffect } from './project/state/effects/create-demo.effect';
import { LoadProjectDemosEffect } from './project/state/effects/load-demos.effect';
import { LoadDemoProjectPlanPropertiesEffect } from './project/state/effects/load-demo-plan-properties.effect';
import { LoadProjectDemoEffect } from './project/state/effects/load-demo.effect';
import { UpdateDemoEffect } from './project/state/effects/update-demo.effect';
import { DeleteProjectDemoEffect } from './project/state/effects/delete-demo.effect';
import { DeleteIterationEffect } from './iterative_planning/state/effects/delete-iteration-step.effect';
import {LoadUserStudiesEffect} from './user_study/state/effects/load-user-studies.effect';
import {UserStudyService} from './user_study/service/user-study.service';
import {userStudyFeature, userStudyReducer} from './user_study/state/user-study.reducer';
import {MatDatepicker} from '@angular/material/datepicker';
import {LoadUserStudyDemosEffect} from './user_study/state/effects/load-demos.effect';
import {UserStudyDemoService} from './user_study/service/user-study-demo.service';
import {CreateUserStudyEffect} from './user_study/state/effects/create-user-study.effect';
import {LoadUserStudyEffect} from './user_study/state/effects/load-user-study.effect';
import {EditUserStudyEffect} from './user_study/state/effects/edit-user-study.effect';
import {ExecutionLoadUserStudyEffect} from './user_study_execution/state/effects/load-user-study.effect';
import {userStudyExecutionFeature, userStudyExecutionReducer} from './user_study_execution/state/user-study-execution.reducer';
import {ExecutionUserStudyService} from './user_study_execution/service/execution-user-study.service';
import {UserStudyAuthenticationService} from './user_study_execution/service/user-study-authentication.service';
import {RegisterUserStudyEffect} from './user_study_execution/state/effects/register-user-study.effect';
import {FinishUserStudyEffect} from './user_study_execution/state/effects/finish-user-study.effect';
import {UserStudyExecutionEvalService} from './user_study/service/user-study-execution-eval.service';
import {StoreTokenEffect} from './user/state/effects/storeToken.effect';
import {LoadUserStudyParticipantsEffect} from './user_study/state/effects/load-user-study-participants.effect';
import {UserStudyCanceledEffect} from './user_study_execution/state/effects/canceled.effect';
import { UserStudyFinishedAllStepsEffect } from './user_study_execution/state/effects/finished-all-steps.effect copy';
import { LogUserActivitiesEffect } from './user_study_execution/state/effects/log-user-activities.effect';
import { AcceptUserStudyParticipantEffect } from './user_study/state/effects/accept-participant.effect';
import { LoadUserStudyDistributionsEffect } from './user_study/state/effects/load-user-study-participant-distributions.effect';
import { LoadUserStudyDistributionEffect } from './user_study/state/effects/load-user-study-participant-distribution.effect';
import { UserStudyParticipantDistributionService } from './user_study/service/user-study-participant-distribution.service';
import { CreateUserStudyParticipantDistributionEffect } from './user_study/state/effects/create-user-study-participant-distribution.effect';
import { NextUserStudyService } from './user_study_execution/service/user-study-selection.service';
import { RedirectToNextUserStudyEffect } from './user_study_execution/state/effects/select-user-study.effect';
import { EditUserStudyParticipantDistributionEffect } from './user_study/state/effects/edit-user-study-participant-distribution.effect ';
import { LoadDemoEffect } from './demo/state/effects/load-demo.effect';
import { demoFeature, DemoReducer } from './demo/state/demo.reducer';
import { DemoService } from './demo/services/demo.service';
import { LoadDemosEffect } from './demo/state/effects/load-demos.effect';
import { LoadDemoPlanPropertiesEffect } from './demo/state/effects/load-demo-plan-properties.effect';
import { DemoPlanPropertyService } from './demo/services/plan-properties.service';
import { DemosUpdateDemoEffect } from './demo/state/effects/update-demo.effect';
import { UploadDemoEffect } from './demo/state/effects/upload-demo.effect';
import { CancelCreateDemoEffect } from './project/state/effects/cancel-create-demo.effect';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    StoreModule.forRoot({
        [UserDataFeature]: UserDataReducer,
        [demoFeature]: DemoReducer,
        [projectFeature]: projectReducer,
        [projectMetaDataFeature]: projectMetaDataReducer,
        [iterativePlanningFeature]: iterativePlanningReducer,
        [userStudyFeature]: userStudyReducer,
        [userStudyExecutionFeature]: userStudyExecutionReducer,
    }),
    EffectsModule.forRoot([
        LoadTokenEffect,
        LoginEffect,
        LoadUserEffect,
        LogoutEffect,
        RegisterEffect,
        LoggedInEffect,
        LoadProjectEffect,
        UpdateProjectEffect,
        LoadProjectPlanPropertiesEffect,
        LoadProjectMetaDataListEffect,
        CreateProjectEffect,
        DeleteProjectEffect,
        CreateDemoEffect,
        LoadProjectDemosEffect,
        LoadProjectDemoEffect,
        UpdateDemoEffect,
        DeleteProjectDemoEffect,
        LoadDemoProjectPlanPropertiesEffect,
        LoadIterativePlanningProjectEffect,
        CreatePlanPropertyEffect,
        LoadPlanPropertiesEffect,
        UpdatePlanPropertyEffect,
        DeletePlanPropertyEffect,
        LoadIterationStepsEffect,
        CreateIterationStepEffect,
        DeleteIterationEffect,
        ComputePlanEffect,
        SendMessageToLLMEffect,
        ComputeExplanationEffect,
        QuestionQueueEffect,
        CreateLLMContextEffect,
      LoadTokenEffect,
      StoreTokenEffect,
      LoginEffect,
      LoadUserEffect,
      LogoutEffect,
      RegisterEffect,
      LoggedInEffect,
      LoadProjectEffect,
      UpdateProjectEffect,
      LoadProjectPlanPropertiesEffect,
      LoadProjectMetaDataListEffect,
      CreateProjectEffect,
      DeleteProjectEffect,
      CreateDemoEffect,
      CancelCreateDemoEffect,
      LoadProjectDemosEffect,
      LoadProjectDemoEffect,
      UpdateDemoEffect,
      DeleteProjectDemoEffect,
      LoadDemoProjectPlanPropertiesEffect,
      LoadIterativePlanningProjectEffect,
      CreatePlanPropertyEffect,
      LoadPlanPropertiesEffect,
      UpdatePlanPropertyEffect,
      DeletePlanPropertyEffect,
      LoadIterationStepsEffect,
      CreateIterationStepEffect,
      DeleteIterationEffect,
      ComputePlanEffect,
      SendMessageToLLMEffect,
      ComputeExplanationEffect,
      QuestionQueueEffect,
      LoadUserStudiesEffect,
      LoadUserStudyDemosEffect,
      CreateUserStudyEffect,
      LoadUserStudyEffect,
      EditUserStudyEffect,
      LoadUserStudyParticipantsEffect,
      ExecutionLoadUserStudyEffect,
      RegisterUserStudyEffect,
      FinishUserStudyEffect,
      UserStudyCanceledEffect,
      UserStudyFinishedAllStepsEffect,
      LogUserActivitiesEffect,
      AcceptUserStudyParticipantEffect,
      LoadUserStudyDistributionsEffect,
      LoadUserStudyDistributionEffect,
      CreateUserStudyParticipantDistributionEffect,
      RedirectToNextUserStudyEffect,
      EditUserStudyParticipantDistributionEffect,
      LoadDemoEffect,
      LoadDemosEffect,
      LoadDemoPlanPropertiesEffect,
      DemosUpdateDemoEffect,
      UploadDemoEffect
    ]),
    // Instrumentation must be imported after importing StoreModule (config is optional)
    StoreDevtoolsModule.instrument({
        maxAge: 25, // Retains last 25 states
        autoPause: true, // Pauses recording actions and state changes when the extension window is not open
        trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
        traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
        connectInZone: true // If set to true, the connection is established within the Angular zone
    }),
    RouterModule.forRoot(appRoutes, {
        enableTracing: false,
        paramsInheritanceStrategy: 'always',
    }),
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NavigationComponent,
  ],
  providers: [
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
    AuthenticationInterceptor,
    PlannerService,
    ProjectDemoService,
    ProjectService,
    ProjectMetaDataService,
    CreateProjectService,
    IterativePlanningProjectService,
    PlanPropertyService,
    IterationStepService,
    PlannerService,
    LLMService,
    ExplainerService,
    ExplainerMonitoringService,
    ProjectPlanPropertyService,
    UserStudyService,
    UserStudyDemoService,
    ExecutionUserStudyService,
    UserStudyAuthenticationService,
    UserStudyExecutionEvalService,
    UserStudyParticipantDistributionService,
    NextUserStudyService,
    DemoService,
    DemoPlanPropertyService,
    {
      provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: true },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
