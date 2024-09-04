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

  // Método para obter os cabeçalhos de autenticação
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      console.error('Token não encontrado no localStorage');
      throw new Error('Token de autenticação não encontrado');
    }

    // Log do token para verificação
    console.log('Token de autenticação usado na requisição:', token);
    
    // Configuração do cabeçalho Authorization com o token JWT
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Método para obter a lista de profissionais da saúde
  getProfissionais(query: string = "", pageNumber: number = 0, pageSize: number = 17): Observable<any> {
    // Configuração dos parâmetros de consulta (query params)
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    if (query) {
      params = params.set('search', query);
    }

    // Requisição GET para o endpoint com headers e parâmetros
    return this.http.get(`${this.apiUrl}/profissionais-de-saude`, { headers: this.getAuthHeaders(), params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para adicionar um profissional da saúde
  addProfissional(profissional: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/profissionais-de-saude`, profissional, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para deletar um profissional da saúde
  deleteProfissional(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/profissionais-de-saude/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para tratar erros da requisição
  private handleError(error: any): Observable<never> {
    console.error('Erro na operação:', error);
    return throwError(() => new Error('Erro na operação'));
  }
}
