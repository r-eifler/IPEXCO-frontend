import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DemoSettingsComponent} from './demo-settings.component';

describe('DemoSettingsComponent', () => {
  let component: DemoSettingsComponent;
  let fixture: ComponentFixture<DemoSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
