import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIterationComponent } from './create-iteration.component';

describe('CreateIterationComponent', () => {
  let component: CreateIterationComponent;
  let fixture: ComponentFixture<CreateIterationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateIterationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateIterationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
