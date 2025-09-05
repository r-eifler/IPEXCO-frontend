import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiProductionLineCardComponent } from './multi-production-line-card.component';

describe('MultiProductionLineCardComponent', () => {
  let component: MultiProductionLineCardComponent;
  let fixture: ComponentFixture<MultiProductionLineCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiProductionLineCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiProductionLineCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
