import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HangarsStateComponent } from './hangars-state.component';

describe('HangarsStateComponent', () => {
  let component: HangarsStateComponent;
  let fixture: ComponentFixture<HangarsStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HangarsStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HangarsStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
