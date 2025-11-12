import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensionCheckViewComponent } from './comprehension-check-view.component';

describe('ComprehensionCheckViewComponent', () => {
  let component: ComprehensionCheckViewComponent;
  let fixture: ComponentFixture<ComprehensionCheckViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprehensionCheckViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprehensionCheckViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

