import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionLineStateComponent } from './production-line-state.component';

describe('ProductionLineStateComponent', () => {
  let component: ProductionLineStateComponent;
  let fixture: ComponentFixture<ProductionLineStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionLineStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionLineStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
