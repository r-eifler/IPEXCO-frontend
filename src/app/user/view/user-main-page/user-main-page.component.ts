import { Component } from "@angular/core";
import { PageModule } from "src/app/shared/components/page/page.module";
import { BreadcrumbModule } from "src/app/shared/components/breadcrumb/breadcrumb.module";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "app-user-main-page",
    imports: [
        PageModule,
        BreadcrumbModule,
        MatIconModule
    ],
    templateUrl: "./user-main-page.component.html",
    styleUrls: ["./user-main-page.component.scss"]
})
export class UserMainPageComponent {

}
