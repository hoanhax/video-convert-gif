import { Component, signal, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const MAX_DURATION = 10;
const MAX_WIDTH = 1024;
const MAX_HEIGHT = 768;

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  videoName = signal('');
  fileSize = signal(0);
  @Output() refreshGifs = new EventEmitter<void>();

  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  @ViewChild('videoElement') videoElement: ElementRef<HTMLVideoElement> | undefined;
  selectedFile: File | null = null;
  uploadSuccess: boolean = false;
  uploadError: boolean = false;
  videoDuration: number = 0;
  videoWidth: number = 0;
  videoHeight: number = 0;
  validationError: string | null = null;

  // Define an array to store upload videos status
  uploadVideosStatus: { name: string, status: boolean }[] = [];

  constructor(private http: HttpClient) {}


  // Handler for file input change
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.type !== 'video/mp4') {
        this.validationError = 'Only MP4 files are supported.';
        return;
      }
      this.selectedFile = file; // Store the selected file
      const videoElement = this.videoElement?.nativeElement;
      if (videoElement) {
        videoElement.src = URL.createObjectURL(file);
      }
      this.validationError = null; // Reset error if file type is valid
    }
  }

  // Handler for file drop
  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0] as File | null;
    this.uploadFile(file);
  }

  // Prevent default dragover behavior
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  // Method to handle file upload
  uploadFile(file: File | null): void {
    if (file && file.type.startsWith('video/')) {
      const formData = new FormData();
      this.fileSize.set(Math.round(file.size / (1024 * 1024))); // Set file size in MB

      formData.append('video', file, file.name);

      const upload$ = this.http.post(`${environment.apiUrl}/api/video`, formData);
      upload$.subscribe({
        next: () => {
          this.uploadVideosStatus.push({ name: file.name, status: true });
          this.uploadSuccess = true;
          this.resetFileInput();
          // set timeout to refresh gifs
          // TODO: find a better way to refresh gifs. Example in real app we can use websocket for realtime updates
          setTimeout(() => {
            this.refreshGifs.emit();
          }, 5000);
        },
        error: (error: any) => {
          this.uploadVideosStatus.push({ name: file.name, status: false });
          this.uploadError = false;
          this.resetFileInput();
        },
      });
      this.videoName.set(file.name); // Set image name
    } else {
      this.uploadSuccess = false;
      this.uploadError = true;
    }
  }

  onMetadataLoaded(videoElement: HTMLVideoElement): void {
    this.videoDuration = Math.floor(videoElement.duration);
    this.videoWidth = videoElement.videoWidth;
    this.videoHeight = videoElement.videoHeight;

    if (this.videoDuration > MAX_DURATION) {
      this.validationError = `Video length must be ${MAX_DURATION} seconds or less.`;
    } else if (this.videoWidth > MAX_WIDTH || this.videoHeight > MAX_HEIGHT) {
      this.validationError = `Video resolution must be ${MAX_WIDTH}x${MAX_HEIGHT} or less.`;
    } else {
      this.validationError = null; // No validation errors
      if (this.selectedFile) {
        this.uploadFile(this.selectedFile); // Upload the file if valid
      }
    }
  }

  resetFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''; // Reset the file input
    }
  }
}
