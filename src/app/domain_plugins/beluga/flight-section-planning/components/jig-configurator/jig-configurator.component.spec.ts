import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JigConfiguratorComponent } from './jig-configurator.component';

describe('JigConfiguratorComponent', () => {
  let component: JigConfiguratorComponent;
  let fixture: ComponentFixture<JigConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JigConfiguratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JigConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
