import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import {
  CloudinaryDeleteResponse,
  CloudinaryResponse,
} from 'app/models/cloudinary.model';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private cloudinary: Cloudinary;

  constructor(private http: HttpClient) {
    // Initialize the Cloudinary SDK
    this.cloudinary = new Cloudinary({
      cloud: {
        cloudName: environment.cloudinary.cloud_name,
      },
    });
  }

  // Upload an image and return URL or public ID
  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'zone_vitae');

    return this.http
      .post<CloudinaryResponse>(
        `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloud_name}/image/upload`,
        formData
      )
      .pipe(
        map((response) => response.secure_url),
        catchError(this.handleError)
      );
  }

  // Get a transformed image URL
  getImageUrl(publicId: string, width?: number, height?: number): string {
    let image = this.cloudinary.image(publicId);

    if (width || height) {
      image.resize(
        fill()
          .width(width || 0)
          .height(height || 0)
      );
    }

    return image.toURL();
  }

  deleteImage(publicId: string): Observable<CloudinaryDeleteResponse> {
    return this.http
      .delete<CloudinaryDeleteResponse>(
        `${environment.apiUrl}api/cloudinary/images/${publicId}`
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Error desconocido al subir a Cloudinary';

    if (error.error && error.error.message) {
      errorMessage = `Error de Cloudinary: ${error.error.message}`;
    } else if (error.status) {
      errorMessage = `Error HTTP ${error.status}: ${error.statusText}`;
    }

    console.error(errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
