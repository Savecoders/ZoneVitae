import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

interface MeEncanta {
  id?: number;
  usuario_id: number;
  reports_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class MeEncantaService {
  private jsonUrl:string = 'http://localhost:5000/me_encanta';

  constructor(private http: HttpClient) {}

  getAll(): Observable<MeEncanta[]> {
    return this.http.get<MeEncanta[]>(this.jsonUrl);
  }

  getUsuario_Reporte(usuarioId: number, reporteId: number): Observable<MeEncanta[]> {
    const url = `${this.jsonUrl}?usuario_id=${usuarioId}&reports_id=${reporteId}`;
    return this.http.get<MeEncanta[]>(url);
  }

  darMeEncanta(data: MeEncanta): Observable<MeEncanta> {
    return this.http.post<MeEncanta>(this.jsonUrl, data);
  }

  quitarMeEncanta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.jsonUrl}/${id}`);
  }
}
