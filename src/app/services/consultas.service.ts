import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`  // Assumindo que o token JWT está armazenado no localStorage
    });

    return this.http.post<Consulta>(this.apiUrl, consulta, { headers })
      .pipe(
        catchError(error => {
          console.error('Erro ao criar consulta:', error);
          return throwError(() => new Error('Erro ao criar consulta'));
        })
      );
  }
}
