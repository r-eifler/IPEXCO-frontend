import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProjectCollectionComponent} from './project-collection.component';

describe('StartPageComponent', () => {
  let component: ProjectCollectionComponent;
  let fixture: ComponentFixture<ProjectCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
