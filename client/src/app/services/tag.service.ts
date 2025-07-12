import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tag } from '../models/tag.model';
import { environment } from '../../environments/environment.development';
import { ApiResponse } from "../models/api-response.model";
import { Observable, map, switchMap, of, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TagService{
  private apiUrl = `${environment.apiUrl}/Tags`;
  
  constructor(private http: HttpClient) {
  }

  // Get all tags
    getAll(): Observable<Tag[]> {
      return this.http.get<ApiResponse<Tag[]>>(`${this.apiUrl}`).pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(response.message || "Error obteniendo comunidades");
          }
          if (!response.data) {
            throw new Error("No data received from server");
          }
          return response.data;
        }),
        catchError((error) => {
          console.error("Error fetching users:", error);
          return of([]);
        }),
      );
    }
    
   // Get tag by ID
  getById(id: string): Observable<Tag | null> {
    return this.http.get<ApiResponse<Tag>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        if (!response.success) throw new Error(response.message || "Error obteniendo el tag");
        return response.data ?? null;
      }),
      catchError((error) => {
        console.error("Error fetching tag:", error);
        return of(null);
      })
    );
  }

  // Create a new tag
  create(tag: Tag): Observable<Tag | null> {
    return this.http.post<ApiResponse<Tag>>(`${this.apiUrl}`, tag).pipe(
      map((response) => {
        if (!response.success) throw new Error(response.message || "Error creando el tag");
        return response.data ?? null;
      }),
      catchError((error) => {
        console.error("Error creating tag:", error);
        return of(null);
      })
    );
  }

  // Update an existing tag
  update(id: string, tag: Partial<Tag>): Observable<Tag | null> {
    return this.http.put<ApiResponse<Tag>>(`${this.apiUrl}/${id}`, tag).pipe(
      map((response) => {
        if (!response.success) throw new Error(response.message || "Error actualizando el tag");
        return response.data ?? null;
      }),
      catchError((error) => {
        console.error("Error updating tag:", error);
        return of(null);
      })
    );
  }

  // Delete a tag
  delete(id: string): Observable<boolean> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        if (!response.success) throw new Error(response.message || "Error eliminando el tag");
        return true;
      }),
      catchError((error) => {
        console.error("Error deleting tag:", error);
        return of(false);
      })
    );
  }
}
