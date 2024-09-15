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

  getProfissionais(query: string = "", pageNumber: number = 0, pageSize: number = 17): Observable<any> {
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('size', pageSize.toString());

    if (query) {
      params = params.set('search', query);
    }

    return this.http.get(`${this.apiUrl}/profissionais-de-saude/active`, { headers: this.getAuthHeaders(), params })
      .pipe(catchError(this.handleError));
  }

  addProfissional(profissionalDeSaude: ProfissionalDeSaude): Observable<ProfissionalDeSaude> {
    return this.http.post<ProfissionalDeSaude>(`${this.apiUrl}/profissionais-de-saude`, profissionalDeSaude, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => throwError(() => new Error('Erro ao adicionar profissional de saúde: ' + error.message)))
    );
  }

  editarProfissional(id: number, profissionalDeSaude: ProfissionalDeSaude): Observable<ProfissionalDeSaude> {
    return this.http.put<ProfissionalDeSaude>(`${this.apiUrl}/profissionais-de-saude/${id}`, profissionalDeSaude, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => throwError(() => new Error('Erro ao editar profissional de saúde: ' + error.message)))
    );
  }

  deleteProfissional(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/profissionais-de-saude/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  buscarEnderecoPorCep(cep: string): Observable<any> {
    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`);
  }

  getConsultasPorNome(nomeCompleto: string, page: number, size: number): Observable<any> {
    const url = `${this.apiUrl}/profissionais-de-saude?nomeCompleto=${nomeCompleto}`;
    return this.http.get<any>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => throwError(() => new Error('Erro ao buscar consultas por nome: ' + error.message)))
    );
  }

  getConsultasPorCpf(cpf: string, page: number, size: number): Observable<any> {
    const url = `${this.apiUrl}/profissionais-de-saude?cpf=${cpf}`;
    return this.http.get<any>(url, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => throwError(() => new Error('Erro ao buscar consultas por CPF: ' + error.message)))
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
}
