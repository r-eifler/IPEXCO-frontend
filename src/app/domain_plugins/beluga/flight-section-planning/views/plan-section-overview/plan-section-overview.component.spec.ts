import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionForestComponent } from './section-forest.component';

describe('SectionTreeComponent', () => {
  let component: SectionForestComponent;
  let fixture: ComponentFixture<SectionForestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionForestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionForestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
