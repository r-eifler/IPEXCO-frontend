import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationSelectorComponent } from './configuration-selector.component';

describe('ConfigurationSelectorComponent', () => {
  let component: ConfigurationSelectorComponent;
  let fixture: ComponentFixture<ConfigurationSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
