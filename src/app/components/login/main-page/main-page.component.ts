import { takeUntil } from "rxjs/operators";
import { AuthenticationService } from "../../../service/authentication/authentication.service";
import { AfterViewChecked, Component, OnDestroy, OnInit } from "@angular/core";
import { ResponsiveService } from "src/app/service/responsive/responsive.service";
import { gsap } from "gsap";
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogConfig as MatDialogConfig,
  MatLegacyDialogRef as MatDialogRef,
} from "@angular/material/legacy-dialog";
import { RegisterComponent } from "../register/register.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.scss"],
})
export class MainPageComponent implements OnInit, AfterViewChecked, OnDestroy {
  private ngUnsubscribe: Subject<any> = new Subject();

  isMobile: boolean;

  constructor(
    private responsiveService: ResponsiveService,
    private userService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    this.responsiveService
      .getMobileStatus()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isMobile) => {
        this.isMobile = isMobile;
      });
    this.responsiveService.checkWidth();

    // if (this.userService.loggedIn()) {
    //   await this.router.navigate(['/overview'], { relativeTo: this.route });
    // }
  }

  ngAfterViewChecked(): void {
    // this.animateLogo();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
