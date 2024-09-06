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

  // Método para criar uma nova consulta
  createConsulta(consulta: Consulta): Observable<Consulta> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`  // Token JWT do localStorage
    });

    return this.http.post<Consulta>(this.apiUrl, consulta, { headers })
      .pipe(
        catchError(error => {
          console.error('Erro ao criar consulta:', error);
          return throwError(() => new Error('Erro ao criar consulta: ' + error.message));
        })
      );
  }

  // Método para obter consultas com busca e paginação
  getConsultas(query: string = "", pageNumber: number = 0, pageSize: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    if (query) {
      params = params.set('search', query);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`  // Token JWT do localStorage
    });

    return this.http.get(`${this.apiUrl}`, { headers, params })
      .pipe(
        catchError(error => {
          console.error('Erro ao carregar consultas:', error);
          return throwError(() => new Error('Erro ao carregar consultas: ' + error.message));
        })
      );
  }

  // Método para deletar uma consulta por ID
  deleteConsulta(id: number): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`  // Token JWT do localStorage
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
