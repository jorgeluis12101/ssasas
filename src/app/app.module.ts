import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './interfazes/compartido/footer/footer.component';
import { LandComponent } from './interfazes/compartido/land/land.component';
import { NavbardComponent } from './interfazes/compartido/navbard/navbard.component';
import { RegistroComponent } from './interfazes/componentes/auth/registro/registro.component';
import { LoginComponent } from './interfazes/componentes/auth/login/login.component';
import { DashUserComponent } from './interfazes/componentes/dash-user/dash-user.component';
import { DashAdminComponent } from './interfazes/componentes/dash-admin/dash-admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './servicios/auth-interceptor.service';
import { CalendarioComponent } from './interfazes/componentes/dash-user/calendario/calendario.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventModalComponent } from './interfazes/componentes/dash-user/event-modal/event-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CategoriaEventosComponent } from './interfazes/componentes/dash-user/categoria-eventos/categoria-eventos.component';
import { LibretaComponent } from './interfazes/componentes/dash-user/libreta/libreta.component';
import { NotaComponent } from './interfazes/componentes/dash-user/nota/nota.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NotaPagComponent } from './interfazes/componentes/dash-user/nota-pag/nota-pag.component';
import { VernotaComponent } from './interfazes/componentes/dash-user/vernota/vernota.component';
import { CrearnotaComponent } from './interfazes/componentes/dash-user/crearnota/crearnota.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    LandComponent,
    NavbardComponent,
    RegistroComponent,
    LoginComponent,
    DashUserComponent,
    DashAdminComponent,
    CalendarioComponent,
    EventModalComponent,
    CategoriaEventosComponent,
    LibretaComponent,
    NotaComponent,
    NotaPagComponent,
    VernotaComponent,
    CrearnotaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    FullCalendarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AngularEditorModule,
    MatCardModule,
    MatListModule,
    MatCheckboxModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
