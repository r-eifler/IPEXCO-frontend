import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JigStatusComponent } from './jig-status.component';

describe('JigStatusComponent', () => {
  let component: JigStatusComponent;
  let fixture: ComponentFixture<JigStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JigStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JigStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
