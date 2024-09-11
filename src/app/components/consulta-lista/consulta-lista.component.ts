import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConsultaService } from './../../services/consultas.service';
import { Consulta } from 'src/app/consulta';
import { formatDate } from '@angular/common';

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
  selectedDate: Date = new Date();  // Data inicial (hoje)
  searchQuery: string = '';  // Termo de busca adicional (não usado diretamente no exemplo)
  noResults: boolean = false; 

  constructor(
    private consultaService: ConsultaService, 
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.carregarConsultas(0, this.pageSize, this.obterDataFormatada(this.selectedDate));
  }

  carregarConsultas(page: number, size: number, date?: string): void {
    this.loading = true;

    // Faz a chamada para o serviço, passando a data e outros parâmetros
    this.consultaService.getConsultas(this.searchQuery, page, size, date).subscribe({
      next: (data: any) => {
        console.log('Dados recebidos:', data.content); 
        this.consultas = data.content;
        this.totalElements = data.totalElements;
        this.noResults = this.consultas.length === 0;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar consultas:', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar consultas'
        });
      }
    });
  }

  // Formata a data no formato 'yyyy-MM-dd'
  obterDataFormatada(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en');  
  }

  // Função para deletar uma consulta
  deletarConsulta(consulta: Consulta): void {
    if (consulta.id) {
      if (confirm(`Tem certeza que deseja deletar a consulta de ${consulta.idPaciente}?`)) {
        this.consultaService.deleteConsulta(consulta.id).subscribe({
          next: () => {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Sucesso', 
              detail: 'Consulta deletada com sucesso' 
            });
            this.carregarConsultas(0, this.pageSize, this.obterDataFormatada(this.selectedDate));
          },
          error: (err: any) => {
            console.error('Erro ao deletar consulta:', err);
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Erro', 
              detail: 'Erro ao deletar consulta' 
            });
          }
        });
      }
    } else {
      console.error('ID da consulta está indefinido.');
    }
  }

  // Função que aplica o filtro de data
  aplicarFiltroData(): void {
    const formattedDate = this.obterDataFormatada(this.selectedDate); // Formata a data
    console.log('Data formatada enviada ao back-end:', formattedDate);  // Log para verificar o valor
    this.carregarConsultas(0, this.pageSize, formattedDate); // Recarrega consultas com a nova data
  }
}
