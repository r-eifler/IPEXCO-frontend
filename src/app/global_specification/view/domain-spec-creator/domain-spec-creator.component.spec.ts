import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainSpecCreatorComponent } from './domain-spec-creator.component';

describe('DomainSpecCreatorComponent', () => {
  let component: DomainSpecCreatorComponent;
  let fixture: ComponentFixture<DomainSpecCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomainSpecCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomainSpecCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
