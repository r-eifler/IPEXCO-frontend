import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictVisuContainerComponent } from './conflict-visu-container.component';

describe('ConflictVisuMainComponent', () => {
  let component: ConflictVisuContainerComponent;
  let fixture: ComponentFixture<ConflictVisuContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConflictVisuContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConflictVisuContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
