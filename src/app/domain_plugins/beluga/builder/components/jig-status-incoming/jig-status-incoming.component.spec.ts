import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JigStatusIncomingComponent } from './jig-status-incoming.component';

describe('JigStatusIncomingComponent', () => {
  let component: JigStatusIncomingComponent;
  let fixture: ComponentFixture<JigStatusIncomingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JigStatusIncomingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JigStatusIncomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
