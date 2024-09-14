import { PacientesService } from 'src/app/services/pacientes.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core'; // Para injeção de dados
import { HttpClient } from '@angular/common/http';
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
    private http: HttpClient,
    private pacientesService: PacientesService,
    private dialogRef: MatDialogRef<EditarPacienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any  // Injeta os dados do paciente via MAT_DIALOG_DATA
  ) {
    this.form = this.fb.group({
      nomeCompleto: ['', [Validators.required]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      dataNascimento: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      genero: ['', Validators.required],
      endereco: this.fb.group({
        cep: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
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

      // Desbloqueia os campos de endereço se o CEP estiver preenchido
      if (this.paciente.endereco?.cep) {
        this.form.get('endereco.rua')?.enable();
        this.form.get('endereco.cidade')?.enable();
      }
    }
  }

  onSave(): void {
    if (this.form.valid) {
      const pacienteAtualizado: Paciente = {
        nomeCompleto: this.form.value.nomeCompleto,
        cpf: this.form.value.cpf,
        dataNascimento: this.form.value.dataNascimento,
        telefone: this.form.value.telefone,
        email: this.form.value.email,
        genero: this.form.value.genero,
        cep: this.form.value.endereco.cep,
        endereco: `${this.form.value.endereco.rua}, ${this.form.value.endereco.numero}, ${this.form.value.endereco.cidade}, ${this.form.value.endereco.estado}`,
        id: 0
      };

      // Passando o ID do paciente e o objeto atualizado
      this.pacientesService.editarPaciente(this.paciente.id, pacienteAtualizado).subscribe({
        next: (novoPaciente: Paciente) => {
          console.log('Paciente salvo com sucesso:', novoPaciente);
          this.dialogRef.close(novoPaciente);
          // Pode ser melhor evitar recarregar a página; considere atualizar a lista ou estado local.
          // window.location.reload(); // Recarrega a página após salvar
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


  buscarEnderecoPorCep(): void {
    const cep = this.form.get('endereco.cep')?.value;
    if (cep && cep.length === 9) {
      this.pacientesService.buscarEnderecoPorCep(cep).subscribe(endereco => {
        if (endereco) {
          this.form.patchValue({
            endereco: {
              rua: endereco.rua,
              cidade: endereco.cidade,
              estado: endereco.estado
            }
          });
          this.form.get('endereco.rua')?.enable();
          this.form.get('endereco.cidade')?.enable();
        }
      }, error => {
        console.error('Erro ao buscar o endereço pelo CEP', error);
      });
    }
  }
}
