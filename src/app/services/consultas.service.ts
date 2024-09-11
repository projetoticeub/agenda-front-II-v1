import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../enviroment';

export interface Consulta {
  idPaciente: number;
  idProfissionalDeSaude: number;
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  private apiUrl = `${environment.apiUrl}/consultas`;

  constructor(private http: HttpClient) { }

  createConsulta(consulta: Consulta): Observable<Consulta> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`  
    });

    return this.http.post<Consulta>(this.apiUrl, consulta, { headers })
      .pipe(
        catchError(error => {
          console.error('Erro ao criar consulta:', error);
          return throwError(() => new Error('Erro ao criar consulta: ' + error.message));
        })
      );
  }

  getConsultas(query: string, page: number, size: number, date?: string): Observable<any> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('Token não encontrado');
      return throwError(() => new Error('Token de autenticação não encontrado'));
    }

    let url = `${this.apiUrl}?page=${page}&size=${size}`;
    
    // Se houver uma data, anexa no caminho da URL como solicitado
    if (date) {
      url = `${this.apiUrl}/data/${date}?page=${page}&size=${size}`;
    }

    if (query) {
      url += `&query=${query}`;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(url, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao buscar consultas:', error);
        return throwError(() => new Error('Erro ao buscar consultas: ' + error.message));
      })
    );
  }

  deleteConsulta(id: number): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`  
    });

    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Erro ao deletar consulta:', error);
          return throwError(() => new Error('Erro ao deletar consulta: ' + error.message));
        })
      );
  }
}
