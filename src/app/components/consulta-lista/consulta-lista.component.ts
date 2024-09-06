import { ConsultaService } from './../../services/consultas.service';
import { Component, OnInit } from '@angular/core';
import { MessageService, LazyLoadEvent } from 'primeng/api';
import { Consulta } from 'src/app/consulta';


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
  searchQuery: string = '';

  constructor(private ConsultaService: ConsultaService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadConsultas(0, this.pageSize);
  }

  // Método para carregar as consultas com paginação e busca
  loadConsultas(page: number, size: number, query: string = ''): void {
    this.loading = true;
    this.ConsultaService.getConsultas(query, page, size).subscribe({
      next: (data: any) => {
        this.consultas = data.content;
        this.totalElements = data.totalElements;
        this.loading = false;
      },
      error: (err: any) => { // Tipo explícito para erro
        console.error('Erro ao carregar consultas:', err);
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar consultas' });
      }
    });
  }

  applyFilterGlobal(event: any): void {
    const query = event.target.value;
    this.searchQuery = query;
    this.loadConsultas(0, this.pageSize, query) // Recarregar a lista ao aplicar filtro
  }

  onPageChange(event: LazyLoadEvent): void {
    const page = event.first! / (event.rows ?? this.pageSize); // Usa o operador de coalescência nula
    const size = event.rows ?? this.pageSize; // Substitui null por this.pageSize
    this.loadConsultas(page, size, this.searchQuery);
  }

  deletarConsulta(consulta: Consulta): void {
    if (consulta.id) {
      if (confirm(`Tem certeza que deseja deletar a consulta com ID do paciente ${consulta.idPaciente}?`)) {
        this.ConsultaService.deleteConsulta(consulta.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Consulta deletada' });
            this.loadConsultas(0, this.pageSize, this.searchQuery);
          },
          error: (err: any) => {
            console.error('Erro ao deletar consulta:', err);
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar consulta' });
          }
        });
      }
    } else {
      console.error('ID da consulta está indefinido.');
    }
  }
}