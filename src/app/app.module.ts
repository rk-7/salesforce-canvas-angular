import { NgModule } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CallbackComponent } from './callback/callback.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DisplayDataComponent } from './display-data/display-data.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ValueOrTypePipe } from './pipes/value-or-type.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CallbackComponent,
    DisplayDataComponent,
    ValueOrTypePipe,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
