import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import baserUrl from '../servicios/helper';
import { jwtDecode } from 'jwt-decode';


interface JwtPayload {
  id: number;
  username: string;
  role: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUserRole = new BehaviorSubject<string>('');
  private currentUserName = new BehaviorSubject<string>('');  // Nuevo BehaviorSubject para el nombre de usuario

  constructor(private http: HttpClient) {
    this.checkToken();
  }

  public login(username: string, password: string): Observable<any> {
    const loginData = { username, password };
    return this.http.post(`${baserUrl}/usuario/login`, loginData).pipe(
      map((response: any) => {
        const token = response.token;
        this.setToken(token);
        const decodedToken = jwtDecode<JwtPayload>(token);
        this.currentUserRole.next(decodedToken.role);
        this.currentUserName.next(decodedToken.username);  // Almacenar el nombre de usuario
        return response;
      })
    );
  }

  public register(user: any): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(`${baserUrl}/usuario/registrar`, user, { headers });
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
    this.loggedIn.next(true);
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.currentUserRole.next('');
    this.currentUserName.next('');  // Limpiar el nombre de usuario
  }

  public getRole(): Observable<string> {
    return this.currentUserRole.asObservable();
  }

  public getUserName(): Observable<string> {  // Nuevo método para obtener el nombre de usuario
    return this.currentUserName.asObservable();
  }

  public checkToken(): void { // Cambiado a public
    const token = this.getToken();
    if (token) {
      const decodedToken = jwtDecode<JwtPayload>(token);
      this.currentUserRole.next(decodedToken.role);
      this.currentUserName.next(decodedToken.username);  // Almacenar el nombre de usuario al verificar el token
      this.loggedIn.next(true);
    }
  }

  public isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  public getUsuarioId(): number | null {
    const token = this.getToken();
    if (token) {
      const decoded: JwtPayload = jwtDecode(token);
      console.log('Token decodificado:', decoded); // Depuración
      return decoded.userId || null;
    }
    return null;
  }
}
