import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoTaskInfoComponent } from './demo-task-info.component';

describe('DemoTaskInfoComponent', () => {
  let component: DemoTaskInfoComponent;
  let fixture: ComponentFixture<DemoTaskInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoTaskInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoTaskInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
