import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaStudyCollectionComponent } from './meta-study-collection.component';

describe('MetaStudyCollectionComponent', () => {
  let component: MetaStudyCollectionComponent;
  let fixture: ComponentFixture<MetaStudyCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetaStudyCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaStudyCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
