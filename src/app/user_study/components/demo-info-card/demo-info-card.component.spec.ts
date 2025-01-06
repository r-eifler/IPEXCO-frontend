import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoInfoCardComponent } from './demo-info-card.component';

describe('DemoInfoCardComponent', () => {
  let component: DemoInfoCardComponent;
  let fixture: ComponentFixture<DemoInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoInfoCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
