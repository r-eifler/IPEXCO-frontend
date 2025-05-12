import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HangarConfiguratorComponent } from './hangar-configurator.component';

describe('HangarConfiguratorComponent', () => {
  let component: HangarConfiguratorComponent;
  let fixture: ComponentFixture<HangarConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HangarConfiguratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HangarConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
