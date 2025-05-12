import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionLinesConfiguratorComponent } from './production-lines-configurator.component';

describe('ProductionLinesConfiguratorComponent', () => {
  let component: ProductionLinesConfiguratorComponent;
  let fixture: ComponentFixture<ProductionLinesConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionLinesConfiguratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionLinesConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
