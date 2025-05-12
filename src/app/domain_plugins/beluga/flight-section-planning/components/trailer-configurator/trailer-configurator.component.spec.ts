import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerConfiguratorComponent } from './trailer-configurator.component';

describe('TrailerConfiguratorComponent', () => {
  let component: TrailerConfiguratorComponent;
  let fixture: ComponentFixture<TrailerConfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrailerConfiguratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrailerConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
