import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuditService } from '../../../../core/services/audit/audit.service';
import { AuditModel } from '../../../../core/models/audit/audit.model';

import { AuthService } from '../../../../core/services/common/auth.service';

import { SelectItem } from 'primeng/primeng';

import { Configuration } from '../../../../app.constants';
import { PagerService } from '../../../../core/services/common/pager.service';

@Component({
  selector: 'nga-user-history',
  templateUrl: './user-history.html',
   styleUrls: ['./user-history.scss', './feed.scss'],
  })

export class UserHistoryComponent {
  
  authId: string;
  _auditModel = new AuditModel();
  _auditLists: any [] = [];
  _allAuditLists: any [] = [];

  _selectedAdmin: any [] = [];

  // pager object
    pager: any = {};
  // paged items
    pagedItems: any[];

  _serverPath: any;

  _tableVisibility: boolean = false;
  _loadData: boolean = false;
  noRecordFound: boolean = false;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private _configuration: Configuration,
    private _auditService: AuditService,
    private pagerService: PagerService,
    
  ) {
      this._serverPath = this._configuration.Server;

      if (this._authService.auth_id === '') {
        this.authId = null;
      } else {
        this.authId = this._authService.auth_id;
      }
  }

  ngOnInit() {
    this.getAllAudit();
  }
  getAllAudit() {
    this._auditService
          .GetAll()
          .subscribe(
          data => {
            this.pagedItems = [];
            this._auditLists = [];

            this._allAuditLists = data;
            data.forEach(element => {
              element.date = this.updateClock(element.date);
              let checkValue = this.checkUniquness(element.adminid._id, this._selectedAdmin);
              if (checkValue == 0) {
                this._selectedAdmin.push(element.adminid);
              }
            });
            this._auditLists  = data;
            if (this._auditLists.length == 0) {
                    this._tableVisibility = false;
                    this.noRecordFound = true;
                    this._loadData = false;
                } else {
                    this._tableVisibility = true;
                    this._loadData = false;
                    this.noRecordFound = false;
                }
            //initialize to page 1
            this.setPage(1);
        });
  }

  checkUniquness(id: number, array: any) {
    let cnt = 0;
    for (let i in array) {
      if (array[i]._id == id) {
        cnt++;
      }
    }
    return cnt;
  }
  setPage(page: number) {
      if (page < 1 || page > this.pager.totalPages) {
          return;
      }
      // get pager object from service
      this.pager = this.pagerService.getPager(this._auditLists.length, page);
      // get current page of items
      this.pagedItems = this._auditLists.slice(this.pager.startIndex, this.pager.endIndex + 1);
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

  onChange() {
    
    this._loadData = true;
    this._tableVisibility = false;
    this.noRecordFound = false;

    this.pagedItems = [];
    this._auditLists = [];

    let admin_value = <HTMLInputElement> document.getElementById('selected_admin');
    let type_value = <HTMLInputElement> document.getElementById('type');

    if ( (admin_value.value == '') && (type_value.value == '') ) {
      this.getAllAudit();
    } else {
      if (admin_value.value == '') {
        this._allAuditLists.forEach(element => {
           if (element.activity == type_value.value) {
             this._auditLists.push(element);
           }
        });
      } else if (type_value.value == '') {
        this._allAuditLists.forEach(element => {
          if (element.adminid._id == admin_value.value) {
            this._auditLists.push(element);
          }
        });
      } else {
        this._allAuditLists.forEach(element => {
          if ((element.activity == type_value.value) && (element.adminid._id == admin_value.value)) {
            this._auditLists.push(element);
          }
        });
      }
      setTimeout(() => {   
          if (this._auditLists.length !== 0) {
              //initialize to page 1
              this.setPage(1);
              this._tableVisibility = true;
              this._loadData = false;
              this.noRecordFound = false;
          } else {
            this.noRecordFound = true;
            this._loadData = false;
            this._tableVisibility = false;
          }
          
      }, 500);
    }
    
  }
}
