import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionBuilderBaseComponent } from './section-builder-base.component';

describe('SectionBuilderBaseComponent', () => {
  let component: SectionBuilderBaseComponent;
  let fixture: ComponentFixture<SectionBuilderBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionBuilderBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionBuilderBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
