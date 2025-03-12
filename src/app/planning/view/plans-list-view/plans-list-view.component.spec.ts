import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansListViewComponent } from './plans-list-view.component';

describe('PlansListViewComponent', () => {
  let component: PlansListViewComponent;
  let fixture: ComponentFixture<PlansListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlansListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlansListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
