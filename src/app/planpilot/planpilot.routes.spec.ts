import { routes as iterativePlanningRoutes } from '../iterative_planning/iterative-planning.routes';
import { routes as planPilotRoutes } from './planpilot.routes';

describe('PlanPilot routes', () => {
  it('keeps both PlanPilot views under the project route', () => {
    expect(planPilotRoutes[0].path).toBe(':projectId');
    expect(planPilotRoutes[0].children?.map((route) => route.path)).toEqual([
      '',
      'graph',
      'navigation',
    ]);
    expect(planPilotRoutes[0].resolve?.['project']).toBeDefined();
  });

  it('does not add routes to iterative planning', () => {
    const iterativeChildren = iterativePlanningRoutes[0].children ?? [];

    expect(iterativeChildren.map((route) => route.path)).toEqual([
      '',
      'steps',
      'steps/:stepId',
      'steps/:stepId/plan',
    ]);
    expect(iterativeChildren.some((route) => route.path?.includes('planpilot'))).toBeFalse();
  });
});
