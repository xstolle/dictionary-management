import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { DictionaryService } from './dictionary-service/dictionary.service';

import { CustomMaterialModule } from './material-design/custom-material.module';
import { DomainRangeComponent } from './domain-range/domain-range.component';

@NgModule({
  declarations: [
    AppComponent,
    DomainRangeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    CustomMaterialModule
  ],
  providers: [DictionaryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
