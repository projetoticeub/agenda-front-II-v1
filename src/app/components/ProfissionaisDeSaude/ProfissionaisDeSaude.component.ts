import { HttpErrorResponse } from '@angular/common/http';
import { ProfissionaisDaSaudeService } from './../../services/profissionaisDaSaude.service';
import { Component, OnInit } from '@angular/core';
import { ProfissionalDeSaude } from 'src/app/ProfissionaisDeSaude';
import { AdicionarProfissionalComponent } from '../AdicionarProfissional/AdicionarProfissional.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';


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


  constructor(private profissionaisDaSaudeService: ProfissionaisDaSaudeService,private dialog: MatDialog,private messageService: MessageService,) { }

  ngOnInit(): void {
    this.loadProfissionais();
  }

  loadProfissionais(query: string = ''): void {
    this.loading = true;
    this.profissionaisDaSaudeService.getProfissionais(query, this.pageNumber, this.pageSize)
      .subscribe(
        data => {
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

  onPageChange(event: any): void {
    this.pageNumber = event.page;
    this.pageSize = event.rows;
    this.loadProfissionais(this.query);
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

    dialogRef.afterClosed().subscribe(result => {
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

  deletarProfissional(ProfissionalDeSaude: ProfissionalDeSaude) {
    this.profissionaisDaSaudeService.deleteProfissionais(ProfissionalDeSaude.id).subscribe(
      () => {
        console.log('profissionais deletado com sucesso');
        this.loadProfissionais(); // Atualiza a lista após deletar
      },
      error => {
        console.error('Erro ao deletar paciente:', error);
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
    this.profissionaisDaSaudeService.getConsultasPorCpf(this.cpf, 0,this.pageSize).subscribe({
      next: (data: any) => {
        console.log('Dados recebidos:', data.content);
        this.profissionais = data.content;
        this.totalElements = data.totalElements;
        this.noResults = this.profissionais.length === 0;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erro ao buscar consultas por CPF:', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar consultas por CPF'
        });
      }
    });
  }
  buscarConsultasPorNome(): void {
    this.loading = true;

    this.profissionaisDaSaudeService.getConsultasPorNome(this.nomeCompleto, 0, this.pageSize).subscribe({
      next: (data: any) => {
        console.log('Dados recebidos:', data.content);
        this.profissionais = data.content;
        this.totalElements = data.totalElements;
        this.noResults = this.profissionais.length === 0;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erro ao buscar consultas por CPF:', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar consultas por CPF'
        });
      }
    });
  }
}