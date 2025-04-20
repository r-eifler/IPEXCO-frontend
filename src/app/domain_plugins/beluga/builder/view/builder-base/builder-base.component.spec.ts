import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuilderBaseComponent } from './builder-base.component';

describe('BuilderBaseComponent', () => {
  let component: BuilderBaseComponent;
  let fixture: ComponentFixture<BuilderBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuilderBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
