import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export abstract class BaseService<T> {
  protected baseUrl: string = environment.jsonServerUrl;

  constructor(protected http: HttpClient, protected endpoint: string) {
    this.baseUrl = `${environment.jsonServerUrl}/${this.endpoint}`;
  }

  getAll(params?: any): Observable<T[]> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<T[]>(this.baseUrl, {
      params: httpParams,
    });
  }

  getById(id: number | string): Observable<T> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<T>(url);
  }

  create(item: T): Observable<T> {
    return this.http.post<T>(this.baseUrl, item);
  }

  update(id: number | string, item: Partial<T>): Observable<T> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<T>(url, item);
  }

  delete(id: number | string): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  // Filter items by property
  searchItems(property: string, value: string): Observable<T[]> {
    return this.getAll().pipe(
      map((items) =>
        items.filter(
          (item: any) =>
            item[property] &&
            item[property]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
        )
      )
    );
  }

  filterItems(criteria: { [key: string]: any }): Observable<T[]> {
    return this.getAll().pipe(
      map((items) =>
        items.filter((item: any) =>
          Object.keys(criteria).every((key) =>
            criteria[key]
              ? item[key] &&
                item[key]
                  .toString()
                  .toLowerCase()
                  .includes(criteria[key].toLowerCase())
              : true
          )
        )
      )
    );
  }
}
