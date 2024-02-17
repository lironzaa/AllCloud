import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUploadInputComponent } from './image-upload-input.component';

describe('FileInputComponent', () => {
  let component: ImageUploadInputComponent;
  let fixture: ComponentFixture<ImageUploadInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageUploadInputComponent]
    });
    fixture = TestBed.createComponent(ImageUploadInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
