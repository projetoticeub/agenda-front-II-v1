import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Paciente } from 'src/app/pacientes';
import { PacientesService } from 'src/app/services/pacientes.service';


@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {
  query = '';
  pageNumber = 0;
  pageSize = 17;
  totalElements = 0;
  pacientes: Paciente[] = [];
  loading = true;

  constructor(private pacientesService: PacientesService) {}

  ngOnInit(): void {
    this.loadPacientes();
  }

  loadPacientes(query: string = ''): void {
    this.loading = true;
    this.pacientesService.getPacientes(query, this.pageNumber, this.pageSize)
      .subscribe(
        data => {
          this.pacientes = data.content;
          this.totalElements = data.totalElements;
          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          console.error('Erro ao carregar pacientes:', error.message);
          this.loading = false;
        }
      );
  }

  onPageChange(event: any): void {
    this.pageNumber = event.page;
    this.pageSize = event.rows;
    this.loadPacientes();
  }

  applyFilterGlobal($event: any): void {
    const query = $event.target.value || '';
    this.pageNumber = 0;
    this.loadPacientes(query);
  }
}
