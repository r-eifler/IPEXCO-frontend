import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationExplanationViewComponent } from './configuration-explanation-view.component';

describe('ConfigurationExplanationViewComponent', () => {
  let component: ConfigurationExplanationViewComponent;
  let fixture: ComponentFixture<ConfigurationExplanationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationExplanationViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationExplanationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
