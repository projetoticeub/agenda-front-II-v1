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

  // Recupera o token e configura os headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('Token de autenticação não encontrado');
      throw new Error('Token de autenticação não encontrado');
    }

    // Verifica se o token está expirado
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const expTime = decodedToken.exp * 1000; 
    if (Date.now() > expTime) {
      console.error('Token expirado');
      throw new Error('Token expirado');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Adiciona um novo paciente
  addPaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.apiUrl}/pacientes`, paciente, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erro ao adicionar paciente:', error);
        return throwError(() => new Error('Erro ao adicionar paciente: ' + error.message));
      })
    );
  }

  // Recupera a lista de pacientes, com paginação e busca opcional
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
          return throwError(() => new Error('Erro ao carregar pacientes: ' + error.message));
        })
      );
  }

  // Deleta um paciente pelo ID
  deletePaciente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/pacientes/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erro ao deletar paciente:', error);
        return throwError(() => new Error('Erro ao deletar paciente: ' + error.message));
      })
    );
  }

  // Busca um paciente pelo CPF
  getPacienteByCPF(cpf: string): Observable<Paciente> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams().set('cpf', cpf); // Passa o CPF como parâmetro de query
  
    return this.http.get<Paciente>(`${this.apiUrl}/pacientes/cpf`, { headers, params }) // Verifique se o endpoint correto é '/pacientes/cpf'
      .pipe(
        catchError(error => {
          console.error('Erro ao buscar paciente pelo CPF:', error);
          return throwError(() => new Error('Erro ao buscar paciente pelo CPF: ' + error.message));
        })
      );
  }
}
