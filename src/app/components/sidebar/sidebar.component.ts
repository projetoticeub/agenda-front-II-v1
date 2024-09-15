import { HttpClient } from '@angular/common/http';
import { Component, } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent{

  sidebarVisible: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
  ){}

out() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
clientes() {
  this.router.navigate(['/profissionaisDeSaude']);
}
pacientes() {
  this.router.navigate(['/pacientes']);
}
inicio() {
  this.router.navigate(['/login']);
}
consultas() {
  this.router.navigate(['/consultas']);
}
listaC() {
  this.router.navigate(['/consultasl']);
}
registros() {
  this.router.navigate(['/registros']);
}

}
