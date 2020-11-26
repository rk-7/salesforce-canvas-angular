import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(@Inject(PLATFORM_ID) private readonly platform: any) { }
  
}
