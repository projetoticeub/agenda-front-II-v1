import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroService } from './../../services/registro.service';
import { MessageService } from 'primeng/api';  // Importar MessageService

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  providers: [MessageService]  // Adicione o MessageService como provedor
})
export class RegistroComponent {
  hide = true;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private registroService: RegistroService,
    private router: Router,
    private messageService: MessageService  // Injete o MessageService
  ) {
    // Inicializando o formulário
    this.registerForm = this.fb.group({
      login: ['', Validators.required],
      senha: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const usuario = this.registerForm.value;
      console.log('Dados do usuário:', usuario);

      this.registroService.register(usuario).subscribe({
        next: (res) => {
          console.log('Usuário registrado com sucesso:', res);
          this.router.navigate(['/login']);
          this.messageService.add({severity: 'success', summary: 'Registro bem-sucedido', detail: 'O usuário foi registrado com sucesso!'});
        },
        error: (err) => {
          console.error('Erro ao registrar o usuário:', err);
          this.messageService.add({severity: 'error', summary: 'Erro no Registro', detail: 'Falha ao registrar o usuário. Dados já em uso.'});
        }
      });
    } else {
      console.log('Formulário inválido', this.registerForm.errors);
    }
  }

}
