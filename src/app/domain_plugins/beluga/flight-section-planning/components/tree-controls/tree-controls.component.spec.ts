import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeControlsComponent } from './tree-controls.component';

describe('TreeControlsComponent', () => {
  let component: TreeControlsComponent;
  let fixture: ComponentFixture<TreeControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
