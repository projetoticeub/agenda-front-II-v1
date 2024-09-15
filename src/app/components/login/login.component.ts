import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  hide = true;  // Para alternar a visibilidade da senha

  constructor(
    private authService: AutenticacaoService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onLogin() {
    this.authService.loginAuth(this.username, this.password)
      .then(() => {
        // Exibe a mensagem de sucesso ao efetuar login
        this.messageService.add({
          severity: 'success',
          summary: 'Login bem-sucedido',
          detail: 'Seja bem-vindo!',
          life: 3000
        });

        // Redireciona para a página principal ou dashboard
        this.router.navigate(['/consultasl']);
      })
      .catch((error) => {
        // Exibe a mensagem de erro ao falhar no login
        this.messageService.add({
          severity: 'error',
          summary: 'Erro de Login',
          detail: 'E-mail ou senha inválidos',
          life: 3000
        });
        console.error('Erro durante o login:', error);
      });
  }
}
