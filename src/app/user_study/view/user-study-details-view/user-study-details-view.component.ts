import {Component, inject, input} from '@angular/core';
import {AsyncPipe, CurrencyPipe, DatePipe} from '@angular/common';
import {BreadcrumbComponent} from '../../../shared/components/breadcrumb/breadcrumb/breadcrumb.component';
import {BreadcrumbItemComponent} from '../../../shared/components/breadcrumb/breadcrumb-item/breadcrumb-item.component';
import {MatIcon} from '@angular/material/icon';
import {MatButtonModule, MatIconButton} from '@angular/material/button';
import {UserStudyHeroComponent} from '../../components/user-study-hero/user-study-hero.component';
import {Router, RouterLink} from '@angular/router';
import { UserStudyStepType} from '../../domain/user-study';
import {Store} from '@ngrx/store';
import {deleteUserStudy} from '../../state/user-study.actions';
import {AskDeleteComponent} from '../../../shared/components/ask-delete/ask-delete.component';
import {MatDialog} from '@angular/material/dialog';
import {selectUserStudy, selectUserStudyParticipantsOfStudy} from '../../state/user-study.selector';
import {MatTooltip} from '@angular/material/tooltip';
import {PageModule} from '../../../shared/components/page/page.module';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {filter, map, take} from 'rxjs/operators';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AcceptedTestPersonsComponent } from '../../eval/accepted-test-persons/accepted-test-persons.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-user-study-details-view',
    imports: [
        BreadcrumbComponent,
        BreadcrumbItemComponent,
        MatIcon,
        MatIconButton,
        PageModule,
        MatListModule,
        UserStudyHeroComponent,
        RouterLink,
        MatButtonModule,
        AsyncPipe,
        MatTooltip,
        MatExpansionModule,
        MatTableModule,
        MatCheckboxModule,
        AcceptedTestPersonsComponent,
        MatMenuModule
    ],
    templateUrl: './user-study-details-view.component.html',
    styleUrl: './user-study-details-view.component.scss'
})
export class UserStudyDetailsViewComponent {

  readonly userStudyStepType = UserStudyStepType;

  store = inject(Store);
  router = inject(Router);
  dialog = inject(MatDialog);
  snackbar = inject(MatSnackBar);

  userStudy$ = this.store.select(selectUserStudy);
  participants$ = this.store.select(selectUserStudyParticipantsOfStudy);

  onCopyLink(){
    const host = window.location.protocol + "//" + window.location.host;
    this.userStudy$.pipe(take(1)).subscribe(study => navigator.clipboard.writeText(host + '/suser-study-execution/' + study._id));
    let snackBarRef = this.snackbar.open('User study link copied to clipboard.', 'close');
  }


  onDelete(id: string) {
    const dialogRef = this.dialog.open(AskDeleteComponent, {
      data: {name: 'Delete User Study', text: 'Are you sure you want to delete the user study?'},
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.store.dispatch((deleteUserStudy({id})));
        this.router.navigate(['user-study', 'collection']);
      }
    });
  }

}
