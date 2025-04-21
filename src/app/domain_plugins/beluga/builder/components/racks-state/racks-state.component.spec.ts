import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacksStateComponent } from './racks-state.component';

describe('RacksStateComponent', () => {
  let component: RacksStateComponent;
  let fixture: ComponentFixture<RacksStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RacksStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RacksStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
