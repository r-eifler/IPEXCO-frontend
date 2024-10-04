import { Component } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { gsap } from "gsap";
import { ResponsiveService } from "src/app/service/responsive/responsive.service";
import { RegisterComponent } from "../register/register.component";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.scss"],
})
export class MainPageComponent {

  isMobile: boolean;

  constructor(
    private responsiveService: ResponsiveService,
    public dialog: MatDialog
  ) {
    this.responsiveService
      .getMobileStatus()
      .pipe(takeUntilDestroyed())
      .subscribe((isMobile) => {
        this.isMobile = isMobile;
      });
    this.responsiveService.checkWidth();
  }

  animateLogo() {
    const tl = gsap.timeline();
    tl.from("#wts-logo", { duration: 0.5, x: 300, ease: "power4. out" });
    tl.from("#gts-logo", { duration: 0.5, x: 300, ease: "power4. out" });
    tl.from("#ots-logo", { duration: 0.5, x: 300, ease: "power4. out" });
    tl.from(["#xai-logo", "#explore-logo"], {
      duration: 1,
      x: -500,
      ease: "power4. out",
    });
  }

  newRegisterForm(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "500px";

    this.dialog.open(RegisterComponent, dialogConfig);
  }
}
