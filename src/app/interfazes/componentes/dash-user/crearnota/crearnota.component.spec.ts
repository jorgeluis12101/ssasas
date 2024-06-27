import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearnotaComponent } from './crearnota.component';

describe('CrearnotaComponent', () => {
  let component: CrearnotaComponent;
  let fixture: ComponentFixture<CrearnotaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearnotaComponent]
    });
    fixture = TestBed.createComponent(CrearnotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
