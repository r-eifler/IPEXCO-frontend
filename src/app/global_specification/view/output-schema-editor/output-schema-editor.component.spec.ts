import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputSchemaEditorComponent } from './output-schema-editor.component';

describe('OutputSchemaEditorComponent', () => {
  let component: OutputSchemaEditorComponent;
  let fixture: ComponentFixture<OutputSchemaEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutputSchemaEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutputSchemaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
