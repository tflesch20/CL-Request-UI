import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatListModule} from '@angular/material/list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ModalComponent} from './modal/modal.component';
import {WarningModalComponent} from './modal/warning-modal.component';
import {ErrorModalComponent} from './modal/error-modal.component';
import {OperationService} from './operation.service';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    ModalComponent,
    WarningModalComponent,
    ErrorModalComponent
  ],
  imports: [
    BrowserModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatListModule,
    MatCheckboxModule,
    MatProgressBarModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule
  ],
  entryComponents: [ModalComponent, WarningModalComponent, ErrorModalComponent],
  providers: [
    OperationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
