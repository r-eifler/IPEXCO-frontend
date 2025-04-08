import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvalInstanceUploadComponent } from './eval-instance-upload.component';

describe('EvalInstanceUploadComponent', () => {
  let component: EvalInstanceUploadComponent;
  let fixture: ComponentFixture<EvalInstanceUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvalInstanceUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvalInstanceUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
