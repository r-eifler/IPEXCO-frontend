import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolDescriptionCardComponent } from './tool-description-card.component';

describe('ToolDescriptionCardComponent', () => {
  let component: ToolDescriptionCardComponent;
  let fixture: ComponentFixture<ToolDescriptionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolDescriptionCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolDescriptionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
