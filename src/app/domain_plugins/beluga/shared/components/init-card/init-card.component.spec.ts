import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitCardComponent } from './init-card.component';

describe('InitCardComponent', () => {
  let component: InitCardComponent;
  let fixture: ComponentFixture<InitCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
