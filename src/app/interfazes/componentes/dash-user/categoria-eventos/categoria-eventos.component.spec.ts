import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaEventosComponent } from './categoria-eventos.component';

describe('CategoriaEventosComponent', () => {
  let component: CategoriaEventosComponent;
  let fixture: ComponentFixture<CategoriaEventosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriaEventosComponent]
    });
    fixture = TestBed.createComponent(CategoriaEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
