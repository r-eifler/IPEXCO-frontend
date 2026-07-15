import { hasPlanResult, PlanRunStatus } from './plan';

describe('hasPlanResult', () => {
  it('requires a solved status and at least one stored action', () => {
    expect(hasPlanResult(undefined)).toBeFalse();
    expect(hasPlanResult({
      createdAt: new Date(),
      status: PlanRunStatus.SOLVED,
      actions: [],
    })).toBeFalse();
    expect(hasPlanResult({
      createdAt: new Date(),
      status: PlanRunStatus.RUNNING,
      actions: [{ name: 'move', params: [] }],
    })).toBeFalse();
    expect(hasPlanResult({
      createdAt: new Date(),
      status: PlanRunStatus.SOLVED,
      actions: [{ name: 'move', params: [] }],
    })).toBeTrue();
  });
});
