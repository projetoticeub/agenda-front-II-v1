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
      const token = response.tokenJWT;

      if (token) {
        localStorage.setItem('accessToken', token);
      }

      return token;
    } catch (error) {
      throw error;
    }
  }
}
