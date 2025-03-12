import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCreatorComponent } from './sercive-creator.component';

describe('SerciveCreatorComponent', () => {
  let component: ServiceCreatorComponent;
  let fixture: ComponentFixture<ServiceCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
