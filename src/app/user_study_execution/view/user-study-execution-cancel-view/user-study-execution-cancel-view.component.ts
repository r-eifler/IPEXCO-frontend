import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { PageModule } from 'src/app/shared/components/page/page.module';

@Component({
    selector: 'app-user-study-execution-cancel-view',
    standalone: true,
    imports: [
        PageModule,
        TranslocoModule
    ],
    templateUrl: './user-study-execution-cancel-view.component.html',
    styleUrl: './user-study-execution-cancel-view.component.scss'
})
export class UserStudyExecutionCancelViewComponent {

}
