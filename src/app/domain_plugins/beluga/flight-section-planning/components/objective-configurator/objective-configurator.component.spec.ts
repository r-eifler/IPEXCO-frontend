import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveConfiguratorComponent } from './objective-configurator.component';

describe('ObjectiveConfiguratorComponent', () => {
  let component: ObjectiveConfiguratorComponent;
  let fixture: ComponentFixture<ObjectiveConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectiveConfiguratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectiveConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
