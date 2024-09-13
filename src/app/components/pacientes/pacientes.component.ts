import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Paciente } from 'src/app/pacientes';
import { PacientesService } from 'src/app/services/pacientes.service';
import { MatDialog } from '@angular/material/dialog';
import { AdicionarPacienteComponent } from '../adicionarPaciente/adicionarPaciente.component';
import { MessageService } from 'primeng/api';

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
  noResults: boolean = false;
  cpf: string = '';  // CPF do paciente
  nomeCompleto: string = '';  // Nome completo do paciente para busca


  constructor(private pacientesService: PacientesService, private dialog: MatDialog,
    private messageService: MessageService,

  ) {}

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
          console.error('Erro ao carregar pacientes da saúde:', error.message);
          if (error.status === 403) {
            console.error('Acesso proibido: verifique suas credenciais ou permissões.');
          }
          this.loading = false;
        }
      );
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(AdicionarPacienteComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pacientesService.addPaciente(result).subscribe({
          next: (novoPaciente: Paciente) => {
            // Adicione o novo paciente à lista de pacientes local
            this.pacientes.push(novoPaciente);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Erro ao adicionar paciente:', error.message);
          }
        });
      }
    });
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

  deletarPaciente(paciente: Paciente) {
    this.pacientesService.deletePaciente(paciente.id).subscribe(
      () => {
        console.log('profissionais deletado com sucesso');
        this.loadPacientes(); 
      },
      error => {
        console.error('Erro ao deletar paciente:', error);
      }
    );
  }
  buscarConsultasPorCpf(): void {
    this.loading = true;
    this.pacientesService.getConsultasPorCpf(this.cpf, 0,this.pageSize).subscribe({
      next: (data: any) => {
        console.log('Dados recebidos:', data.content);
        this.pacientes = data.content;
        this.totalElements = data.totalElements;
        this.noResults = this.pacientes.length === 0;
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

    this.pacientesService.getConsultasPorNome(this.nomeCompleto, 0, this.pageSize).subscribe({
      next: (data: any) => {
        console.log('Dados recebidos:', data.content);
        this.pacientes = data.content;
        this.totalElements = data.totalElements;
        this.noResults = this.pacientes.length === 0;
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