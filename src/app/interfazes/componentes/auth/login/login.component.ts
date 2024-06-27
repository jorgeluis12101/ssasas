// login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../servicios/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onLogin(): void {
    if (this.loginForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el formulario',
        text: 'Por favor, complete todos los campos correctamente.',
      });
      return;
    }

    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe(
      () => {
        this.authService.getRole().subscribe(role => {
          if (role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/user/calendario']);
          }
        });
      },
      error => {
        console.error('Error al iniciar sesión', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: 'Nombre de usuario o contraseña incorrectos.',
        });
      }
    );
  }
}
