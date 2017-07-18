import { BaThemeSpinner } from './../../../../../theme/services/baThemeSpinner/baThemeSpinner.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { ManagepeopleService } from '../../../../../core/services/people/manage-people.service';

import { ActivityService } from '../../../../../core/services/activity/activity.service';
import { ActivityModel } from '../../../../../core/models/activity/activity.model';

import { FieldsService } from '../../../../../core/services/dynamic-fields/fields.service';
import { FieldsModel } from '../../../../../core/models/dynamic-fields/fields.model';

import { PagerService } from '../../../../../core/services/common/pager.service';

import { Message } from 'primeng/primeng';
import { AuthService } from '../../../../../core/services/common/auth.service';
import { Configuration } from '../../../../../app.constants';

@Component({
  selector: 'nga-form-activity',
  templateUrl: './form.html',
  styleUrls: ['./grid.scss'],
})

export class FormComponent {

_activityModel = new ActivityModel();

typeForm: FormGroup;
typeSubmitted: boolean;

userSearchForm: FormGroup;
userSearchSubmitted: boolean;

aboutForm: FormGroup;
aboutSubmitted: boolean;

activityTypeVisibilty = true;
howActivityVisibilty = false;
aboutVisibilty = false;

msgs: Message[] = [];
errorMsgs: Message[] = [];

_completedStep = 1;

_allEmails: any [] = [];
filteredEmailsMultiple: any[];

bindId: string;

authId: string;
serverPath: string;

_imageLists: any [] = [];


_allUsers: any[] = [];
 
 // pager object
    pager: any = {};
  // paged items
    pagedItems: any[];

  _provinceLists: any[] = [];
  _districtLists: any[] = [];
  _areaLists: any[] = [];

  _districtBasedOnProvince: any[] = [];
  _areaBasedOnProvince: any[] = [];

  _districtOptionLists: any[] = [];
  _areaOptionLists: any[] = [];

  _loadData = false;
  _tableVisibility = true;

