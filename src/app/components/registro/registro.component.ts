import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroService } from './../../services/registro.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  providers: [MessageService]
})
export class RegistroComponent {
  hide = true;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private registroService: RegistroService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group({
      login: ['', Validators.required],
      senha: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const usuario = this.registerForm.value;

      this.registroService.register(usuario).subscribe({
        next: (res) => {
          this.router.navigate(['/login']);
          this.messageService.add({severity: 'success', summary: 'Registro bem-sucedido', detail: 'O usuário foi registrado com sucesso!'});
        },
        error: (err) => {
          this.messageService.add({severity: 'error', summary: 'Erro no Registro', detail: 'Falha ao registrar o usuário.'});
        }
      });
    } else {
      console.log('Formulário inválido', this.registerForm.errors);
    }
  }
}
