import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Paciente } from 'src/app/pacientes';
import { PacientesService } from 'src/app/services/pacientes.service';
import { MatDialog } from '@angular/material/dialog';
import { AdicionarPacienteComponent } from '../adicionarPaciente/adicionarPaciente.component';
import { MessageService } from 'primeng/api';
import { EditarPacienteComponent } from '../editar-paciente/editar-paciente.component';

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
  cpf: string = '';
  nomeCompleto: string = '';

  constructor(
    private pacientesService: PacientesService,
    private dialog: MatDialog,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPacientes();
  }

  loadPacientes(query: string = ''): void {
    this.loading = true;
    this.pacientesService.getPacientes(query, this.pageNumber, this.pageSize).subscribe(
      data => {
        this.pacientes = data.content;
        this.totalElements = data.totalElements;
        this.loading = false;
      },
      (error: HttpErrorResponse) => {
        console.error('Erro ao carregar pacientes:', error.message);
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
    this.pacientesService.getPacientes('', page, size).subscribe(response => {
      this.pacientes = response.content;
      this.totalElements = response.totalElements;
      this.loading = false;
    }, error => {
      console.error('Erro ao carregar pacientes:', error);
      this.loading = false;
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(AdicionarPacienteComponent, {
      width: '400px',
      height: '700px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pacientesService.addPaciente(result).subscribe({
          next: (novoPaciente: Paciente) => {
            this.pacientes.push(novoPaciente);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Erro ao adicionar paciente:', error.message);
          }
        });
      }
    });
  }

  openEditDialog(paciente: Paciente) {
    const dialogRef = this.dialog.open(EditarPacienteComponent, {
      width: '500px',
      height: '700px',
      data: { paciente }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pacientesService.editarPaciente(paciente.id, result).subscribe({
          next: (pacienteAtualizado: Paciente) => {
            const index = this.pacientes.findIndex(p => p.id === paciente.id);
            if (index !== -1) {
              this.pacientes[index] = pacienteAtualizado;
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

  applyFilterGlobal($event: any): void {
    const query = $event.target.value || '';
    this.pageNumber = 0;
    this.loadPacientes(query);
  }

  deletarPaciente(paciente: Paciente) {
    if (confirm(`Tem certeza que deseja deletar o paciente ${paciente.nomeCompleto}?`)) {
      this.pacientesService.deletePaciente(paciente.id).subscribe({
        next: () => {
          this.pacientes = this.pacientes.filter(p => p.id !== paciente.id);
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Paciente ${paciente.nomeCompleto} deletado com sucesso!`
          });
          this.noResults = this.pacientes.length === 0;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao deletar paciente:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao deletar paciente'
          });
        }
      });
    }
  }

  buscarConsultasPorCpf(): void {
    this.loading = true;
    this.pacientesService.getConsultasPorCpf(this.cpf, 0, this.pageSize).subscribe({
      next: (data: any) => {
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
        this.pacientes = data.content;
        this.totalElements = data.totalElements;
        this.noResults = this.pacientes.length === 0;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erro ao buscar consultas por nome:', err);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar consultas por nome'
        });
      }
    });
  }
}
