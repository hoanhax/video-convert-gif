import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { CommonModule } from '@angular/common';
import { GifviewComponent } from './gifview/gifview.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UploadComponent, CommonModule, RouterOutlet, GifviewComponent],
  // template: '<app-upload />',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild('gifview') gifview!: GifviewComponent;
  title = 'frontend';

  refreshGifs() {
    this.gifview.ngOnInit();
  }
}
