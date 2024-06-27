import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibretaComponent } from './libreta.component';

describe('LibretaComponent', () => {
  let component: LibretaComponent;
  let fixture: ComponentFixture<LibretaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LibretaComponent]
    });
    fixture = TestBed.createComponent(LibretaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
