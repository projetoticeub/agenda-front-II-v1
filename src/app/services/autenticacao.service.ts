// autenticacao.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../enviroment';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  private endpointToken = environment.authUrl;

  constructor(private http: HttpClient) {}

  async loginAuth(username: string, password: string): Promise<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    const body = { login: username, senha: password };
  
    try {
      const response = await firstValueFrom(this.http.post<any>(this.endpointToken, body, { headers }));
      const token = response.tokenJWT;  // Atualize aqui para corresponder ao nome correto da propriedade
  
      console.log('Resposta do login:', response);
      console.log('Token recebido:', token);
  
      // Armazena o token no localStorage
      if (token) {
        localStorage.setItem('accessToken', token);
        console.log('Token armazenado no localStorage:', token);
      }
  
      return token;  // Retorna o token para possíveis usos adicionais
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }
}