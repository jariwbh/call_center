import { debounce } from 'rxjs/operator/debounce';
import { forEach } from '@angular/router/src/utils/collection';

import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './../../core/services/common/auth.service';
import { UserloginService } from './../../core/services/userlogin/userlogin.service';

import { UserLoginModel } from './../../core/models/userlogin/userlogin.model';


@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {

  public form: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;
  public _UserLoginModel = new UserLoginModel();
  public auth_error;
  public token;
  public Invalid = false;
  public redirToDashboard = false;

  constructor(fb: FormBuilder, private userloginService: UserloginService,
    private authService: AuthService,
    private _router: Router) {
    this.authService.logout();

    // this.form = fb.group({
    //   'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    //   'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    // });

    this.form = fb.group({
      'email': [this._UserLoginModel.username, Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': [this._UserLoginModel.password, Validators.compose([Validators.required, Validators.minLength(4)])],
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      // your code goes here
      // console.log(values);
      //console.log(this._UserLoginModel);
      this.userloginService.login(this._UserLoginModel).subscribe(data => {
        //console.log(data);
        if (data) {
          if (data.success === true) {
             this.Invalid = false;
            // this.token = {
            //   username: this._UserLoginModel.username,
            //   token: 'ggfggththjyjyjgyhjukukkjhgrdgrdgfgfgtghtgsdfefe',
            //   role: 'A',
            //   _id: 'ghfhgfhyhjnuyfhrhfmyhmncb',
            // };
            data.admin.admin.password = '';
            this.token = {
              username: this._UserLoginModel.username,
              user: data.admin.admin,
              token: data.token,
              role: data.admin.admin.role,
              _id: data.admin._id,
            };
            //console.log(this.token);

            this.authService.login(this.token);

            // if (this.authService.auth_role === 'A') {
              this.form.reset();
              this.submitted = false;
              // View Dashboard page
              // console.log(data.admin.admin.role);
              if (data.admin.admin.role == 'S') {
                      if (data.admin.admin.acl) {
                  data.admin.admin.acl.forEach(ele => {
                     if (ele === 'View Dashboard page') {
                        this.redirToDashboard = true;
                     }
                  });
               }
                if (this.redirToDashboard) {
                   this._router.navigate(['dashboard']);
                } else {
                   this._router.navigate(['pages/points/person']);
                }
              } else {
                   this._router.navigate(['dashboard']);
              }
              
            // } else {
            //   this.auth_error = 'Only admin can sign in.';
            //   this.authService.logout();
            //   this._router.navigate(['login']);
            //   //this.getuserdata(this.authService.auth_id);
            //   //this._router.navigate(['/loader']);
            // }
          } else {
             this.Invalid = true;
              this.authService.logout();
              //this._router.navigate(['login']);
          }

        }
        //this.form.reset();

      }
        , response => {
          if (response.status === 400) {
            //this.edited = true;
            this.auth_error = 'Email or password is incorrect.'; 
            this.Invalid = true;
            this._router.navigate(['login']);
            //this.checking_uniquness = false;
            return false;
          }
        },
      );
    }
  }
}
