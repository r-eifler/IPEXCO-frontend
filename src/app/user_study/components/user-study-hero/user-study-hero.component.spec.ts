import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStudyHeroComponent } from './user-study-hero.component';

describe('UserStudyHeroComponent', () => {
  let component: UserStudyHeroComponent;
  let fixture: ComponentFixture<UserStudyHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStudyHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStudyHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
