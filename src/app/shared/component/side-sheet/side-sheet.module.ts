import { NgModule } from "@angular/core";

import { SideSheetContentComponent } from "./side-sheet-content/side-sheet-content.component";
import { SideSheetFooterComponent } from "./side-sheet-footer/side-sheet-footer.component";
import { SideSheetHeaderComponent } from "./side-sheet-header/side-sheet-header.component";
import { SideSheetSectionContentComponent } from "./side-sheet-section-content/side-sheet-section-content.component";
import { SideSheetSectionListComponent } from "./side-sheet-section-list/side-sheet-section-list.component";
import { SideSheetSectionTitleComponent } from "./side-sheet-section-title/side-sheet-section-title.component";
import { SideSheetSectionComponent } from "./side-sheet-section/side-sheet-section.component";
import { SideSheetTitleComponent } from "./side-sheet-title/side-sheet-title.component";
import { SideSheetComponent } from "./side-sheet/side-sheet.component";

@NgModule({
  imports: [
    SideSheetComponent,
    SideSheetContentComponent,
    SideSheetFooterComponent,
    SideSheetHeaderComponent,
    SideSheetSectionComponent,
    SideSheetSectionContentComponent,
    SideSheetSectionListComponent,
    SideSheetSectionTitleComponent,
    SideSheetTitleComponent,
  ],
  exports: [
    SideSheetComponent,
    SideSheetContentComponent,
    SideSheetFooterComponent,
    SideSheetHeaderComponent,
    SideSheetSectionComponent,
    SideSheetSectionContentComponent,
    SideSheetSectionListComponent,
    SideSheetSectionTitleComponent,
    SideSheetTitleComponent,
  ],
})
export class SideSheetModule { }
