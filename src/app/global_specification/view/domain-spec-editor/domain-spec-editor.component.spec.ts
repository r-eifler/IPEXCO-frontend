import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainSpecEditorComponent } from './domain-spec-editor.component';

describe('DomainSpecEditorComponent', () => {
  let component: DomainSpecEditorComponent;
  let fixture: ComponentFixture<DomainSpecEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomainSpecEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomainSpecEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
