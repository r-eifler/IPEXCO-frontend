import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MUGSVisuMainComponent } from './mugs-visu-main.component';

describe('ConflictGraphComponent', () => {
  let component: MUGSVisuMainComponent;
  let fixture: ComponentFixture<MUGSVisuMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MUGSVisuMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MUGSVisuMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
