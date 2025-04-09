import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictListsComponent } from './conflict-lists.component';

describe('ConflictListsComponent', () => {
  let component: ConflictListsComponent;
  let fixture: ComponentFixture<ConflictListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConflictListsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConflictListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
