import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaStudyCreatorComponent } from './meta-study-creator.component';

describe('MetaStudyCreatorComponent', () => {
  let component: MetaStudyCreatorComponent;
  let fixture: ComponentFixture<MetaStudyCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetaStudyCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaStudyCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
