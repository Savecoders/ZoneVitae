import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  private uploadUrl: string;
  private cloudName: string;
  private uploadPreset: string = 'ml_default'; // Set your upload preset here

  constructor(private http: HttpClient) {
    this.cloudName = environment.cloudinary.cloud_name;

    // Initialize the Cloudinary SDK
    this.cloudinary = new Cloudinary({
      cloud: {
        cloudName: this.cloudName,
      },
    });

    // Use direct URL for Cloudinary uploads
    this.uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
  }

  // Upload an image and return URL or public id
  uploadImage(file: File): Observable<string> {
    return new Observable<string>((observer) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'upload_preset',
        environment.cloudinary.upload_preset || this.uploadPreset
      );
      formData.append('cloud_name', this.cloudName);

      fetch(this.uploadUrl, {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data: CloudinaryResponse) => {
          observer.next(data.secure_url);
          observer.complete();
        })
        .catch((err) => {
          console.error('Upload error:', err);
          observer.error(err);
        });
    });
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
    } else if (error.name === 'HttpErrorResponse' && error.status === 0) {
      errorMessage =
        'Error de conexión con Cloudinary. Compruebe su conexión a Internet o si hay problemas de CORS.';
    }

    console.error(errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
