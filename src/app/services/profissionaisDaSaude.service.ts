import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../enviroment';

@Injectable({
  providedIn: 'root'
})
export class ProfissionaisDaSaudeService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

 
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

  getProfissionais(query: string = "", pageNumber: number = 0, pageSize: number = 17): Observable<any> {
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    if (query) {
      params = params.set('search', query);
    }

    return this.http.get(`${this.apiUrl}/profissionais-de-saude/active`, { headers: this.getAuthHeaders(), params })
      .pipe(
        catchError(this.handleError)
      );
  }

  addProfissional(profissional: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/profissionais-de-saude`, profissional, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteProfissionais(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/profissionais-de-saude/${id}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Erro na operação:', error);
    return throwError(() => new Error('Erro na operação'));
  }
}
