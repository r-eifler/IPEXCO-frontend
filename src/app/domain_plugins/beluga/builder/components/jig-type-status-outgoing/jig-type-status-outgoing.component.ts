import { Component, effect, inject, input, output } from "@angular/core";
import { Store } from "@ngrx/store";
import { Jig, JigType, Flight } from "../../../shared/domain/beluga_problem";
import { MatButtonModule } from "@angular/material/button";
import { JigComponent } from "../../../shared/components/jig/jig.component";
import { MatIconModule } from "@angular/material/icon";
import { TranslocoDirective } from "@jsverse/transloco";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: "app-jig-type-status-outgoing",
  imports: [JigComponent, MatButtonModule, MatIconModule, TranslocoDirective, MatTooltipModule],
  templateUrl: "./jig-type-status-outgoing.component.html",
  styleUrl: "./jig-type-status-outgoing.component.scss",
})
export class JigTypeStatusOutgoingComponent {
  store = inject(Store);

  isSkipPossible = input(true);

  index = input<number | null>(null);
  jig = input.required<Jig | null>();
  jigType = input.required<JigType>();
  status = input.required<{
    skip: boolean;
    loaded: boolean;
    next: boolean;
  }>();
  flight = input.required<Flight>();

  skip = output<void>();

  onSkip() {
    this.skip.emit();
  }
}
