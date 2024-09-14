import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
    @Inject(MAT_DIALOG_DATA) public data: any // Injeta os dados do profissional via MAT_DIALOG_DATA
  ) {
    this.form = this.fb.group({
      nomeCompleto: [''],
      cpf: [''],
      dataNascimento: [''],
      telefone: [''],
      email: [''],
      registro: [''],
      genero: [''],
      endereco: this.fb.group({
        cep: [''],
        rua: [{ value: '', disabled: true }],
        numero: [''],
        cidade: [{ value: '', disabled: true }],
        estado: ['']
      })
    });
  }

  ngOnInit(): void {
    // Inicializa o formulário com os dados do profissional recebidos
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

      // Desbloqueia os campos de endereço se o CEP estiver preenchido
      if (this.profissional.endereco?.cep) {
        this.form.get('endereco.rua')?.enable();
        this.form.get('endereco.cidade')?.enable();
      }
    }
  }

  onSave(): void {
    if (this.form.valid) {
      const profissionalAtualizado: ProfissionalDeSaude = {
        nomeCompleto: this.form.value.nomeCompleto,
        cpf: this.form.value.cpf,
        dataNascimento: this.form.value.dataNascimento,
        telefone: this.form.value.telefone,
        email: this.form.value.email,
        registro: this.form.value.registro,
        genero: this.form.value.genero,
        cep: this.form.value.endereco.cep,
        endereco: `${this.form.value.endereco.rua}, ${this.form.value.endereco.numero}, ${this.form.value.endereco.cidade}, ${this.form.value.endereco.estado}`,
        id: this.profissional.id
      };

      // Passando o ID do profissional e o objeto atualizado
      this.profissionaisService.editarProfissionalDeSaude(this.profissional.id, profissionalAtualizado).subscribe({
        next: (novoProfissional: ProfissionalDeSaude) => {
          console.log('Profissional salvo com sucesso:', novoProfissional);
          this.dialogRef.close(novoProfissional);
        },
        error: (error) => {
          console.error('Erro ao salvar profissional:', error);
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
      this.profissionaisService.buscarEnderecoPorCep(cep).subscribe(endereco => {
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
