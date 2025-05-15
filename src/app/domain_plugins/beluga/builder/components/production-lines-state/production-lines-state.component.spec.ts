import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionLinesStateComponent } from './production-lines-state.component';

describe('ProductionLinesStateComponent', () => {
  let component: ProductionLinesStateComponent;
  let fixture: ComponentFixture<ProductionLinesStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionLinesStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionLinesStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
