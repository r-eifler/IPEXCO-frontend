import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictGraphComponent } from './conflict-graph.component';

describe('ConflictGraphComponent', () => {
  let component: ConflictGraphComponent;
  let fixture: ComponentFixture<ConflictGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConflictGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConflictGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
