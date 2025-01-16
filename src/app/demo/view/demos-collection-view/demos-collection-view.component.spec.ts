import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemosCollectionViewComponent } from './demos-collection-view.component';

describe('DemosCollectionViewComponent', () => {
  let component: DemosCollectionViewComponent;
  let fixture: ComponentFixture<DemosCollectionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemosCollectionViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemosCollectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
