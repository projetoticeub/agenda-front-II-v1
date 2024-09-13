import { ProfissionalDeSaude } from './../ProfissionaisDeSaude';
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

  addProfissional(ProfissionalDeSaude: ProfissionalDeSaude): Observable<ProfissionalDeSaude> {
    return this.http.post<ProfissionalDeSaude>(`${this.apiUrl}/profissionais-de-saude`, ProfissionalDeSaude, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erro ao adicionar profiissional de saude:', error);
        return throwError(() => new Error('Erro ao profiissional de saude: ' + error.message));
      })
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
    if (error.status === 403) {
      console.error('Acesso negado: Verifique suas permissões.');
    } else if (error.status === 401) {
      console.error('Não autorizado: Verifique a validade do token.');
    } else {
      console.error('Erro desconhecido:', error);
    }
    return throwError(() => new Error(`Erro na operação: ${error.message || 'Detalhes indisponíveis'}`));
  }
  getConsultasPorNome(nomeCompleto: string, page: number, size: number): Observable<any> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('Token não encontrado');
      return throwError(() => new Error('Token de autenticação não encontrado'));
    }
    const url = `${this.apiUrl}/profissionais-de-saude?nomeCompleto=${nomeCompleto}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<any>(url, { headers }).pipe(
        catchError(error => {
          console.error('Erro ao buscar consultas por CPF:', error);
          return throwError(() => new Error('Erro ao buscar consultas por CPF: ' + error.message));
        })
      );
 }

  getConsultasPorCpf(cpf: string, page: number, size: number): Observable<any> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('Token não encontrado');
      return throwError(() => new Error('Token de autenticação não encontrado'));
    }

    const url = `${this.apiUrl}/profissionais-de-saude?cpf=${cpf}`;
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(url, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao buscar consultas por CPF:', error);
        return throwError(() => new Error('Erro ao buscar consultas por CPF: ' + error.message));
      })
    );
  }
}
