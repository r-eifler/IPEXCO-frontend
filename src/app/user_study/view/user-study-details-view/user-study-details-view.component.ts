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

@Component({
  selector: 'app-user-study-details-view',
  standalone: true,
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
    DatePipe,
    CurrencyPipe,
    MatCheckboxModule
  ],
  templateUrl: './user-study-details-view.component.html',
  styleUrl: './user-study-details-view.component.scss'
})
export class UserStudyDetailsViewComponent {

  readonly userStudyStepType = UserStudyStepType;

  store = inject(Store);
  router = inject(Router);
  dialog = inject(MatDialog);

  userStudy$ = this.store.select(selectUserStudy);
  participants$ = this.store.select(selectUserStudyParticipantsOfStudy);

  participantsTableData$ = this.participants$.pipe(
    filter(ps => !!ps),
    map(ps =>
      ps.map(p => ({
        ...p,
        date: p.createdAt,
        processingTime: new Date(p.updatedAt.getTime() - p.createdAt.getTime())
      })
      )
    ));

  displayedColumns: string[] = ['user', 'date', 'processingTime', 'finished', 'payment', 'accepted'];

  onCopyLink(){
    const host = window.location.protocol + "//" + window.location.host;
    this.userStudy$.pipe(take(1)).subscribe(study => navigator.clipboard.writeText(host + '/suser-study-execution/' + study._id));
  }

  onRun(){
    this.userStudy$.pipe(take(1)).subscribe(study => this.router.navigate(['user-study-execution', study._id]));
  }

  onEdit(id: string){
    this.router.navigate(['user-study', id, 'edit']);
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
