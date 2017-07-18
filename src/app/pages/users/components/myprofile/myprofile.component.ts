import { UserloginService } from './../../../../core/services/userlogin/userlogin.service';
import { Configuration } from './../../../../app.constants';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FieldsService } from '../../../../core/services/dynamic-fields/fields.service';
import { FieldsModel } from '../../../../core/models/dynamic-fields/fields.model';

import { UsersService } from '../../../../core/services/users/users.service';
import { UsersModel } from '../../../../core/models/users/users.model';

import { AuthService } from '../../../../core/services/common/auth.service';

import { Message } from 'primeng/primeng';

import { BaImageLoaderService, BaThemePreloader, BaThemeSpinner } from '../../../../theme/services';

@Component({
  selector: 'nga-myprofile',
  templateUrl: './myprofile.html',
})

export class MyprofileComponent {

  msgs: Message[] = [];

  _provinceLists: any[] = [];
  _districtLists: any[] = [];
  _areaLists: any[] = [];

  _districtBasedOnProvince: any[] = [];
  _areaBasedOnProvince: any[] = [];

  _districtOptionLists: any[] = [];
  _areaOptionLists: any[] = [];

  fieldLists: any[] = [];
  bindId: string;
  userData: any[] = [];
  _needToSave: any[] = [];

  authId: string;

  displayFieldLists: boolean = false;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _fieldsService: FieldsService,
    private _usersService: UsersService,
    private _authService: AuthService,
    private _configuration: Configuration,
    private _userloginService: UserloginService,
    private _spinner: BaThemeSpinner) {

      if (this._authService.auth_id === '') {
        this.authId = null;
      } else {
        this.authId = this._authService.auth_id;
      }
      this._spinner.show();
  }
  ngOnInit() {
    this.getAllFields();
    this.getAllProvince();
    this.getAllDistrict();
    this.getAllArea();
    this.getUserData(this.authId);
  }

  getUserData(id) {
    this._usersService
          .GetById(id)
          .subscribe(
          data => {
            this.userData = data.admin;
            

            setTimeout(() => {    
              this.fieldLists.forEach(element => {
                if (element.fieldtype == 'image') {
                  let isImage = <HTMLInputElement> document.getElementById('image_' + element.labelname);
                  let isImageDisplay = <HTMLInputElement> document.getElementById('imagePath_' + element.labelname);
                  if (document.getElementById('image_' + element.labelname)) {
                    isImage.value = this.userData[element.labelname];
                  }
                  if (this.userData[element.labelname] != '') {
                    if (document.getElementById('imagePath_' + element.labelname)) {
                      isImageDisplay.src = this._configuration.Server + this.userData[element.labelname];
                    }
                    
                  }
                }
                element.value = this.userData[element.labelname];
                element.visiblity = false;
              });
              this.onChangeProvince(this.userData['province']);
              if (this.fieldLists.length !== 0 ) {
                this._spinner.hide();
                this.displayFieldLists = true;
              } else {
                this.displayFieldLists = false;
              }      
            }, 2000);
            
            
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
        });
  }
  onChangeProvince(value: any) {
    this._districtOptionLists = [];
    this._areaOptionLists = [];
    
    this._districtOptionLists = this._districtBasedOnProvince[value];
    this._areaOptionLists = this._areaBasedOnProvince[value];
  }

  getAllFields() {
    this._fieldsService
          .GetAll('admin')
          .subscribe(
          data => {
            this.fieldLists = data;
        });
  }

  onUploadPhoto(event, val) {
      const url = event.xhr.response;
      const isImageValue = <HTMLInputElement> document.getElementById('image_' + val);
      isImageValue.value = url;
      const ispath = <HTMLInputElement> document.getElementById('imagePath_' + val);
      ispath.src = this._configuration.Server + url;
      this.editSave(val, 'image');
  }

  removeImage(val) {
    const isImageValue = <HTMLInputElement> document.getElementById('image_' + val);
    isImageValue.value = '';
    const ispath = <HTMLInputElement> document.getElementById('imagePath_' + val);
    ispath.src = '';
    this.editSave(val, 'image');
  }

  edit(fieldname: any) {
    this.fieldLists.forEach(element => {
      if (element.labelname == fieldname) {
        element.visiblity = true;
      } else {
        element.visiblity = false;
      }
    });
  }
  editSave(fieldname: any, fieldType: any) {
    this._usersService
      .GetById(this.authId)
      .subscribe(
      data => {
        this._needToSave = data;
        let updatedValue;
        if (fieldType == 'image') {
          updatedValue = <HTMLInputElement> document.getElementById('image_' + fieldname);
        } else {
          updatedValue = <HTMLInputElement> document.getElementById(fieldname);
        }
        
        this._needToSave['admin'][fieldname] = updatedValue.value;
        this.saveProfile(this._needToSave['admin'], fieldname, updatedValue.value);
      });
  }
  saveProfile(updateddata, labelname, newValue) {
    this._usersService
      .Update(this.authId, updateddata)
      .subscribe(
      data => {
        this.msgs = [];
        this.msgs.push ({ 
          severity: 'info', summary: 'Updated Message', detail: 'Admin has been Updated Successfully!!!' });
          this._userloginService.updateProfileData();
        this.fieldLists.forEach(element => {
          if (element.labelname == labelname) {
            element.value = newValue;
          }
          element.visiblity = false;
        });
      });
  }
  editCancel(fieldname: any) {
    this.fieldLists.forEach(element => {
      element.visiblity = false;
    });
  }
}
