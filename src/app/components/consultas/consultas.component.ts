import { PacientesService } from 'src/app/services/pacientes.service';
import { Component, OnInit } from '@angular/core';
import { ProfissionaisDaSaudeService } from './../../services/profissionaisDaSaude.service';
import { ProfissionalDeSaude } from 'src/app/ProfissionaisDeSaude';
import { Consulta, ConsultaService } from 'src/app/services/consultas.service';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent implements OnInit {
  novaConsulta: Consulta = {
    idPaciente: 0,
    idProfissionalDeSaude: 0,
    data: this.getCurrentDateTime()
  };

  consultaCriada: any = null;
  profissionaisDeSaude: ProfissionalDeSaude[] = []; // Array para armazenar os profissionais de saúde
  pacientes: any;

  constructor(
    private consultaService: ConsultaService,
    private profissionaisDaSaudeService: ProfissionaisDaSaudeService,
    private PacientesService: PacientesService
  ) { }

  ngOnInit(): void {
    this.carregarProfissionaisDeSaude();
    this.carregarPacientes(); // Carrega os pacientes na inicialização
  }

  criarConsulta(): void {
    this.consultaService.createConsulta(this.novaConsulta)
      .subscribe({
        next: (res) => {
          this.consultaCriada = res;
          console.log('Consulta criada com sucesso:', res);
        },
        error: (err) => console.error('Erro ao criar consulta:', err)
      });
  }

  carregarProfissionaisDeSaude(): void {
    this.profissionaisDaSaudeService.getProfissionais().subscribe(
      (data) => {
        this.profissionaisDeSaude = data.content;  // Verifique se a resposta tem a estrutura correta
      },
      (error) => {
        console.error('Erro ao carregar profissionais de saúde', error);
      }
    );
  }

  carregarPacientes(): void {
    this.PacientesService.getPacientes().subscribe(
      (data) => {
        this.pacientes = data.content;  // Supondo que a resposta seja paginada
      },
      (error) => {
        console.error('Erro ao carregar pacientes', error);
      }
    );
  }


  private getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
