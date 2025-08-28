import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  scrollToFirstInvalidControl(el: ElementRef) {
    const firstInvalidInputControl: HTMLElement = el.nativeElement.querySelector('.invalid');
    if (firstInvalidInputControl) {
      window.scroll({
        top: this.getTopOffset(firstInvalidInputControl),
        left: 0,
        behavior: 'smooth',
      });
    }
  }

  private getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = 140;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }

  fileUpload(file: File) {
    const fd = new FormData();
    fd.append('image', file, file.name)
    return fd;
  }
}
