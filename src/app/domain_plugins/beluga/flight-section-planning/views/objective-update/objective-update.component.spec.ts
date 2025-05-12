import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveUpdateComponent } from './objective-update.component';

describe('ObjectiveUpdateComponent', () => {
  let component: ObjectiveUpdateComponent;
  let fixture: ComponentFixture<ObjectiveUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectiveUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectiveUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
