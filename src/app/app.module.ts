import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Necessário para animações do Angular Material
import { FormsModule } from '@angular/forms'; // Para usar [(ngModel)]
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card'; // Importa o MatCardModule

import { TableModule } from 'primeng/table';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component'; // Caminho correto para o componente
import { RouterModule } from '@angular/router';
import { LoginPageComponent } from './page/loginPage/loginPage.component';
import { HttpClientModule } from '@angular/common/http';
import { PacientesPageComponent } from './page/pacientesPage/pacientesPage.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginPageComponent,
    PacientesPageComponent,
    PacientesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
    TableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
