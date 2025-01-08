import { Component } from "@angular/core";
import { UserManualComponent } from "src/app/iterative_planning/components/user-manual/user-manual.component";
import { PageModule } from "src/app/shared/components/page/page.module";

@Component({
    selector: "app-help-page",
    imports: [
        PageModule,
        UserManualComponent
    ],
    templateUrl: "./help-page.component.html",
    styleUrls: ["./help-page.component.css"]
})
export class HelpPageComponent {
  constructor() {}
}
