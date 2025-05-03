import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HangarWrapperComponent } from './hangar-wrapper.component';

describe('HangarWrapperComponent', () => {
  let component: HangarWrapperComponent;
  let fixture: ComponentFixture<HangarWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HangarWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HangarWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
