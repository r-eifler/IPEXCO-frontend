import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RackWrapperComponent } from '../rack/rack.component';

describe('RackWrapperComponent', () => {
  let component: RackWrapperComponent;
  let fixture: ComponentFixture<RackWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RackWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RackWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
