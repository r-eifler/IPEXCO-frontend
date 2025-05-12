import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapConfiguratorComponent } from './swap-configurator.component';

describe('SwapConfiguratorComponent', () => {
  let component: SwapConfiguratorComponent;
  let fixture: ComponentFixture<SwapConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwapConfiguratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwapConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
