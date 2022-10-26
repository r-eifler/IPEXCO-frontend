import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictVisuMainComponent } from './conflict-visu-main.component';

describe('ConflictVisuMainComponent', () => {
  let component: ConflictVisuMainComponent;
  let fixture: ComponentFixture<ConflictVisuMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConflictVisuMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConflictVisuMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
