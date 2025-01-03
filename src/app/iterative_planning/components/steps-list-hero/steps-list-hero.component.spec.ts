import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepsListHeroComponent } from './steps-list-hero.component';

describe('StepsListHeroComponent', () => {
  let component: StepsListHeroComponent;
  let fixture: ComponentFixture<StepsListHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepsListHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepsListHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
