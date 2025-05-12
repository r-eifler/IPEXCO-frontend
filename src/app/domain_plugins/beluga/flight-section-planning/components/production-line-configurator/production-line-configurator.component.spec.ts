import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionLineConfiguratorComponent } from './production-line-configurator.component';

describe('ProductionLineConfiguratorComponent', () => {
  let component: ProductionLineConfiguratorComponent;
  let fixture: ComponentFixture<ProductionLineConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionLineConfiguratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionLineConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
