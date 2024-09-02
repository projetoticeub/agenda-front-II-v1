import { Component, OnInit } from '@angular/core';
import { Consulta, ConsultaService } from 'src/app/services/consultas.service';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent  {

    // Define a propriedade 'novaConsulta' e inicializa com valores padrão
    novaConsulta: Consulta = {
      idPaciente: 0,
      idProfissionalDeSaude: 0,
      data: ''
    };
  
    constructor(private consultaService: ConsultaService) { }
  
    criarConsulta() {
      this.consultaService.createConsulta(this.novaConsulta)
        .subscribe({
          next: (res) => console.log('Consulta criada com sucesso:', res),
          error: (err) => console.error('Erro ao criar consulta:', err)
        });
    }
  }