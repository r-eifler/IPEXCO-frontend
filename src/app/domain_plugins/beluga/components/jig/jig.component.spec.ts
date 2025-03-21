import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JigComponent } from './jig.component';

describe('JigComponent', () => {
  let component: JigComponent;
  let fixture: ComponentFixture<JigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
