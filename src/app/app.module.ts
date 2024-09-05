import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Necessário para animações do Angular Material
import { FormsModule } from '@angular/forms'; // Para usar [(ngModel)]
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card'; // Importa o MatCardModule
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';


import { TableModule } from 'primeng/table';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component'; // Caminho correto para o componente
import { RouterModule } from '@angular/router';
import { LoginPageComponent } from './page/loginPage/loginPage.component';
import { HttpClientModule } from '@angular/common/http';
import { PacientesPageComponent } from './page/pacientesPage/pacientesPage.component';
import { PacientesComponent } from './components/pacientes/pacientes.component';
import { AppRoutingModule } from './app-routing.module';
import { SidebarModule } from 'primeng/sidebar';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ButtonModule } from 'primeng/button';
import { ProfissionaisDeSaudePagesComponent } from './page/profissionaisDeSaudePages/profissionaisDeSaudePages.component';
import { ProfissionaisDeSaudeComponent } from './components/ProfissionaisDeSaude/ProfissionaisDeSaude.component';
import { ConsultasComponent } from './components/consultas/consultas.component';
import { ConsultasPagesComponent } from './page/consultasPages/consultasPages.component';
import { PanelModule } from 'primeng/panel';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { AdicionarPacienteComponent } from './components/adicionarPaciente/adicionarPaciente.component';
import {MatDialogModule} from '@angular/material/dialog';
import { AdicionarProfissionalComponent } from './components/AdicionarProfissional/AdicionarProfissional.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginPageComponent,
    PacientesPageComponent,
    PacientesComponent,
    SidebarComponent,
    ProfissionaisDeSaudePagesComponent,
    ProfissionaisDeSaudeComponent,
    ConsultasComponent,
    ConsultasPagesComponent,
    AdicionarPacienteComponent,
    AdicionarProfissionalComponent
   

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
    TableModule,
    ButtonModule,
    SidebarModule,
    PanelModule, 
    InputNumberModule,  
    CalendarModule,   
    MatSelectModule,
    ReactiveFormsModule,
    MatDialogModule,
   
  
    
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
