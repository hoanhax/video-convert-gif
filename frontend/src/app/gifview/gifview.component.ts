import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Import CommonModule

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-gifview',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './gifview.component.html',
  styleUrl: './gifview.component.css'
})
export class GifviewComponent {
  // Call api to get all gifs
  gifs: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<string[]>(`${environment.apiUrl}/api/gifs`).subscribe(gifs => this.gifs = gifs);
  }

  getGifUrl(filename: string) {
    return `${environment.apiUrl}/api/gifs/${filename}`;
  }
}
