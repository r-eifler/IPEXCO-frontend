import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyCreationChatComponent } from './property-creation-chat.component';

describe('PropertyCreationChatComponent', () => {
  let component: PropertyCreationChatComponent;
  let fixture: ComponentFixture<PropertyCreationChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyCreationChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyCreationChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
