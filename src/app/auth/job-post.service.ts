import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JobPostService {
  private formDataKey = 'jobFormData';

  constructor() { }

  saveFormData(formData: any): void {
    localStorage.setItem(this.formDataKey, JSON.stringify(formData));
  }

  loadFormData(): any {
    const formData = localStorage.getItem(this.formDataKey);
    return formData ? JSON.parse(formData) : null;
  }

  clearFormData(): void {
    localStorage.removeItem(this.formDataKey);
  }
}
