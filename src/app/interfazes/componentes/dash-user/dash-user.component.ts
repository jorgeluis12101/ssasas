import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-dash-user',
  templateUrl: './dash-user.component.html',
  styleUrls: ['./dash-user.component.css']
})
export class DashUserComponent {
  isLoggedIn: boolean = false;
  userName: string = '';
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    this.authService.getUserName().subscribe(userName => {
      this.userName = userName;
    });
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
