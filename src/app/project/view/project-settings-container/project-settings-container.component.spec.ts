import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSettingsContainerComponent } from './project-settings-container.component';

describe('ProjectSettingsContainerComponent', () => {
  let component: ProjectSettingsContainerComponent;
  let fixture: ComponentFixture<ProjectSettingsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectSettingsContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectSettingsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
