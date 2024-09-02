import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
      'Authorization': `Bearer ${token}`
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

  // Método para tratar erros da requisição
  private handleError(error: any): Observable<never> {
    console.error('Erro ao carregar profissionais da saúde:', error);
    return throwError(() => new Error('Erro ao carregar profissionais da saúde'));
  }
}
