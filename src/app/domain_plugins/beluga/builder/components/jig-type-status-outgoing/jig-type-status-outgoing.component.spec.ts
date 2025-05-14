import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JigTypeStatusOutgoingComponent } from './jig-type-status-outgoing.component';

describe('JigTypeStatusOutgoingComponent', () => {
  let component: JigTypeStatusOutgoingComponent;
  let fixture: ComponentFixture<JigTypeStatusOutgoingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JigTypeStatusOutgoingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JigTypeStatusOutgoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
