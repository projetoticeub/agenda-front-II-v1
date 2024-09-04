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
        console.log('Corpo da resposta:', error.error); // Adicione isto para verificar o corpo da resposta
        return throwError(() => new Error('Erro ao deletar paciente'));
      })
    );
  }
}