  _selectedUsersLists: any[] = [];
  _selectedUsers: any[] = [];

constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _activityService: ActivityService,
    private _managepeopleService: ManagepeopleService,
    private _fieldsService: FieldsService,
    private _authService: AuthService,
    private _configuration: Configuration,
    private pagerService: PagerService,
    private _spinner: BaThemeSpinner,
  ) { 
    _spinner.show();
    this.serverPath = this._configuration.Server;
    
    if (this._authService.auth_id === '') {
      this.authId = null;
    } else {
      this.authId = this._authService.auth_id;
    }

    this.typeForm = fb.group({
        'activitytype': [this._activityModel.activitytype, Validators.required],
    });

    this.userSearchForm = fb.group({
        'persons': [this._activityModel.persons],
    });

    this.aboutForm = fb.group({
        'images': [this._activityModel.images, Validators.required],
        'description': [this._activityModel.description, Validators.required],
        'url': [this._activityModel.url, Validators.required],
        'name': [this._activityModel.name],
    });

    //this.getAllPersonrEmail();
  }

  ngOnInit() {
    //get URLid
    this._route.params.subscribe(
        (param: any) => {
            this.bindId = param['id'];
    });
    this.getAllUsers();
    this.getAllProvince();
    this.getAllDistrict();
    this.getAllArea();

    if (this.bindId) {
      this.getActivityById(this.bindId);
    }
  }
  
  getAllUsers() {
      this._managepeopleService
          .GetAll()
          .subscribe( data => {
          data.forEach(element => {
              element.person['id'] = element._id;
              this._allUsers.push(element.person);
          });
          if (this._allUsers.length == 0) {
              this._tableVisibility = false;
          } else {
              this._tableVisibility = true;
          }
          //initialize to page 1
          this.setPage(1);
      });
  }

  setPage(page: number) {
      if (page < 1 || page > this.pager.totalPages) {
          return;
      }
      // get pager object from service
      this.pager = this.pagerService.getPager(this._allUsers.length, page);
      // get current page of items
      this.pagedItems = this._allUsers.slice(this.pager.startIndex, this.pager.endIndex + 1);
      this.pagedItems.forEach(element => {
          this._selectedUsersLists.forEach(ele => {
              if (ele.id == element.id) {
                  element.disabled = true;
              }
          });
      });
  }

  getAllProvince() {
    this._fieldsService
          .GetAllProvince()
          .subscribe(
          data => {
            this._provinceLists  = data;
        });
  }
  getAllDistrict() {
    this._fieldsService
          .GetAllDistrict()
          .subscribe(
          data => {
            this._districtLists  = data;
            this._districtLists.forEach(element => {
              const index = element.province;
              if ( !this._districtBasedOnProvince[index] ) {
                this._districtBasedOnProvince[index] = [];
              }
              this._districtBasedOnProvince[index].push(element.district);
            });
            this._spinner.hide();
        });
  }
  getAllArea() {
    this._fieldsService
          .GetAllArea()
          .subscribe(
          data => {
            this._areaLists  = data;
            this._areaLists.forEach(element => {
              const index = element.province;
              if ( !this._areaBasedOnProvince[index] ) {
                this._areaBasedOnProvince[index] = [];
              }
              this._areaBasedOnProvince[index].push(element.area);
            });
            this._spinner.hide();
        });
  }
  
  onChangeProvince(value: any) {
        this._allUsers = [];
        this.pagedItems = [];
        
        this._tableVisibility = false;
        if (value == '') {
            this.getAllUsers();
        } else {
            this.FilteredUsers('province', value);
        }
        

        this._districtOptionLists = [];
        this._areaOptionLists = [];

        this._districtOptionLists = this._districtBasedOnProvince[value];
        this._areaOptionLists = this._areaBasedOnProvince[value];
    }

    onChangeDistrict(value: any) {
        let areaValue = <HTMLInputElement> document.getElementById('area');
        areaValue.value = '';
        this._tableVisibility = false;
        if (value == '') {
            let proviceValue = <HTMLInputElement> document.getElementById('provice');
            if (proviceValue) {
                this.FilteredUsers('province', proviceValue.value);
            } else {
                this.getAllUsers();
            }
        } else {
            this.FilteredUsers('district', value);
        }
        
    }
    onChangeArea(value: any) {
        let districtValue = <HTMLInputElement> document.getElementById('district');
        districtValue.value = '';
        this._tableVisibility = false;
        if (value == '') {
            let proviceValue = <HTMLInputElement> document.getElementById('provice');
            if (proviceValue) {
                this.FilteredUsers('province', proviceValue.value);
            } else {
                this.getAllUsers();
            }
        } else {
            this.FilteredUsers('area', value);
        }
        
    }

    FilteredUsers(type, value) {
        this._loadData = true;
        this._allUsers = [];
    this._managepeopleService
        .GetAll()
        .subscribe( data => {
            data.forEach(element => {
                if (type == 'province') {
                    if (element.person.province == value) {
                        element.person['id'] = element._id;
                        this._allUsers.push(element.person);
                    }
                }
                if (type == 'district') {
                    if (element.person.district == value) {
                        element.person['id'] = element._id;
                        this._allUsers.push(element.person);
                    }
                }
                if (type == 'area') {
                    if (element.person.area == value) {
                        element.person['id'] = element._id;
                        this._allUsers.push(element.person);
                    }
                }
            });
            setTimeout(() => {   
                if (this._allUsers.length !== 0) {
                    //initialize to page 1
                    this.setPage(1);
                }
                this._tableVisibility = true;
                this._loadData = false;
            }, 1500);
            
        });
    }
  
  addUser(users: any) {
      this._selectedUsersLists.push(users);
      let ischecked = <HTMLInputElement> document.getElementById('addbtn_' + users.id);
      ischecked.disabled = true;
  }

  selectAll() {
      let proviceValue = <HTMLInputElement> document.getElementById('provice');
      if (proviceValue.value == '') {
          this.errorMsgs = [];
          this.errorMsgs.push({ severity: 'error', summary: 'Error Message', detail: 'Select provice failed' });
      } else {
          let districtValue = <HTMLInputElement> document.getElementById('district');
          let areaValue = <HTMLInputElement> document.getElementById('area');
          if (districtValue.value !== '' || areaValue.value !== '' || proviceValue.value !== '') {
              if (this._allUsers.length !== 0) {
                  this._allUsers.forEach(element => {
                      let existValue = this.checkUserExistsornot(element.id, this._selectedUsersLists);
                      if (existValue == 0) {
                          element.disabled = true;
                          this._selectedUsersLists.push(element);
                      }
                  });
                  this.msgs = [];
                  this.msgs.push({ 
                      severity: 'success', summary: 'Success Message', detail: 'User Added Successfully!!',
                  });
              } else {
                  this.errorMsgs = [];
                  this.errorMsgs.push({ 
                      severity: 'error', summary: 'Error Message', detail: 'No User Found!!',
                  }); 
              }
          }
      }
  }
  checkUserExistsornot(id: number, array: any) {
      let cnt = 0;
      for (let i in array) {
          if (array[i].id == id) {
              cnt++;
          }
      }
      return cnt;
  }

  getActivityById(id: any) {
    this._activityService
      .GetById(id)
      .subscribe(data => {
        if (data) {
          this._activityModel = data;
          this._imageLists = this._activityModel.images;
          this._completedStep = 3;
          this.activityTypeVisibilty = false;
          this.howActivityVisibilty = false;
          this.aboutVisibilty = true;
         
        }
        this._spinner.hide();
      });
  }
  removeImage(id) {
    this.removeSeletectdImage(id, this._imageLists);
  }

  removeSeletectdImage(id: number, array: any) {
    for (let i in array) {
      if (array[i].id == id) {
        array.splice(i, 1);
      }
    }
  }
  onUploadPhoto(event) {
      const url = event.xhr.response;
      let uuid = this.uuid();
      let grp = {
        id: uuid,
        imagevalue: url,
      };
      this._imageLists.push(grp);
      this._activityModel.images = this._imageLists;
  }

  uuid() {
    let uuid = "", i, random;
    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;

      if (i == 8 || i == 12 || i == 16 || i == 20) {
        uuid += "-"
      }
      uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
  }

  onTypeSubmit(value: any, isValid: boolean) {
    this.typeSubmitted = true;
      if (!isValid) {
          this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Validation failed' });
          return false;
      } else {
        this._activityModel.activitytype = value.activitytype;
        this.msgs = [];
        this.msgs.push ({ 
          severity: 'info', summary: 'Insert Message', detail: 'Activity has been added Successfully!!!' });
        this._completedStep = 2;
        this.activityTypeVisibilty = false;
      this.howActivityVisibilty = true;
      this.aboutVisibilty = false;
      }
  }

  // getAllPersonrEmail() {
  //     this._managepeopleService
  //       .GetAll()
  //       .subscribe(
  //       data => {
  //         data.forEach(element => {
  //           const id = element._id;
  //           const email = element.person.email;
  //           const grp = {
  //             name: email,
  //             code: id,
  //           }; 
  //           this._allEmails.push(grp);
  //         });
  //     });
  //   }
  //   filterEmailMultiple(event) {
  //     const query = event.query;
  //     this.filteredEmailsMultiple = this.filterEmail(query, this._allEmails);
  //   }
    
  //   filterEmail(query, emails: any[]): any[] {
  //       const filtered: any[] = [];
  //       emails.forEach(element => {
  //         const email = element;
  //         if (email.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
  //               filtered.push(email);
  //         }
  //       });
  //       return filtered;
  //   }

  onUserSearchSubmit(value: any, isValid: boolean) {
    this.userSearchSubmitted = true;
      if (!isValid) {
          this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Validation failed' });
          return false;
      } else {
        if (this._selectedUsersLists.length == 0) {
            this.msgs = [];
            this.msgs.push({
                severity: 'error', 
                summary: 'Error Message', 
                detail: 'Select atleast one User',
            });
        } else {
          this._activityModel.persons = [];
          this._selectedUsersLists.forEach(element => {
              this._activityModel.persons.push(element.id);
          });
          this.msgs = [];
          this.msgs.push ({ 
            severity: 'info', summary: 'Insert Message', detail: 'Activity has been added Successfully!!!' });
          this._completedStep = 3;
          this.activityTypeVisibilty = false;
          this.howActivityVisibilty = false;
          this.aboutVisibilty = true;
        }
      }
  }

  onAboutSubmit(value: any, isValid: boolean) {
    this.aboutSubmitted = true;
      if (!isValid) {
          this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Validation failed' });
          return false;
      } else {
        this._activityModel.description = value.description;
        this._activityModel.url = value.url;
        this._activityModel.name = value.name;
        if (this.authId) {
          if (this.bindId) {
            this._activityService
              .Update(this.bindId, this._activityModel)
              .subscribe(data => {
                this.msgs = [];
                this.msgs.push ({ 
                  severity: 'info', 
                  summary: 'Update Message', 
                  detail: 'Activity has been Updated Successfully!!!' });
                this._router.navigate(['/pages/activities/manage-activity']);
            });
          } else {
            this._activityService
              .Add(this.authId, this._activityModel)
              .subscribe(data => {
                this.msgs = [];
                this.msgs.push ({ 
                  severity: 'info', summary: 'Insert Message', detail: 'Activity has been added Successfully!!!' });
                this._router.navigate(['/pages/activities/manage-activity']);
            });
          }
        }
      }
  }

switchbox(value: any) {
    if (value === 'activityType') {
      
      if (this._completedStep < 1) {
        this._completedStep = 1;
      }
      this.activityTypeVisibilty = true;
      this.howActivityVisibilty = false;
      this.aboutVisibilty = false;
    } else if (value === 'howActivity') {
      this._loadData = true;
      if (this._completedStep < 2) {
        this._completedStep = 2;
      }
      this.activityTypeVisibilty = false;
      this.howActivityVisibilty = true;
      this.aboutVisibilty = false;
      
      if (this.bindId) {
          setTimeout(()=> {
            this._selectedUsersLists = [];
            this._activityModel.persons.forEach(element => {
              let isChecked = <HTMLInputElement> document.getElementById('addbtn_' + element);
              if (isChecked) {
                isChecked.click();
              }
            });        
            this._loadData = false;
          }, 1000);
          
      }
    } else if (value === 'about') {
      if (this._completedStep < 3) {
        this._completedStep = 3;
      }
      this.activityTypeVisibilty = false;
      this.howActivityVisibilty = false;
      this.aboutVisibilty = true;
    }
  }

}
