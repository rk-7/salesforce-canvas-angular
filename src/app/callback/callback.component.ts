import { isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, Optional, PLATFORM_ID } from '@angular/core';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { Response } from 'express';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  constructor(
    @Inject(PLATFORM_ID)
    private readonly platformId: any,
    @Optional()
    @Inject(RESPONSE)
    private readonly res: Response) {
    if (isPlatformServer(this.platformId)) {
      res.status(404);
    }
   }

  ngOnInit(): void {
    console.log('request in angular', this.res);
  }

}
