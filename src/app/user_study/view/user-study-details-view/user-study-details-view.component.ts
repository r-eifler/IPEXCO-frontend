import {Component, inject, input} from '@angular/core';
import {AsyncPipe} from '@angular/common';
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
import {selectUserStudy} from '../../state/user-study.selector';
import {MatTooltip} from '@angular/material/tooltip';
import {PageModule} from '../../../shared/components/page/page.module';
import {DemoCardComponent} from '../../components/demo-card/demo-card.component';
import {DescriptionCardComponent} from '../../components/description-card/description-card.component';
import {FormCardComponent} from '../../components/form-card/form-card.component';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';

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
    MatExpansionModule
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

  onRun(){

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
