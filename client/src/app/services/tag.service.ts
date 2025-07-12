import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, of } from 'rxjs';
import { BaseService } from './base.service';
import { Tag } from '../models/tag.model';

@Injectable({
  providedIn: 'root',
})
export class TagService extends BaseService<Tag> {
  constructor(http: HttpClient) {
    super(http, 'tags');
  }

  // Get all tags
  getTags(): Observable<Tag[]> {
    return this.getAll();
  }

  
}
