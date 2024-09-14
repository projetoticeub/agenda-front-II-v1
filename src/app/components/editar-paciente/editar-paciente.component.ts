import { PacientesService } from 'src/app/services/pacientes.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core'; // Para injeção de dados
import { Paciente } from 'src/app/pacientes';

@Component({
  selector: 'app-editar-paciente',
  templateUrl: './editar-paciente.component.html',
  styleUrls: ['./editar-paciente.component.css']
})
export class EditarPacienteComponent implements OnInit {
  form: FormGroup;
  ufs: string[] = ['SP', 'RJ', 'MG', 'ES', 'RS', 'SC', 'PR', 'BA', 'PE', 'CE', 'GO', 'DF'];
  paciente: any;

  constructor(
    private fb: FormBuilder,
    private pacientesService: PacientesService,
    private dialogRef: MatDialogRef<EditarPacienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any  // Injeta os dados do paciente via MAT_DIALOG_DATA
  ) {
    this.form = this.fb.group({
      nomeCompleto: ['', [Validators.required]],
      dataNascimento: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      genero: ['', Validators.required],
      endereco: this.fb.group({
        cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],  // Permite o formato XXXXXXXX (sem hífen)
        rua: [{ value: '', disabled: true }],
        numero: ['', Validators.required],
        cidade: [{ value: '', disabled: true }],
        estado: ['', Validators.required]
      })
    });
  }

  ngOnInit(): void {
    // Inicializa o formulário com os dados do paciente recebidos
    if (this.data && this.data.paciente) {
      this.paciente = this.data.paciente;
      this.form.patchValue({
        nomeCompleto: this.paciente.nomeCompleto,
        cpf: this.paciente.cpf,
        dataNascimento: this.paciente.dataNascimento,
        telefone: this.paciente.telefone,
        email: this.paciente.email,
        genero: this.paciente.genero,
        endereco: {
          cep: this.paciente.endereco?.cep,
          rua: this.paciente.endereco?.rua,
          numero: this.paciente.endereco?.numero,
          cidade: this.paciente.endereco?.cidade,
          estado: this.paciente.endereco?.estado
        }
      });

      // Chama a função para buscar o endereço baseado no CEP automaticamente
      this.buscarEnderecoPorCep();
    }
  }

  buscarEnderecoPorCep(): void {
    const cep = this.form.get('endereco.cep')?.value;

    // Verifica se o CEP tem o formato correto antes de fazer a requisição
    if (cep && cep.length === 8) {
      this.pacientesService.buscarEnderecoPorCep(cep).subscribe({
        next: (endereco) => {
          if (!endereco.erro) {
            // Preenche os campos de Rua, Cidade e Estado com os valores retornados pela API
            this.form.patchValue({
              endereco: {
                rua: endereco.logradouro,
                cidade: endereco.localidade,
                estado: endereco.uf
              }
            });
          } else {
            console.error('CEP não encontrado.');
          }
        },
        error: (err) => {
          console.error('Erro ao buscar o endereço:', err);
        }
      });
    }
  }

  onSave(): void {
    if (this.form.valid) {
      const pacienteAtualizado: Paciente = {
        id: this.paciente.id,  // Mantemos o ID do paciente original
        nomeCompleto: this.form.value.nomeCompleto,
        cpf: this.form.value.cpf,
        dataNascimento: this.form.value.dataNascimento,
        telefone: this.form.value.telefone,
        email: this.form.value.email,
        genero: this.form.value.genero,
        cep: this.form.value.endereco.cep,
        endereco: `${this.form.value.endereco.rua}, ${this.form.value.endereco.numero}, ${this.form.value.endereco.cidade}, ${this.form.value.endereco.estado}`
      };

      this.pacientesService.editarPaciente(this.paciente.id, pacienteAtualizado).subscribe({
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
  logCepError(): void {
    const cepControl = this.form.get('endereco.cep');

    if (cepControl) {
      console.log('CEP atual:', cepControl.value);  // Loga o valor atual do CEP
      console.log('Erros:', cepControl.errors);     // Loga os erros, se houver
    }
  }
  onClose(): void {
    this.dialogRef.close();
  }
}
