import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSectionActionComponent } from './new-section-action.component';

describe('NewSectionActionComponent', () => {
  let component: NewSectionActionComponent;
  let fixture: ComponentFixture<NewSectionActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSectionActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSectionActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
