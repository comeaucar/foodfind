import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InputValidationService {

  constructor() { }

  validatePostalCode(p_code:any) {
    const regex = /^[a-z0-9][a-z0-9\- ]{0,10}[a-z0-9]$/i
    if (regex.test(p_code)) {
      return true
    } 
    return false
  }
}
