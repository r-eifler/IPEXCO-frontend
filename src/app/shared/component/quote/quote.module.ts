import { NgModule } from '@angular/core';

import { QuoteComponent } from './quote/quote.component';



@NgModule({
  imports: [ QuoteComponent ],
  exports: [ QuoteComponent ],
})
export class QuoteModule { }
