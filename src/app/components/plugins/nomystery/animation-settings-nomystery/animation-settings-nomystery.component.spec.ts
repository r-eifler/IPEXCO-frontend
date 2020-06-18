import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationSettingsNomysteryComponent } from './animation-settings-nomystery.component';

describe('AnimationSettingsNomysteryComponent', () => {
  let component: AnimationSettingsNomysteryComponent;
  let fixture: ComponentFixture<AnimationSettingsNomysteryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimationSettingsNomysteryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimationSettingsNomysteryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
