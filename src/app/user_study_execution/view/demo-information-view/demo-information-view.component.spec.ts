import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoInformationViewComponent } from './demo-information-view.component';

describe('DemoInformationViewComponent', () => {
  let component: DemoInformationViewComponent;
  let fixture: ComponentFixture<DemoInformationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoInformationViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoInformationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
