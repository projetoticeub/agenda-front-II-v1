import { AutenticacaoService } from './../../services/autenticacao.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api'; // Importe o MessageService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService] // Adicione o MessageService aos provedores
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  hide: boolean = true;

  constructor(
    private AutenticacaoService: AutenticacaoService,
    private router: Router,
    private messageService: MessageService // Injete o MessageService
  ) {}

  async login() {
    try {
      await this.AutenticacaoService.loginAuth(this.username, this.password);
      this.router.navigate(['/consultasl']);
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro de Login',
        detail: 'E-mail ou senha inválidos' || error.message
      });
    }
  }
}
