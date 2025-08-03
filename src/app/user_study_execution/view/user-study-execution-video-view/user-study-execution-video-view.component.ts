import {Component, computed, effect, inject, OnInit} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {PageTitleComponent} from '../../../shared/components/page/page-title/page-title.component';
import {selectExecutionUserStudyStep} from '../../state/user-study-execution.selector';
import {Store} from '@ngrx/store';
import {PageModule} from '../../../shared/components/page/page.module';
import {MarkedPipe} from '../../../pipes/marked.pipe';
import {AllowUrlPipe} from 'src/app/project/service/allow-url.service';


@Component({
    selector: 'app-user-study-execution-video-view',
    imports: [
        AsyncPipe,
        PageModule,
        PageTitleComponent,
        AllowUrlPipe
    ],
    templateUrl: './user-study-execution-video-view.component.html',
    styleUrl: './user-study-execution-video-view.component.scss'
})
export class UserStudyExecutionVideoViewComponent implements OnInit{

  store = inject(Store);
  step = this.store.selectSignal(selectExecutionUserStudyStep);

  videoId = computed(() => this.step()?.content as string)

  public YT: any;
  public video: any;
  public player: any;
  public reframed: Boolean = false;

  constructor() {

      effect(() => {
        let video = this.videoId();
        if(video === null || video === undefined || video.length === 0){
          return;
        }
  
        console.log("video id: " + video)
  
        window['onYouTubeIframeAPIReady'] = (e) => {
          this.YT = window['YT'];
          this.reframed = false;
          this.player = new window['YT'].Player('player', {
            videoId: video,
            height: '390',
            width: '640',
            // events: {
            //   'onStateChange': this.onPlayerStateChange.bind(this),
            //   'onError': this.onPlayerError.bind(this),
            //   'onReady': (e) => {
            //     if (!this.reframed) {
            //       this.reframed = true;
            //       reframe(e.target.a);
            //     }
            //   }
            // }
          });
        };
      })
    }
  
    initPlayer() {
      let tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      let firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  
  
    ngOnInit() {
      this.initPlayer();
    }
}
