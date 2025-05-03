import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerWrapperComponent } from '../trailer/trailer.component';

describe('TrailerWrapperComponent', () => {
  let component: TrailerWrapperComponent;
  let fixture: ComponentFixture<TrailerWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrailerWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrailerWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
