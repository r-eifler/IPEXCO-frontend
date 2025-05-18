import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiugurationUpdateControlsComponent } from './confiuguration-update-controls.component';

describe('ConfiugurationUpdateControlsComponent', () => {
  let component: ConfiugurationUpdateControlsComponent;
  let fixture: ComponentFixture<ConfiugurationUpdateControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiugurationUpdateControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiugurationUpdateControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
