import { NgModule } from '@angular/core';

import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { DialogFooterComponent } from './dialog-footer/dialog-footer.component';
import { DialogHeaderComponent } from './dialog-header/dialog-header.component';
import { DialogTitleComponent } from './dialog-title/dialog-title.component';
import { DialogComponent } from './dialog/dialog.component';



@NgModule({
  imports: [DialogComponent, DialogHeaderComponent, DialogTitleComponent, DialogContentComponent, DialogFooterComponent],
  exports: [DialogComponent, DialogHeaderComponent, DialogTitleComponent, DialogContentComponent, DialogFooterComponent],
})
export class DialogModule { }
