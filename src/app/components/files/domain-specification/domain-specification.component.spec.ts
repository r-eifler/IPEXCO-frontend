import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DomainSpecificationComponent} from './domain-specification.component';

describe('DomainSpecificationComponent', () => {
  let component: DomainSpecificationComponent;
  let fixture: ComponentFixture<DomainSpecificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainSpecificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainSpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
