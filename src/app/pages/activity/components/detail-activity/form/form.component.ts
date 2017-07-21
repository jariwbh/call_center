import { BaThemeSpinner } from './../../../../../theme/services/baThemeSpinner/baThemeSpinner.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ActivityService } from '../../../../../core/services/activity/activity.service';
import { ActivityModel } from '../../../../../core/models/activity/activity.model';

import { Message } from 'primeng/primeng';
import { AuthService } from '../../../../../core/services/common/auth.service';
import { Configuration } from '../../../../../app.constants';

import { ManagepeopleService } from '../../../../../core/services/people/manage-people.service';

@Component({
  selector: 'nga-form-activity',
  templateUrl: './form.html',
  styleUrls: ['./grid.scss', './detail-activity.css'],
})

export class FormComponent {

_activityDetail = new ActivityModel();
msgs: Message[] = [];
bindId: string;
serverPath: string;

 images: any[] = [];
 imageCount: boolean = false;

 _personLists: any [] = [];
_displayPerson: any [] = [];

constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _activityService: ActivityService,
    private _authService: AuthService,
    private _configuration: Configuration,
     private _spinner: BaThemeSpinner,
     private _managepeopleService: ManagepeopleService,
  ) { 
    _spinner.show();
    this.serverPath = this._configuration.Server;
    
    
    this._activityDetail.name = '';
    this._activityDetail.description = '';
    this._activityDetail.activitytype = '';
    this._activityDetail.url = '';
    this._activityDetail.createdAt = '';
    }

  ngOnInit() {
    //get URLid
    this._route.params.subscribe(
        (param: any) => {
            this.bindId = param['id'];
    });
    if (this.bindId) {
      this.getActivityById(this.bindId);
    }
        
  }
  
  getAllUsersByID(id) {
      this._managepeopleService
        .GetById(id)
        .subscribe( data => {
          if (data) {
              if (data.person) {
                this._personLists.push(data.person.email);
              }
          }
        });
  }

  getActivityById(id: any) {
    this._activityService
      .GetById(id)
      .subscribe(data => {
        if (data) {
          this._activityDetail.name = data.name;
          this._activityDetail.images = data.images;
          this._activityDetail.activitytype = data.activitytype;
          this._activityDetail.url = data.url;
          this._activityDetail.description = data.description;
          if (data.persons) {
            data.persons.forEach(element => {
              this.getAllUsersByID(element);
            });
          }
          let startDateTime = new Date(data.createdAt); 
          let startStamp = startDateTime.getTime();
          this._activityDetail.createdAt = this.updateClock(startStamp);

          data.images.forEach(element => {
            this.images.push({
              source: element.imagevalue,
            });
          });

          
          if (this._activityDetail.images.length > 1) {
            this.imageCount = true;
          } else {
            this.imageCount = false;
          }
          
        }
        this._spinner.hide();
      });
  }

    updateClock(startStamp) {
    let newDate = new Date();
    let newStamp = newDate.getTime();
    let diff = Math.round((newStamp-startStamp)/1000);
    
    let d = Math.floor(diff/(24*60*60)); /* though I hope she won't be working for consecutive days :) */
    diff = diff-(d*24*60*60);
    let h = Math.floor(diff/(60*60));
    diff = diff-(h*60*60);
    let m = Math.floor(diff/(60));
    diff = diff-(m*60);
    let s = diff;
    
    return  d + " day(s), " + h + " hour(s), " + m + " minute(s), " + s + " second(s) ago";
}

}

