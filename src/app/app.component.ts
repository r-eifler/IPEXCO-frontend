import { Component, inject, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { Store } from "@ngrx/store";
import { checkLoggedIn } from "./user/state/user.actions";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "IPEXCO";
  editorOptions = { theme: "vs-dark", language: "javascript" };

  store = inject(Store)

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      "questionmark",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../assets/questionmark.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "no_map",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/no_map.svg")
    );
  }

  ngOnInit(): void {
    // this.store.dispatch(checkLoggedIn())
  }
}
