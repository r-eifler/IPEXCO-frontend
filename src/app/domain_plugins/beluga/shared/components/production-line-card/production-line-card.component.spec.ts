import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionLineCardComponent } from './production-line-card.component';

describe('ProductionLineCardComponent', () => {
  let component: ProductionLineCardComponent;
  let fixture: ComponentFixture<ProductionLineCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionLineCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionLineCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
