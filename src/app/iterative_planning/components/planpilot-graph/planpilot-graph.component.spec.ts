import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanPilotGraphComponent, PlanPilotGraphFacet } from './planpilot-graph.component';

describe('PlanPilotGraphComponent', () => {
  let fixture: ComponentFixture<PlanPilotGraphComponent>;
  let component: PlanPilotGraphComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PlanPilotGraphComponent] }).compileComponents();
    fixture = TestBed.createComponent(PlanPilotGraphComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => fixture.destroy());

  it('renders a plan edge from the earlier action to the later action', () => {
    component.facets = [planFacet('action-1', 1), planFacet('action-2', 2)];
    component.connections = [{ sourceId: 'action-1', targetId: 'action-2', kind: 'plan' }];
    component.horizon = 2;

    fixture.detectChanges();

    const edge = component.exportSnapshot()?.edges.find((item) => (
      item.sourceId === 'action-1' && item.targetId === 'action-2'
    ));
    expect(edge).toBeDefined();
    expect(edge?.sourceId).toBe('action-1');
    expect(edge?.targetId).toBe('action-2');
    expect(edge?.targetArrowShape).toBe('triangle');
    expect(edge!.renderedSourceEndpoint.y).toBeLessThan(edge!.renderedTargetEndpoint.y);
  });

  it('keeps bounded gap metadata on the rendered edge', () => {
    component.facets = [planFacet('action-3', 3), planFacet('action-5', 5)];
    component.connections = [{
      sourceId: 'action-3',
      targetId: 'action-5',
      kind: 'plan',
      gapTimesteps: [4],
      label: 't4 empty',
    }];
    component.horizon = 5;

    fixture.detectChanges();

    const edge = component.exportSnapshot()?.edges[0];
    expect(edge?.label).toBe('t4 empty');
    expect(edge?.gapTimesteps).toEqual([4]);
  });

  it('fits the complete displayed plan from root to goal in the viewport', () => {
    fixture.nativeElement.style.display = 'block';
    fixture.nativeElement.style.width = '1200px';
    fixture.nativeElement.style.height = '735px';
    const actions = Array.from({ length: 10 }, (_, index) => planFacet(`action-${index + 1}`, index + 1));
    const root = { ...planFacet('__session__', -1), nodeType: 'root' as const, solutionContext: false };
    const goal = { ...planFacet('__goal__', 11), nodeType: 'goal' as const };
    component.facets = [root, ...actions, goal];
    component.connections = [
      { sourceId: '__session__', targetId: 'action-1', kind: 'plan' },
      ...actions.slice(1).map((action, index) => ({
        sourceId: actions[index].id,
        targetId: action.id,
        kind: 'plan' as const,
      })),
      { sourceId: 'action-10', targetId: '__goal__', kind: 'plan' },
    ];
    component.horizon = 10;

    fixture.detectChanges();
    component.fitGraph();

    const snapshot = component.exportSnapshot();
    expect(snapshot?.viewport.width).toBeGreaterThan(0);
    expect(snapshot?.viewport.height).toBeGreaterThan(0);
    expect(snapshot?.viewport.visibleFacetIds).toEqual(
      jasmine.arrayContaining(['__session__', ...actions.map((action) => action.id), '__goal__']),
    );
    expect(Math.min(...(snapshot?.edges.map((edge) => edge.renderedWidth) ?? [0])))
      .toBeGreaterThanOrEqual(2);
  });

  it('keeps any-step choices outside the timeline and wraps a dense row', () => {
    const root = { ...planFacet('__session__', -1), nodeType: 'root' as const, solutionContext: false };
    const anyStep = Array.from({ length: 24 }, (_, index): PlanPilotGraphFacet => ({
      ...planFacet(`any-${index + 1}`, 0),
      group: index < 8 ? 'In every plan' : 'Open candidate',
      selection: 'neutral',
      solutionContext: false,
      nodeType: index < 8 ? undefined : 'candidate',
      abstractTimeStep: true,
    }));
    const concrete = Array.from({ length: 4 }, (_, index): PlanPilotGraphFacet => ({
      ...planFacet(`choice-${index + 1}`, 1),
      group: 'Open candidate',
      selection: 'neutral',
      solutionContext: false,
      nodeType: 'candidate',
    }));
    component.facets = [root, ...anyStep, ...concrete];
    component.horizon = 2;

    fixture.detectChanges();

    const snapshot = component.exportSnapshot()!;
    const byId = new Map(snapshot.nodes.map((node) => [node.id, node]));
    const anyStepNodes = anyStep.map((facet) => byId.get(facet.id)!);
    const concreteNodes = concrete.map((facet) => byId.get(facet.id)!);
    const anyStepRows = new Set(anyStepNodes.map((node) => node.position.y));
    const anyStepXs = anyStepNodes.map((node) => node.position.x);
    expect(anyStepRows.size).toBe(3);
    expect(Math.max(...anyStepXs) - Math.min(...anyStepXs)).toBeLessThanOrEqual(7 * 236);
    expect(byId.get('__session__')!.position.y)
      .toBeGreaterThan(Math.max(...anyStepNodes.map((node) => node.position.y)));
    expect(Math.max(...concreteNodes.map((node) => node.position.x))).toBeLessThan(2000);
    expect(anyStepNodes.every((node) => node.label.includes('any step'))).toBeTrue();
    expect(anyStepNodes.every((node) => !node.label.includes('t0'))).toBeTrue();

    const elements = (component as unknown as {
      toElements: () => Array<{ data: { id?: string; label?: string } }>;
    }).toElements();
    expect(elements.find((element) => element.data.id === '__level_any')?.data.label)
      .toBe('Any step (not a timeline step)');
  });
});

function planFacet(id: string, timestep: number): PlanPilotGraphFacet {
  return {
    id,
    label: id,
    timestep,
    action: id,
    group: 'Plan',
    selection: 'positive',
    remainingSolutions: 1,
    solutionContext: true,
  };
}
