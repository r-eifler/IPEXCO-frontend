import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecCardTitleComponent } from './spec-card-title.component';

describe('SpecCardTitleComponent', () => {
  let component: SpecCardTitleComponent;
  let fixture: ComponentFixture<SpecCardTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecCardTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecCardTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
