import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    
    public Server: string;

    constructor() { 
      
      if (location.hostname === 'localhost' || location.hostname === '127.0.0.1' ) {
            this.Server = 'http://localhost:4200/';
      } else if (location.hostname === '52.163.113.185') { 
            this.Server = 'http://52.163.113.185:3000/';
      } else {
            this.Server = 'http://www.almuadin.net/';
      }
    }
}
