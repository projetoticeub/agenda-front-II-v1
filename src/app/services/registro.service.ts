import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroment';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private apiUrl = `${environment.apiUrl}/auth/registrar`; // URL do seu endpoint de registro

  constructor(private http: HttpClient) {}

  // Função para recuperar o token e configurar os headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('Token de autenticação não encontrado');
      throw new Error('Token de autenticação não encontrado');
    }

    // Decodifica o token para verificar o tempo de expiração
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const expTime = decodedToken.exp * 1000; // exp é em segundos, convertendo para milissegundos
    if (Date.now() > expTime) {
      console.error('Token expirado');
      throw new Error('Token expirado');
    }

    // Retorna os headers com o token de autenticação
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Método de registro (apenas para exemplificar, pode não precisar de headers autenticados)
  register(usuario: any): Observable<any> {
    const headers = this.getAuthHeaders(); // Pegue os headers autenticados
    return this.http.post<any>(`${this.apiUrl}`, usuario, { headers });
  }

  // Exemplo de requisição autenticada
  getProtectedData(): Observable<any> {
    const headers = this.getAuthHeaders(); // Recupera os headers autenticados
    return this.http.get<any>(`${environment.apiUrl}`, { headers });
  }
}
