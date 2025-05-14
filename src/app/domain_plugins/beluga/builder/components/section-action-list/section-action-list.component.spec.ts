import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionActionListComponent } from './section-action-list.component';

describe('SectionActionListComponent', () => {
  let component: SectionActionListComponent;
  let fixture: ComponentFixture<SectionActionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionActionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionActionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
