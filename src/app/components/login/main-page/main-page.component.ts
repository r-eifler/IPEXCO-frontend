import { Component } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { gsap } from "gsap";
import { RegisterComponent } from "../register/register.component";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-main-page",
  standalone: true,
  imports: [
    MatButtonModule,
  ],
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.scss"],
})
export class MainPageComponent {

  isMobile: boolean;

  constructor(
    public dialog: MatDialog
  ) {
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
