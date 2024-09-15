import { ProfissionalDeSaude } from './../../ProfissionaisDeSaude';
import { HttpErrorResponse } from '@angular/common/http';
import { ProfissionaisDaSaudeService } from './../../services/profissionaisDaSaude.service';
import { Component, OnInit } from '@angular/core';
import { AdicionarProfissionalComponent } from '../AdicionarProfissional/AdicionarProfissional.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { EditarProfissionalComponent } from '../editar-profissional/editar-profissional.component';

@Component({
  selector: 'app-ProfissionaisDeSaude',
  templateUrl: './ProfissionaisDeSaude.component.html',
  styleUrls: ['./ProfissionaisDeSaude.component.css']
})
export class ProfissionaisDeSaudeComponent implements OnInit {
  profissionais: ProfissionalDeSaude[] = [];
  query = '';
  pageNumber = 0;
  pageSize = 17;
  totalElements = 0;
  loading = true;
  noResults: boolean = false;
  cpf: string = '';
  nomeCompleto: string = '';

  constructor(
    private profissionaisDaSaudeService: ProfissionaisDaSaudeService,
    private dialog: MatDialog,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProfissionais();
  }

  loadProfissionais(query: string = ''): void {
    this.loading = true;
    this.profissionaisDaSaudeService.getProfissionais(query, this.pageNumber, this.pageSize).subscribe(
      (data) => {
        this.profissionais = data.content;
        this.totalElements = data.totalElements;
        this.loading = false;
      },
      (error: HttpErrorResponse) => {
        console.error('Erro ao carregar profissionais da saúde:', error.message);
        if (error.status === 403) {
          console.error('Acesso proibido: verifique suas credenciais ou permissões.');
        }
        this.loading = false;
      }
    );
  }

  onPageChange(event: any) {
    const page = event.first / event.rows;
    const pageSize = event.rows;

    this.buscarPacientes(page, pageSize);
  }

  buscarPacientes(page: number, size: number) {
    this.loading = true;
    this.profissionaisDaSaudeService.getProfissionais('', page, size).subscribe(
      (response) => {
        this.profissionais = response.content;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      (error) => {
        console.error('Erro ao carregar pacientes:', error);
        this.loading = false;
      }
    );
  }

  applyFilterGlobal($event: any): void {
    this.query = $event.target.value || '';
    this.pageNumber = 0;
    this.loadProfissionais(this.query);
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(AdicionarProfissionalComponent, {
      width: '400px',
      height: '700px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.profissionaisDaSaudeService.addProfissional(result).subscribe({
          next: (novoProfissional: ProfissionalDeSaude) => {
            this.profissionais.push(novoProfissional);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Erro ao adicionar profissional:', error.message);
          }
        });
      }
    });
  }

  openEditDialog(profissionais: ProfissionalDeSaude) {
    const dialogRef = this.dialog.open(EditarProfissionalComponent, {
      width: '500px',
      height: '700px',
      data: { profissional: profissionais }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.profissionaisDaSaudeService.editarProfissional(profissionais.id, result).subscribe({
          next: (ProfissionalDeSaudeAtualizado: ProfissionalDeSaude) => {
            const index = this.profissionais.findIndex((p) => p.id === profissionais.id);
            if (index !== -1) {
              this.profissionais[index] = ProfissionalDeSaudeAtualizado;
              this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Paciente atualizado com sucesso!' });
            }
          },
          error: (error: HttpErrorResponse) => {
            console.error('Erro ao editar paciente:', error.message);
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao editar paciente' });
          }
        });
      }
    });
  }

  deletarProfissional(ProfissionalDeSaude: ProfissionalDeSaude) {
    this.profissionaisDaSaudeService.deleteProfissional(ProfissionalDeSaude.id).subscribe(
      () => {
        console.log('Profissional deletado com sucesso');
        this.loadProfissionais();
      },
      (error) => {
        console.error('Erro ao deletar profissional:', error);
      }
    );
  }

  recarregarProfissionais(): void {
    this.profissionaisDaSaudeService.getProfissionais().subscribe({
      next: (data) => {
        this.profissionais = data;
      },
      error: (error) => {
        console.error('Erro ao carregar profissionais:', error);
      }
    });
  }

  buscarConsultasPorCpf(): void {
    this.loading = true;
    this.profissionaisDaSaudeService.getConsultasPorCpf(this.cpf, 0, this.pageSize).subscribe({
      next: (data: any) => {
        this.profissionais = data.content;
        this.totalElements = data.totalElements;
        this.noResults = this.profissionais.length === 0;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erro ao buscar consultas por CPF:', err);
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar consultas por CPF' });
      }
    });
  }

  buscarConsultasPorNome(): void {
    this.loading = true;
    this.profissionaisDaSaudeService.getConsultasPorNome(this.nomeCompleto, 0, this.pageSize).subscribe({
      next: (data: any) => {
        this.profissionais = data.content;
        this.totalElements = data.totalElements;
        this.noResults = this.profissionais.length === 0;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erro ao buscar consultas por nome:', err);
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar consultas por nome' });
      }
    });
  }
}
