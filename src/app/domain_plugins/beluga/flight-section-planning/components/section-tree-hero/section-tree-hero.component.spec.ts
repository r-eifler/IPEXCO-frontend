import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionTreeHeroComponent } from './section-tree-hero.component';

describe('SectionTreeHeroComponent', () => {
  let component: SectionTreeHeroComponent;
  let fixture: ComponentFixture<SectionTreeHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionTreeHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionTreeHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
