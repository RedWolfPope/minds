import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { Client } from '../../common/services/api/client';
import { Storage } from '../../common/services/storage';


@Component({
  moduleId: 'module.id',
  selector: 'minds-button-thumbs-down',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'thumb()'
  },
  template: `
    <ion-icon name="md-thumbs-down" class="m-ionic-icon" [class.selected]="has()"></ion-icon>
    <span class="m-ionic-icon--counter" *ngIf="entity['thumbs:down:count'] > 0">({{entity['thumbs:down:count']}})</span>
  `,
  //styleUrls: ['buttons.css']
})

export class ThumbsDownComponent {

  entity = {
    'guid': null,
    'owner_guid': null,
    'thumbs:down:user_guids': []
  };

  storage = new Storage();

  constructor(public client : Client) {
  }

  @Input('entity') set _entity(value : any){
    if(!value)
      return;
    this.entity = value;
    if(!this.entity['thumbs:down:user_guids'])
      this.entity['thumbs:down:user_guids'] = [];
  }

  thumb(){
    var self = this;

    this.client.put('api/v1/thumbs/' + this.entity.guid + '/down', {});
    if(!this.has()){
      //this.entity['thumbs:up:user_guids'].push(this.session.getLoggedInUser().guid);
      this.entity['thumbs:down:user_guids'] = [ this.storage.get('user_guid') ];
      this.entity['thumbs:down:count']++;
      if ( this.storage.get('user_guid') != this.entity.owner_guid) {
        //self.wallet.increment();
      }
    } else {
      for(let key in this.entity['thumbs:down:user_guids']){
        if(this.entity['thumbs:down:user_guids'][key] ==  this.storage.get('user_guid'))
          delete this.entity['thumbs:down:user_guids'][key];
      }
      this.entity['thumbs:down:count']--;
      if ( this.storage.get('user_guid')!= this.entity.owner_guid) {
        //self.wallet.decrement();
      }
    }
  }

  has(){
    for(var guid of this.entity['thumbs:down:user_guids']){
      if(guid == this.storage.get('user_guid'))
        return true;
    }
    return false;
  }

}
