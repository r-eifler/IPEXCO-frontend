import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailersStateComponent } from './trailers-state.component';

describe('TrailersStateComponent', () => {
  let component: TrailersStateComponent;
  let fixture: ComponentFixture<TrailersStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrailersStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrailersStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
