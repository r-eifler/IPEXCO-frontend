import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructuredTextComponent } from './structured-text.component';

describe('StructuredTextComponent', () => {
  let component: StructuredTextComponent;
  let fixture: ComponentFixture<StructuredTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructuredTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StructuredTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
