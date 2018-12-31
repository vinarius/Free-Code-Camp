import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LightBrightComponent } from './light-bright/light-bright.component';
import { LightComponent } from './light-bright/light/light.component';
import { UserStoriesComponent } from './user-stories/user-stories.component';

@NgModule({
  declarations: [
    AppComponent,
    LightBrightComponent,
    LightComponent,
    UserStoriesComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
