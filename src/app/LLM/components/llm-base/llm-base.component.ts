import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Message } from '../../domain/message';
import { selectMessages } from '../../state/llm.selector';
import { sendMessageToLLM } from '../../state/llm.actions';

@Component({
  selector: 'app-llm-base',
  templateUrl: './llm-base.component.html',
  styleUrl: './llm-base.component.scss'
})
export class LlmBaseComponent {


  messages$: Observable<Message[]> 

  constructor(
    private store: Store
  ){
    this.messages$ = store.select(selectMessages)

    this.sendMessage('Hallo');
  }


  sendMessage(m:string){
    this.store.dispatch(sendMessageToLLM({request: m}))
  }

}
