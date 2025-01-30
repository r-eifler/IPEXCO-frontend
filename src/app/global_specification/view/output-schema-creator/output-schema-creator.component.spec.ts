import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputSchemaCreatorComponent } from './output-schema-creator.component';

describe('OutputSchemaCreatorComponent', () => {
  let component: OutputSchemaCreatorComponent;
  let fixture: ComponentFixture<OutputSchemaCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutputSchemaCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutputSchemaCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
