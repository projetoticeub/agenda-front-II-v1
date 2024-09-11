import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Paciente } from './../pacientes';
import { environment } from '../enviroment';

@Injectable({
  providedIn: 'root'
})
export class PacientesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken'); 
    if (!token) {
      console.error('Token de autenticação não encontrado');
      throw new Error('Token de autenticação não encontrado');
    }
  
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  addPaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.apiUrl}/pacientes`, paciente, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erro ao adicionar paciente:', error);
        return throwError(() => new Error('Erro ao adicionar paciente'));
      })
    );
  }

  getPacientes(query: string = "", pageNumber: number = 0, pageSize: number = 17): Observable<any> {
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    if (query) {
      params = params.set('search', query);
    }
    return this.http.get(`${this.apiUrl}/pacientes/active`, { headers: this.getAuthHeaders(), params })
      .pipe(
        catchError(error => {
          console.error('Erro ao carregar pacientes:', error);
          return throwError(() => new Error('Erro ao carregar pacientes'));
        })
      );
  }
  deletePaciente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/pacientes/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erro ao deletar paciente:', error);
        console.log('Corpo da resposta:', error.error); 
        return throwError(() => new Error('Erro ao deletar paciente'));
      })
    );
  }
  getPacienteByCPF(cpf: string): Observable<Paciente> {
    const headers = this.getAuthHeaders(); // Mantém os headers para autorização
    const params = new HttpParams().set('cpf', cpf); // Define o parâmetro 'cpf'
  
    // Faz a requisição para a URL correta com o parâmetro de consulta
    return this.http.get<Paciente>(`${this.apiUrl}/pacientes`, { headers, params })
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar paciente pelo CPF:', error);
          return throwError(() => new Error('Erro ao buscar paciente pelo CPF: ' + error.message));
        })
      );
  }
}


