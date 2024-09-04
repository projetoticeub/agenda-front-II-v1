import { HttpErrorResponse } from '@angular/common/http';
import { ProfissionaisDaSaudeService } from './../../services/profissionaisDaSaude.service';
import { Component, OnInit } from '@angular/core';
import { ProfissionalDeSaude } from 'src/app/ProfissionaisDeSaude';

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

  constructor(private profissionaisDaSaudeService: ProfissionaisDaSaudeService) { }

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
    this.pageNumber = 0; // Reseta para a primeira página ao aplicar filtro
    this.loadProfissionais(this.query);
  }
  openCreateDialog(){}

  deletarPaciente(profissionais: ProfissionalDeSaude) {
    this.profissionaisDaSaudeService.deleteProfissional(profissionais.id).subscribe(
      () => {
        console.log('Paciente deletado com sucesso');
        this.loadProfissionais(); // Atualiza a lista após deletar
      },
      error => {
        console.error('Erro ao deletar paciente:', error);
      }
    );
  }
}