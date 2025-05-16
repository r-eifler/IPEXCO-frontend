import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationUpdateViewComponent } from './configuration-update-view.component';

describe('ConfigurationUpdateViewComponent', () => {
  let component: ConfigurationUpdateViewComponent;
  let fixture: ComponentFixture<ConfigurationUpdateViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationUpdateViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationUpdateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
