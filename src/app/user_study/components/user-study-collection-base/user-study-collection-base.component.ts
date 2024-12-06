import { Component, OnDestroy, OnInit } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MetaStudyCollectionComponent } from "../../meta-study/meta-study-collection/meta-study-collection.component";
import { UserStudyCollectionComponent } from "../../view/user-study-collection/user-study-collection.component";
import { MatTabsModule } from "@angular/material/tabs";

@Component({
  selector: "app-user-study-collection-base",
  standalone: true,
  imports: [
    MetaStudyCollectionComponent,
    UserStudyCollectionComponent,
    MatTabsModule,
  ],
  templateUrl: "./user-study-collection-base.component.html",
  styleUrls: ["./user-study-collection-base.component.css"],
})
export class UserStudyCollectionBaseComponent implements OnInit {
  isMobile: boolean;

  public showTab = 1;

  constructor(
  ) {}

  ngOnInit(): void {

  }

}
