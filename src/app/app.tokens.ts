import { InjectionToken } from "@angular/core";

export const AUTH_ENABLED = new InjectionToken("AUTH_ENABLED");

export const SOCKET_IO = new InjectionToken("socket-io");

export const PLANNER_REDIRECT = new InjectionToken<string>(
  "plannerRedirectToken"
);

export const QUESTION_REDIRECT = new InjectionToken<string>(
  "questionRedirectToken"
);

export const DEMO_FINISHED_REDIRECT = new InjectionToken<string>(
  "demoFinishedRedirectToken"
);
