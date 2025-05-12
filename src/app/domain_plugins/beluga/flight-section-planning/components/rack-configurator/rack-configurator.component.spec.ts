import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RackConfiguratorComponent } from './rack-configurator.component';

describe('RackConfiguratorComponent', () => {
  let component: RackConfiguratorComponent;
  let fixture: ComponentFixture<RackConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RackConfiguratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RackConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
