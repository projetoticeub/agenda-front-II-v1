import { RegistroService } from './../../services/registro.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  hide = true;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private RegistroService: RegistroService, private router: Router) {
    // Inicializando o formulário
    this.registerForm = this.fb.group({
      login: ['', Validators.required],
      senha: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const user = this.registerForm.value;

      // Chamando o método de registro no AuthService que usa o environment
      this.RegistroService.register(user).subscribe({
        next: (res) => {
          console.log('Usuário registrado com sucesso:', res);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Erro ao registrar o usuário:', err);
        }
      });
    }
  }
}
