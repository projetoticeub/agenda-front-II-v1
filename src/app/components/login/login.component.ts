import { AutenticacaoService } from './../../services/autenticacao.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  hide = true;

  constructor(
    private AutenticacaoService: AutenticacaoService,
    private router: Router
  ) { }

  async login() {
    try {
      // Tenta autenticar o usuário e armazenar o token
      const token = await this.AutenticacaoService.loginAuth(this.username, this.password);
      
      // Se o token foi recebido e armazenado, redireciona para a página de pacientes
      if (token) {
        console.log("Login bem-sucedido, token recebido e armazenado:", token);
        this.router.navigate(['/pacientes']);  // Redireciona para a lista de pacientes
      }
    } catch (error) {
      // Em caso de erro, exibe uma mensagem no console
      console.error("Erro no login", error);
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
