import { Component, OnInit } from '@angular/core';
import { Consulta, ConsultaService } from 'src/app/services/consultas.service';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent  {
  novaConsulta: Consulta = {
    idPaciente: 0,
    idProfissionalDeSaude: 0,
    data: this.getCurrentDateTime()
  };

  consultaCriada: any = null;  // Variável para armazenar os dados da consulta criada

  constructor(private consultaService: ConsultaService) { }

  criarConsulta() {
    this.consultaService.createConsulta(this.novaConsulta)
      .subscribe({
        next: (res) => {
          this.consultaCriada = res;  // Armazena a resposta da API
          console.log('Consulta criada com sucesso:', res);
        },
        error: (err) => console.error('Erro ao criar consulta:', err)
      });
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