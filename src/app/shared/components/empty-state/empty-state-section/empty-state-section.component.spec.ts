import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyStateSectionComponent } from './empty-state-section.component';

describe('EmptyStateSectionComponent', () => {
  let component: EmptyStateSectionComponent;
  let fixture: ComponentFixture<EmptyStateSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyStateSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
