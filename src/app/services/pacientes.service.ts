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
      throw new Error('Token de autenticação não encontrado');
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const expTime = decodedToken.exp * 1000;
    if (Date.now() > expTime) {
      throw new Error('Token expirado');
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
      catchError(error => throwError(() => new Error('Erro ao adicionar paciente: ' + error.message)))
    );
  }

  editarPaciente(id: number, paciente: Paciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.apiUrl}/pacientes/${id}`, paciente, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => throwError(() => new Error('Erro ao editar paciente: ' + error.message)))
    );
  }

  buscarEnderecoPorCep(cep: string): Observable<any> {
    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`);
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
        catchError(error => throwError(() => new Error('Erro ao carregar pacientes: ' + error.message)))
      );
  }

  deletePaciente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/pacientes/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => throwError(() => new Error('Erro ao deletar paciente: ' + error.message)))
    );
  }

  getConsultasPorNome(nomeCompleto: string, page: number, size: number): Observable<any> {
    const url = `${this.apiUrl}/pacientes?nomeCompleto=${nomeCompleto}`;
    return this.http.get<any>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => throwError(() => new Error('Erro ao buscar consultas por nome: ' + error.message)))
    );
  }

  getConsultasPorCpf(cpf: string, page: number, size: number): Observable<any> {
    const url = `${this.apiUrl}/pacientes?cpf=${cpf}`;
    return this.http.get<any>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => throwError(() => new Error('Erro ao buscar consultas por CPF: ' + error.message)))
    );
  }
}
