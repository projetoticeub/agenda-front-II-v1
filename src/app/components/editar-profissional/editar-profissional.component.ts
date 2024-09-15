import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProfissionaisDaSaudeService } from 'src/app/services/profissionaisDaSaude.service';
import { ProfissionalDeSaude } from 'src/app/ProfissionaisDeSaude';

@Component({
  selector: 'app-editar-profissional',
  templateUrl: './editar-profissional.component.html',
  styleUrls: ['./editar-profissional.component.css']
})
export class EditarProfissionalComponent implements OnInit {
  form: FormGroup;
  ufs: string[] = ['SP', 'RJ', 'MG', 'ES', 'RS', 'SC', 'PR', 'BA', 'PE', 'CE', 'GO', 'DF'];
  profissional: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private profissionaisService: ProfissionaisDaSaudeService,
    private dialogRef: MatDialogRef<EditarProfissionalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      nomeCompleto: ['', Validators.required],
      cpf: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      registro: ['', Validators.required],
      genero: ['', Validators.required],
      endereco: this.fb.group({
        cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
        rua: [{ value: '', disabled: true }],
        numero: ['', Validators.required],
        cidade: [{ value: '', disabled: true }],
        estado: ['', Validators.required]
      })
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.profissional) {
      this.profissional = this.data.profissional;
      this.form.patchValue({
        nomeCompleto: this.profissional.nomeCompleto,
        cpf: this.profissional.cpf,
        dataNascimento: this.profissional.dataNascimento,
        telefone: this.profissional.telefone,
        email: this.profissional.email,
        registro: this.profissional.registro,
        genero: this.profissional.genero,
        endereco: {
          cep: this.profissional.endereco?.cep,
          rua: this.profissional.endereco?.rua,
          numero: this.profissional.endereco?.numero,
          cidade: this.profissional.endereco?.cidade,
          estado: this.profissional.endereco?.estado
        }
      });

      if (this.profissional.endereco?.cep) {
        this.buscarEnderecoPorCep();
      }
    }
  }

  buscarEnderecoPorCep(): void {
    const cep = this.form.get('endereco.cep')?.value;
    if (cep && cep.length === 8) {
      this.profissionaisService.buscarEnderecoPorCep(cep).subscribe({
        next: (endereco: any) => {
          this.form.patchValue({
            endereco: {
              rua: endereco.logradouro,
              cidade: endereco.localidade,
              estado: endereco.uf
            }
          });
          this.form.get('endereco.rua')?.enable();
          this.form.get('endereco.cidade')?.enable();
        },
        error: (error: any) => {
          console.error('Erro ao buscar o endereço:', error);
        }
      });
    }
  }

  onSave(): void {
    if (this.form.valid) {
      const profissionalAtualizado: ProfissionalDeSaude = {
        id: this.profissional.id,
        nomeCompleto: this.form.value.nomeCompleto,
        cpf: this.form.value.cpf,
        dataNascimento: this.form.value.dataNascimento,
        telefone: this.form.value.telefone,
        email: this.form.value.email,
        registro: this.form.value.registro,
        genero: this.form.value.genero,
        cep: this.form.value.endereco.cep,
        endereco: `${this.form.value.endereco.rua}, ${this.form.value.endereco.numero}, ${this.form.value.endereco.cidade}, ${this.form.value.endereco.estado}`
      };

      this.profissionaisService.editarProfissional(this.profissional.id, profissionalAtualizado).subscribe({
        next: (response) => {
          console.log('Profissional de saúde atualizado com sucesso', response);
          this.dialogRef.close(profissionalAtualizado);
        },
        error: (error: any) => {
          console.error('Erro ao salvar profissional de saúde:', error);
        }
      });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
