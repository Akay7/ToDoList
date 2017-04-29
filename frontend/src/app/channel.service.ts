import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { WebSocketService } from './web-socket.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { environment } from '../environments/environment';

// CHANNEL_URL is link to django channel routing path
const CHANNEL_URL = environment.ws_url + '/api/ws/';

export interface Message {
  stream: string;
  payload: object;
}

@Injectable()
export class ChannelService {
  private messages: Subject<Message>  = new Subject<Message>();

  constructor(private wsService: WebSocketService) { }

  connect(params: string = '') {
    let url = `${CHANNEL_URL}`;

    if (params) {
      url = `${url}?${params}`;
    }

    this.messages = <Subject<Message>>this.wsService
      .connect(url)
      .map((response: MessageEvent): Message => {
        let data = JSON.parse(response.data);
        return {
          stream: data.stream,
          payload: data.payload
        };
      });
    return this.messages.asObservable();
  }
}
