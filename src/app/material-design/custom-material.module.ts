import { NgModule } from '@angular/core';
import { MdCardModule, MdListModule, MdButtonModule, MdCheckboxModule, MdInputModule } from '@angular/material';

@NgModule({
  imports: [
    MdCardModule,
    MdListModule,
    MdButtonModule,
    MdCheckboxModule,
    MdInputModule
  ],
  exports: [
    MdCardModule,
    MdListModule,
    MdButtonModule,
    MdCheckboxModule,
    MdInputModule
  ],
})
export class CustomMaterialModule { }
