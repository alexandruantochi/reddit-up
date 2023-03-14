import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContentRetrieverService } from './services/content-retriever.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { GalleryModule } from 'ng-gallery';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { UserPageComponent } from './components/user-page/user-page.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchComponentComponent } from './components/search-component/search-component.component';

import { UrlSerializer } from '@angular/router';
import { LowerCaseUrlSerializer } from './providers/LowerCaseUrlSerializer';


@NgModule({
  declarations: [
    AppComponent,
    UserPageComponent,
    SpinnerComponent,
    SearchComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatGridListModule,
    GalleryModule,
    MatSnackBarModule
  ],
  providers: [ContentRetrieverService,
    {
      provide: UrlSerializer,
      useClass: LowerCaseUrlSerializer
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
