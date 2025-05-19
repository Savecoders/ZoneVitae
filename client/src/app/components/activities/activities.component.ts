import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../shared/layout/layout.component';
import { CloudinaryService } from 'app/services/cloudinary.service';

@Component({
  selector: 'app-activities',
  imports: [LayoutComponent],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css',
})
export class ActivitiesComponent implements OnInit {
  // The public id of the image in Cloudinary
  imagePublicId: string = 'oc3g6ommnvuksvxzn912';
  imageUrl: string = '';
  constructor(private cloudinaryService: CloudinaryService) {}

  ngOnInit(): void {
    // load the image from Cloudinary
    this.imageUrl = this.cloudinaryService.getImageUrl(this.imagePublicId);
    console.log('Image URL:', this.imageUrl);
  }
}
