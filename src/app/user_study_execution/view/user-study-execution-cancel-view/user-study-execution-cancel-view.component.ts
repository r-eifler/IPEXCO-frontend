import { Component } from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import { PageModule } from 'src/app/shared/components/page/page.module';

@Component({
    selector: 'app-user-study-execution-cancel-view',
    standalone: true,
    imports: [
        PageModule
    ],
    templateUrl: './user-study-execution-cancel-view.component.html',
    styleUrl: './user-study-execution-cancel-view.component.scss'
})
export class UserStudyExecutionCancelViewComponent {

}
