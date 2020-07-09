import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ViewSettingsMenuComponent} from './view-settings-menu.component';

describe('ViewSettingsComponent', () => {
  let component: ViewSettingsMenuComponent;
  let fixture: ComponentFixture<ViewSettingsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSettingsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSettingsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
