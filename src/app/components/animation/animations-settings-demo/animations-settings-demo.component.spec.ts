import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationsSettingsDemoComponent } from './animations-settings-demo.component';

describe('AnimationsSettingsDemoComponent', () => {
  let component: AnimationsSettingsDemoComponent;
  let fixture: ComponentFixture<AnimationsSettingsDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimationsSettingsDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationsSettingsDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
