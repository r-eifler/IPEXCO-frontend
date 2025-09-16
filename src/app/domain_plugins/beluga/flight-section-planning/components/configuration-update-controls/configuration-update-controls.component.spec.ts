import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationUpdateControlsComponent } from './configuration-update-controls.component';

describe('ConfigurationUpdateControlsComponent', () => {
  let component: ConfigurationUpdateControlsComponent;
  let fixture: ComponentFixture<ConfigurationUpdateControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationUpdateControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationUpdateControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
