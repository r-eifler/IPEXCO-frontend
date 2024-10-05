import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepsListViewComponentComponent } from './steps-list.view.component.component';

describe('StepsListViewComponentComponent', () => {
  let component: StepsListViewComponentComponent;
  let fixture: ComponentFixture<StepsListViewComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepsListViewComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepsListViewComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
