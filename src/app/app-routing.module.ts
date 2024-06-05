import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandComponent } from './interfazes/compartido/land/land.component';
import { DashAdminComponent } from './interfazes/componentes/dash-admin/dash-admin.component';
import { AdminGuard } from './servicios/admin.guard';
import { DashUserComponent } from './interfazes/componentes/dash-user/dash-user.component';
import { UserGuard } from './servicios/user.guard';
import { FooterComponent } from './interfazes/compartido/footer/footer.component';
import { LoginComponent } from './interfazes/componentes/auth/login/login.component';
import { RegistroComponent } from './interfazes/componentes/auth/registro/registro.component';
import { CalendarioComponent } from './interfazes/componentes/dash-user/calendario/calendario.component';
import { CategoriaEventosComponent } from './interfazes/componentes/dash-user/categoria-eventos/categoria-eventos.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: LandComponent },
  { path: 'login', component: LoginComponent},
  { path: 'registro', component: RegistroComponent},
  {
    path: 'admin', component: DashAdminComponent, canActivate: [AdminGuard],
    children: [
     

    ]
  },
  {
    path: 'user', component: DashUserComponent, canActivate: [UserGuard],
    children: [
      { path: 'calendario', component: CalendarioComponent},
      { path: 'categoria-eventos', component: CategoriaEventosComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
