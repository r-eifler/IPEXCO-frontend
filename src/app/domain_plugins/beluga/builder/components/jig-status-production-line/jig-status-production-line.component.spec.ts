import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JigStatusProductionLineComponent } from './jig-status-production-line.component';

describe('JigStatusProductionLineComponent', () => {
  let component: JigStatusProductionLineComponent;
  let fixture: ComponentFixture<JigStatusProductionLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JigStatusProductionLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JigStatusProductionLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
