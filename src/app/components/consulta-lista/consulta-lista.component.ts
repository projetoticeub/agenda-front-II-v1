import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConsultaService } from './../../services/consultas.service';
import { Consulta } from 'src/app/consulta';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consulta-lista',
  templateUrl: './consulta-lista.component.html',
  styleUrls: ['./consulta-lista.component.css']
})
export class ConsultaListaComponent implements OnInit {

  consultas: Consulta[] = [];
  totalElements: number = 0;
  pageSize: number = 10;
  loading: boolean = false;
  selectedDate: Date = new Date();
  cpf: string = '';
  noResults: boolean = false;
  searchQuery: string = '';
  nomeCompleto: string = '';

  constructor(
    private consultaService: ConsultaService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const showWelcomeMessage = localStorage.getItem('welcomeMessage');
    if (showWelcomeMessage === 'true') {
      this.messageService.add({
        severity: 'success',
        summary: 'Bem-vindo',
        detail: 'Seja bem-vindo!',
        life: 3000
      });
      localStorage.removeItem('bem vindo');
    }
    const formattedDate = this.obterDataFormatada(this.selectedDate);
    this.carregarConsultas(0, this.pageSize, formattedDate);
  }

  carregarConsultas(page: number, size: number, date?: string): void {
    this.loading = true;
    this.consultaService.getConsultas(this.searchQuery, page, size, date).subscribe({
      next: (data: any) => {
        this.consultas = data.content;
        this.totalElements = data.totalElements;
        this.noResults = this.consultas.length === 0;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar consultas'
        });
      }
    });
  }

  obterDataFormatada(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en');
  }

  deletarConsulta(consulta: Consulta): void {
    if (consulta.id && confirm(`Tem certeza que deseja deletar a consulta de ${consulta.idPaciente}?`)) {
      this.consultaService.deleteConsulta(consulta.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Consulta deletada com sucesso'
          });
          this.carregarConsultas(0, this.pageSize, this.obterDataFormatada(this.selectedDate));
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao deletar consulta'
          });
        }
      });
    }
  }

  consulta() {
    this.router.navigate(['/consultas']);
  }

  aplicarFiltroData(): void {
    const formattedDate = this.obterDataFormatada(this.selectedDate);
    this.carregarConsultas(0, this.pageSize, formattedDate);
  }

  buscarConsultasPorCpf(): void {
    this.loading = true;
    this.consultaService.getConsultasPorCpf(this.cpf, 0, this.pageSize).subscribe({
      next: (data: any) => {
        this.consultas = data.content;
        this.totalElements = data.totalElements;
        this.noResults = this.consultas.length === 0;
        this.loading = false;
      },
      error: () => {
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
    this.consultaService.getConsultasPorNome(this.nomeCompleto, 0, this.pageSize).subscribe({
      next: (data: any) => {
        this.consultas = data.content;
        this.totalElements = data.totalElements;
        this.noResults = this.consultas.length === 0;
        this.loading = false;
      },
      error: () => {
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
