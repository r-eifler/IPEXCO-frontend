import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectActionCardComponent } from './project-action-card.component';

describe('ProjectActionCardComponent', () => {
  let component: ProjectActionCardComponent;
  let fixture: ComponentFixture<ProjectActionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectActionCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectActionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
