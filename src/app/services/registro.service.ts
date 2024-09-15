import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../enviroment';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private apiUrl = `${environment.apiUrl}/auth/registrar`;

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

  register(usuario: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}`, usuario, { headers });
  }

  getProtectedData(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${environment.apiUrl}`, { headers });
  }
}
