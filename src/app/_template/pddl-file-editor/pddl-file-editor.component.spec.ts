import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PddlFileEditorComponent } from './pddl-file-editor.component';

describe('PddlFileEditorComponent', () => {
  let component: PddlFileEditorComponent;
  let fixture: ComponentFixture<PddlFileEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PddlFileEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PddlFileEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
