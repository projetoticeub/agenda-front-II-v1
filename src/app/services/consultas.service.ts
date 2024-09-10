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
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (query) {
      params = params.set('query', query);
    }

    if (date) {
      params = params.set('date', date);  // A data deve ser enviada como parâmetro
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<any>(`${this.apiUrl}`, { params, headers }).pipe(
        catchError(error => {
          console.error('Erro ao buscar consultas:', error);
          return throwError(() => new Error('Erro ao buscar consultas: ' + error.message));
        })
      );
    } else {
      console.error('Token não encontrado');
      return new Observable(observer => {
        observer.error('Token de autenticação não encontrado');
      });
    }
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
