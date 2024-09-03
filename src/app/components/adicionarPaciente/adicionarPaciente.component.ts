import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { PacientesService } from './../../services/pacientes.service';
import { Paciente } from './../../pacientes';

@Component({
  selector: 'app-adicionarPaciente',
  templateUrl: './adicionarPaciente.component.html',
  styleUrls: ['./adicionarPaciente.component.css']
})
export class AdicionarPacienteComponent implements OnInit {
  form!: FormGroup;
  ufs: string[] = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]; // Estados brasileiros

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private pacientesService: PacientesService,
    private dialogRef: MatDialogRef<AdicionarPacienteComponent>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nomeCompleto: ['', Validators.required],
      cpf: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      genero: ['', Validators.required],
      endereco: this.fb.group({
        cep: ['', Validators.required],
        rua: [''],
        numero: [''],
        cidade: [''],
        estado: ['']
      })
    });
  }

  buscarEnderecoPorCep(): void {
    const cep = this.form.get('endereco.cep')?.value;
    if (cep && cep.length === 8) {
      this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe(data => {
        if (data) {
          this.form.patchValue({
            endereco: {
              rua: data.logradouro,
              cidade: data.localidade,
              estado: data.uf
            }
          });
        }
      });
    }
  }

  onSave(): void {
    if (this.form.valid) {
      const paciente: Paciente = {
        id: 0,
        nomeCompleto: this.form.value.nomeCompleto,
        cpf: this.form.value.cpf,
        dataNascimento: this.form.value.dataNascimento,
        telefone: this.form.value.telefone,
        email: this.form.value.email,
        genero: this.form.value.genero,
        cep: this.form.value.endereco.cep,
        endereco: `${this.form.value.endereco.rua}, ${this.form.value.endereco.numero}, ${this.form.value.endereco.cidade}, ${this.form.value.endereco.estado}`
      };

      this.pacientesService.addPaciente(paciente).subscribe({
        next: (novoPaciente: Paciente) => {
          console.log('Paciente salvo com sucesso:', novoPaciente);
          this.dialogRef.close(novoPaciente);
        },
        error: (error) => {
          console.error('Erro ao salvar paciente:', error);
        }
      });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
