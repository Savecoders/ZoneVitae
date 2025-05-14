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

  // Get tag by ID
  getTagById(id: number): Observable<Tag> {
    return this.getById(id);
  }

  // Create a new tag
  createTag(tag: Tag): Observable<Tag> {
    return this.create(tag);
  }

  // Update tag
  updateTag(id: number, tag: Partial<Tag>): Observable<Tag> {
    return this.update(id, tag);
  }

  // Delete tag
  deleteTag(id: number): Observable<void> {
    return this.delete(id);
  }
}
