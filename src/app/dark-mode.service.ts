import { Injectable } from '@angular/core';
import { ɵDomRendererFactory2 } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  isDarkMode: boolean = false;

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.updateDarkMode(this.isDarkMode);
  }

  private updateDarkMode(isDarkMode: boolean) {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
