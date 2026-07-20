import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { PlanPilotStartComponent } from './planpilot-start.component';

describe('PlanPilotStartComponent', () => {
  it('reads the project resolved by the PlanPilot route', (done) => {
    TestBed.configureTestingModule({
      providers: [{
        provide: ActivatedRoute,
        useValue: { data: of({ project: { _id: 'project-1', name: 'Demo' } }) },
      }],
    });

    const component = TestBed.runInInjectionContext(() => new PlanPilotStartComponent());
    component.project$.subscribe((project) => {
      expect(project._id).toBe('project-1');
      done();
    });
  });

  it('shows only the graph entry and no iteration selector', () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { data: of({ project: { _id: 'project-1', name: 'Demo' } }) },
        },
      ],
    });
    const fixture = TestBed.createComponent(PlanPilotStartComponent);
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Open graph');
    expect(text).not.toContain('Choose a plan');
    expect(text).not.toContain('Iteration');
    expect(fixture.nativeElement.querySelector('mat-select')).toBeNull();
  });
});
