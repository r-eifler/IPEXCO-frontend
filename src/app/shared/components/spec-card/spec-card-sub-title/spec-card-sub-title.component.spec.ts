import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecCardSubTitleComponent } from './spec-card-sub-title.component';

describe('SpecCardSubTitleComponent', () => {
  let component: SpecCardSubTitleComponent;
  let fixture: ComponentFixture<SpecCardSubTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecCardSubTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecCardSubTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
