// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { PacientesPageComponent } from './page/pacientesPage/pacientesPage.component';
import { ProfissionaisDeSaudePagesComponent } from './page/profissionaisDeSaudePages/profissionaisDeSaudePages.component';
import { ConsultasPagesComponent } from './page/consultasPages/consultasPages.component';
import { ConsultaListaPagesComponent } from './page/consulta-listaPages/consulta-listaPages.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'pacientes', component: PacientesPageComponent },
  { path: 'profissionaisDeSaude', component: ProfissionaisDeSaudePagesComponent },
  { path: 'consultas', component: ConsultasPagesComponent },
  { path: 'consultasl', component: ConsultaListaPagesComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
