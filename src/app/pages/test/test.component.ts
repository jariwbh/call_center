import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UsersService } from '../../core/services/users/users.service';
import { FieldsService } from '../../core/services/dynamic-fields/fields.service';

import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'nga-test',
  templateUrl: './test.html',
  styleUrls: ['./test.scss'],
})
export class TestComponent {

    
    adminlist: any [] = [];
    fullnameLists: any [] = [];
    provinceLists: any [] = [];
    districtLists: any [] = [];
    areaLists: any [] = [];
    
    // cars: any[] = [];
    // brands: SelectItem[];
    // colors: SelectItem[];
    // yearFilter: number;

   constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _usersService: UsersService,
    private _fieldsService: FieldsService,
    
  ) {
  }
   ngOnInit() {
    this.getAllAdmin();
  }

  getAllAdmin() {
    this._usersService
      .GetAll()
      .subscribe( data => {
        this.adminlist = [];
        this.provinceLists = [];
        this.districtLists = [];
        this.areaLists = [];
        data.forEach(element => {
          this.adminlist.push({ 
              fullname: element.admin.fullname, 
              province: element.admin.province, 
              district: element.admin.district,
              area: element.admin.area,
            });
            this.fullnameLists.push({ label: element.admin.fullname, value: element.admin.fullname });
            this.provinceLists.push({ label: element.admin.province, value: element.admin.province });
            this.districtLists.push({ label: element.admin.district, value: element.admin.district });
            this.areaLists.push({ label: element.admin.area, value: element.admin.area });
        });
        
      });
  }
}
