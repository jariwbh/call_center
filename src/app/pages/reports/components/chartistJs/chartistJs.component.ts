import { FieldsModel } from './../../../../core/models/dynamic-fields/fields.model';

import { forEach } from '@angular/router/src/utils/collection';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { ChartistJsService } from './chartistJs.service';
import { ReportService } from './../../../../core/services/report/report.service';
import { Message } from 'primeng/primeng';
import { SettingsService } from './../../../../core/services/settings/settings.service';
import { FieldsService } from './../../../../core/services/dynamic-fields/fields.service';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'nga-chartist-js',
  templateUrl: './chartistJs.html',
  styleUrls: ['./chartistJs.scss', './test.scss'],
})

export class ChartistJsComponent {
  showSpinner = false;
  chartType: string = 'Bar';
  comparePointHistoryDataB: any;
  comparePointHistoryDataA: any;
  districtCountSettingsList: any;
  compareUserHistoryDataB: any;
  compareUserHistoryDataA: any;
  provinceCountSettingsList: any;
  selectUserHistoryData: any;
  selectType: string = '';
  compareTwo: string = '';
  firstProvince: string = '';
  secondProvince: string = '';
  firstDistrict: string = '';
  secondDistrict: string = '';
  selectProvince: string = '';
  selectDistrict: string = '';
  xAxisField: string = '';
  xAxisFieldValue: string = '';
  // fieldDyCountReport: any = {};
  fieldDyCountReport: any = '';
  fieldDyBestReport: any = '';
  // fieldDyCompareReport: any = {};
  fieldDyCompareReport: any = '';
  fieldValueDyCountReport: any = [];
  fieldValueDyBestReport: any = {};
  fieldValueDyCompareReport: any = [];
  fieldValueModel: string = '';
  fieldValueModelList: string[] = [];
  hasLookupData = false;
  disablemultiSelect = false;
  tempfieldValueDDList: string[] = [];
  fieldValueDDList: string[] = [];

  showGenCompareReport = false;
  showGenSelectReport = false;
  showGenDynamicReport = false;
  showGenDyCountReport = false;
  showGenDyBestReport = false;
  showGenDyCompareReport = false;

  dataComparePointHistory: any = {};
  dataCompareUserHistory: any = {};
  dataCompareResultHistory: any = {};

  dataSelectPointHistory: any = {};
  dataSelectUserHistory: any = {};
  dataSelectResultHistory: any = {};

  dataDyCountUserHistory: any = {};
  dataDyBestUserHistory: any = {};
  dataDyCompareUserHistory: any = {};

  msgs: Message[] = [];
  data: any;
  // allView: boolean = true;
  compareView: boolean = true;
  selectedView: boolean = false;
  dynamicView: boolean = false;

  countDyView: boolean = true;
  bestDyView: boolean = false;
  compareDyView: boolean = false;

  provinceList: any[] = [];
  districtList: any[] = [];
  areaList: any[] = [];

  tempfulnameList: any[] = [];
  tempprovinceList: any[] = [];
  tempdistrictList: any[] = [];
  tempareaList: any[] = [];

  adminlist: any[] = [];
  fullnameLists: any[] = [];
  provinceLists: any[] = [];
  districtLists: any[] = [];
  areaLists: any[] = [];

  _allProvinceLists: any[] = [];
  _allDistrictLists: any[] = [];
  _allAreaLists: any[] = [];

  districtListforDD: any[] = [];
  areaListforDD: any[] = [];

  fieldList: any[] = [];

  defaultLabelArr: string[] = [];
  defaultseriesArr: number[] = [];
  selectMonthYearArray: any[] = [];

  userHistoryDySearch: any = {};

  chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(231,233,237)',
  };

  constructor(private _chartistJsService: ChartistJsService,
    private _ReportService: ReportService,
    private _Settings: SettingsService,
    private _fieldsService: FieldsService,
  ) {
    this.chartType = 'Bar';
    this.defaultLabelArr = _ReportService.defaultLabelArr;
    this.defaultseriesArr = _ReportService.defaultseriesArr;
    this.selectMonthYearArray = _ReportService.selectMonthYearArray;
    this.dataComparePointHistory = {
      labels: this.defaultLabelArr,
      series: [this.defaultseriesArr],
    };
    this.dataCompareUserHistory = {
      labels: this.defaultLabelArr,
      series: [this.defaultseriesArr],
    };
    this.dataCompareResultHistory = {
      labels: this.defaultLabelArr,
      series: [this.defaultseriesArr],
    };
    this.dataSelectPointHistory = {
      labels: this.defaultLabelArr,
      series: [this.defaultseriesArr],
    };
    this.dataSelectUserHistory = {
      labels: this.defaultLabelArr,
      series: [this.defaultseriesArr],
    };
    this.dataSelectResultHistory = {
      labels: this.defaultLabelArr,
      series: [this.defaultseriesArr],
    };
    this.dataDyCountUserHistory = {
      labels: this.defaultLabelArr,
      series: [this.defaultseriesArr],
    };
    this.dataDyBestUserHistory = {
      labels: this.defaultLabelArr,
      series: [this.defaultseriesArr],
    };
    this.dataDyCompareUserHistory = {
      labels: this.defaultLabelArr,
      series: [this.defaultseriesArr],
    };

    this.userHistoryDySearch.province = [];
    this.userHistoryDySearch.district = [];
    this.userHistoryDySearch.area = [];
    this.userHistoryDySearch.groupby = [];
    this.userHistoryDySearch.searchvalue = [];
  }

  ngOnInit() {
    this.showSpinner = false;
    this.chartType = 'Bar';
    this.data = this._chartistJsService.getAll();
    this.getAllProvince();
    this.getAllDistrict();
    this.getAllAreas();
    this.getAllFields();
  }

  getAllProvince() {
    this._ReportService.GetAllProvince().subscribe(data => {
      if (data) {
        this.provinceList = data;
        data.forEach(element => {
          this._allProvinceLists.push(element.name);
        });
        this.userHistoryDySearch.province = this._allProvinceLists;
      }
    });
  }
  getAllDistrict() {
    this._ReportService.GetAllDistrict().subscribe(data => {
      if (data) {
        this.districtList = data;
        data.forEach(element => {
          this._allDistrictLists.push(element.district);
        });
        this.userHistoryDySearch.district = this._allDistrictLists;
      }
    });
  }
  getAllAreas() {
    this._ReportService.GetAllArea().subscribe(data => {
      if (data) {
        this.areaList = data;
        data.forEach(element => {
          this._allAreaLists.push(element.area);
        });
        this.userHistoryDySearch.area = this._allAreaLists;
      }
    });
  }
  getAllFields() {
    this._fieldsService
      .GetAll('people')
      .subscribe(
      data => {
        if (data) {
          this.fieldList = data;
          //  this.fieldList = this.fieldList.filter(ele => (ele.labelname !== 'province' &&
          //   ele.labelname !== 'district' &&
          //   ele.labelname !== 'area'));
        }
      });
  }
  switchView(view: string) {
    
    this.selectType = '';
    this.compareTwo = '';
    this.firstProvince = '';
    this.secondProvince = '';
    this.firstDistrict = '';
    this.secondDistrict = '';
    this.selectProvince = '';
    this.selectDistrict = '';

    this.showGenCompareReport = false;
    this.showGenSelectReport = false;
    this.showGenDynamicReport = false;
    if (view === 'CompareView') {
      //this.allView = false;
      this.compareView = true;
      this.selectedView = false;
      this.dynamicView = false;
    } else if (view === 'SelectedView') {
      //this.allView = false;
      this.compareView = false;
      this.selectedView = true;
      this.dynamicView = false;
    } else if (view === 'DynamicView') {
      //this.allView = false;
      this.compareView = false;
      this.selectedView = false;
      this.dynamicView = true;
    }
  }

  switchDyView(view: string) {
     this.showSpinner = false;
     this.chartType = 'Bar';
    // this.selectType = '';
    // this.compareTwo = '';
    // this.firstProvince = '';
    // this.secondProvince = '';
    // this.firstDistrict = '';
    // this.secondDistrict = '';
    // this.selectProvince = '';
    // this.selectDistrict = '';

    // this.fieldDyCountReport = {};
    this.fieldDyCountReport = '';
    this.fieldDyBestReport = '';
    // this.fieldDyCompareReport = {};
    this.fieldDyCompareReport = '';
    this.fieldValueDyCountReport = [];
    this.fieldValueDyBestReport = {};
    this.fieldValueDyCompareReport = [];
    this.fieldValueModel = '';
    this.fieldValueModelList = [];
    // this.showGenCompareReport = false;
    // this.showGenSelectReport = false;
    // this.showGenDynamicReport = false;

    this.showGenDyCountReport = false;
    this.showGenDyBestReport = false;
    this.showGenDyCompareReport = false;

    this.xAxisField = '';
    this.xAxisFieldValue = '';
    
    this.userHistoryDySearch.province = [];
    this.userHistoryDySearch.district = [];
    this.userHistoryDySearch.area = [];
     this.userHistoryDySearch.province = this._allProvinceLists;
    this.userHistoryDySearch.district = this._allDistrictLists;
    this.userHistoryDySearch.area = this._allAreaLists;
    this.userHistoryDySearch.groupby = [];
    this.userHistoryDySearch.searchvalue = [];

    this.disablemultiSelect = false;

    if (view === 'CountDyView') {

      this.countDyView = true;
      this.bestDyView = false;
      this.compareDyView = false;
    } else if (view === 'BestDyView') {
      this.countDyView = false;
      this.bestDyView = true;
      this.compareDyView = false;
    } else if (view === 'CompareDyView') {
      this.countDyView = false;
      this.bestDyView = false;
      this.compareDyView = true;
    }
  }

  onChangeFieldToCompare(fieldsToCompare) {
    this.showGenCompareReport = false;
    this.firstProvince = '';
    this.secondProvince = '';
    this.firstDistrict = '';
    this.secondDistrict = '';
    if (fieldsToCompare === 'Province') {
      this.compareTwo = 'Province';
    } else if (fieldsToCompare === 'District') {
      this.compareTwo = 'District';
    }

  }
  onChangeFieldforSelectReport(selectedField) {
    this.showGenSelectReport = false;
    this.selectProvince = '';
    this.selectDistrict = '';
    if (selectedField === 'Province') {
      this.selectType = 'Province';
    } else if (selectedField === 'District') {
      this.selectType = 'District';
    }
  }

  onChangeFieldforDynamicReport(selectedField) {
    this.showGenDynamicReport = false;
    this.xAxisField = selectedField;
  }
  onChangeFieldValueforDynamicReport(selectedField) {
    this.showGenDynamicReport = false;
    this.xAxisFieldValue = selectedField;
  }
  onChangeFieldforDyCountReport(selectedField) {
     this.showSpinner = false;
    this.userHistoryDySearch.groupby = [];
    this.userHistoryDySearch.searchvalue = [];

    this.showGenDyCountReport = false;
    if (selectedField !== '') {
      this.fieldDyCountReport = selectedField;
      // this.fieldDyCountReport = JSON.parse(selectedField);
      // console.log(JSON.parse(selectedField));
      // this.xAxisField = this.fieldDyCountReport.displayname;
      this.xAxisField = this.fieldDyCountReport;
      // if (this.fieldDyCountReport.lookupdata !== null) {
      //   if (this.fieldDyCountReport.lookupdata.length > 0) {
      //     this.hasLookupData = true;
      //   } else {
      //     this.hasLookupData = false;
      //   }
      // } else {
      //   this.hasLookupData = false;
      // }
      // this.userHistoryDySearch.groupby = this.fieldDyCountReport.labelname;
      this.userHistoryDySearch.groupby = this.fieldDyCountReport;
      this._ReportService.GetFieldDDValuesDy(selectedField).subscribe(data => {
        if (data) {
          this.tempfieldValueDDList = [];
          this.tempfieldValueDDList = data;
          this.fieldValueDDList = [];
          this.tempfieldValueDDList.forEach(ele7 => {
            if (ele7 !== '') {
              this.fieldValueDDList.push(ele7);
            }
          });
        }

      });

    } else {
      this.fieldDyCountReport = '';
    }
    this.fieldValueModel = '';
   // console.log(this.fieldDyCountReport);
  }

  onChangeFieldforDyBestReport(selectedField) {
     this.showSpinner = false;
    this.userHistoryDySearch.groupby = [];
    this.userHistoryDySearch.searchvalue = [];

    this.showGenDyBestReport = false;
    this.fieldDyBestReport = selectedField;
    // console.log(this.fieldDyBestReport);
    // console.log(JSON.parse(selectedField));
    this.xAxisField = this.fieldDyBestReport;
    this.userHistoryDySearch.groupby = this.fieldDyBestReport;
   // console.log(this.userHistoryDySearch);
  }
  onChangeFieldforDyCompareReport(selectedField) {
     this.showSpinner = false;
    this.userHistoryDySearch.groupby = [];
    this.userHistoryDySearch.searchvalue = [];

    this.showGenDyCompareReport = false;
    // this.fieldDyCompareReport = selectedField;
    if (selectedField !== '') {
      this.fieldDyCompareReport = selectedField;
      // this.fieldDyCompareReport = JSON.parse(selectedField);
      // console.log(JSON.parse(selectedField));
      // this.xAxisField = this.fieldDyCompareReport.displayname;
      this.xAxisField = this.fieldDyCompareReport;
      // if (this.fieldDyCompareReport.lookupdata !== null) {
      //   if (this.fieldDyCompareReport.lookupdata.length > 0) {
      //     this.hasLookupData = true;
      //   } else {
      //     this.hasLookupData = false;
      //   }
      // } else {
      //   this.hasLookupData = false;
      // }
      // this.userHistoryDySearch.groupby = this.fieldDyCompareReport.labelname;
      this.userHistoryDySearch.groupby = this.fieldDyCompareReport;
      this._ReportService.GetFieldDDValuesDy(selectedField).subscribe(data => {
        if (data) {
          this.tempfieldValueDDList = [];
          this.tempfieldValueDDList = data;
          this.fieldValueDDList = [];
          this.tempfieldValueDDList.forEach(ele7 => {
            if (ele7 !== '') {
              this.fieldValueDDList.push(ele7);
            }
          });
        }

      });

    } else {
      this.fieldDyCompareReport = '';
    }
    // this.fieldValueModel = '';
    this.fieldValueModelList = [];
    this.disablemultiSelect = false;
    // console.log(this.fieldDyCompareReport);
  }

  onChangeFieldValueforDyCountReport(selectedField) {
     this.showSpinner = false;
    this.showGenDyCountReport = false;
    this.fieldValueDyCountReport = selectedField;
    // console.log(JSON.parse(selectedField));
    this.xAxisFieldValue = selectedField;
    this.fieldValueModel = selectedField;
  }
  // onChangeFieldValueforDyBestReport(selectedField) {
  //     this.showGenDyBestReport = false;
  //     this.fieldValueDyBestReport = selectedField;
  //     // console.log(JSON.parse(selectedField));
  //     this.xAxisFieldValue = selectedField;
  // }
  onChangeFieldValueforDyCompareReport(selectedField) {
     this.showSpinner = false;
    // console.log(selectedField);
    if (this.fieldValueModelList.length === 5) {
      this.disablemultiSelect = true;
      this.msgs = [];
      this.msgs.push({ severity: 'warn', summary: 'Warn Message', detail: 'please select only 5 Field Value' });
    }
    this.showGenDyCompareReport = false;
    this.fieldValueDyCompareReport = selectedField;
    // console.log(JSON.parse(selectedField));
    this.xAxisFieldValue = selectedField;
    this.fieldValueModel = selectedField;
  }
  addFieldValue() {
    if (this.fieldValueModelList.length === 5) {
      this.msgs = [];
      this.msgs.push({ severity: 'warn', summary: 'Warn Message', detail: 'please add only 2 FieldValues to Compare' });
      return;
    }
    if (this.fieldValueModel === '') {
      this.msgs = [];
      this.msgs.push({ severity: 'warn', summary: 'Warn Message', detail: 'please Add Unique Field Value' });
    }
    let isp = false;
    this.fieldValueDyCountReport.forEach(ele => {
      if (ele === this.fieldValueModel) {
        isp = true;
      }
    });
    if (isp === false) {
      this.fieldValueDyCountReport.push(this.fieldValueModel);
      this.fieldValueModelList.push(this.fieldValueModel);
      this.fieldValueModel = '';
    } else {
      this.msgs = [];
      this.msgs.push({ severity: 'warn', summary: 'Warn Message', detail: 'please Add Unique Field Value' });
      this.fieldValueModel = '';
    }
    // console.log(this.fieldValueModel);
    // console.log(this.fieldValueDyCountReport);
  }
  removeFieldValue(fieldToRemove) {
    this.fieldValueDyCountReport.forEach(element => {
      if (this.fieldValueDyCountReport.indexOf(fieldToRemove) === this.fieldValueDyCountReport.indexOf(element)) {
        const idx = this.fieldValueDyCountReport.indexOf(fieldToRemove);
        this.fieldValueDyCountReport.splice(idx);
        this.fieldValueModelList.splice(idx);
      }
    });
  }

  onChangeFirstProvince(firstProvince) {
    this.showGenCompareReport = false;
    this.firstProvince = firstProvince;
    // this.resetAllCharts();
  }
  onChangeSecondProvince(secondProvince) {
    this.showGenCompareReport = false;
    this.secondProvince = secondProvince;
    // this.resetAllCharts();
  }
  onChangeFirstDistrict(firstDistrict) {
    this.showGenCompareReport = false;
    this.firstDistrict = firstDistrict;
  }
  onChangeSecondDistrict(secondDistrict) {
    this.showGenCompareReport = false;
    this.secondDistrict = secondDistrict;
  }

  onChangeSelectProvince(selectProvince) {
    this.showGenSelectReport = false;
    this.selectProvince = selectProvince;
  }
  onChangeSelectDistrict(selectDistrict) {
    this.showGenSelectReport = false;
    this.selectDistrict = selectDistrict;
  }

  onChangeDyProvince(province) {
     this.showSpinner = false;
    if (province !== '') {
      this.districtListforDD = this.districtList.filter(element => element.province === province);
      this.areaListforDD = this.areaList.filter(element => element.province === province);
      this.userHistoryDySearch.province = [];
      this.userHistoryDySearch.province.push(province);
    } else {
      this.districtListforDD = [];
      this.areaListforDD = [];
      this.userHistoryDySearch.province = this._allProvinceLists;
    }
    this.showGenDyCountReport = false;
    this.showGenDyBestReport = false;
    this.showGenDyCompareReport = false;
  }

  onChangeDyDistrict(district) {
     this.showSpinner = false;
    if (district !== '') {
      this.userHistoryDySearch.district = [];
      this.userHistoryDySearch.district.push(district);
    } else {
      this.userHistoryDySearch.district = this._allDistrictLists;
    }
    this.showGenDyCountReport = false;
    this.showGenDyBestReport = false;
    this.showGenDyCompareReport = false;
  }

  onChangeDyArea(area) {
     this.showSpinner = false;
    if (area !== '') {
      this.userHistoryDySearch.area = [];
      this.userHistoryDySearch.area.push(area);
    } else {
      this.userHistoryDySearch.area = this._allAreaLists;
    }
    this.showGenDyCountReport = false;
    this.showGenDyBestReport = false;
    this.showGenDyCompareReport = false;
  }

  onChangeChartType(chType) {
   this.chartType = chType;
  }

  genrateReportForDyCount() {
    if (this.fieldDyCountReport.labelname !== '' && this.fieldValueModel !== '') {
      this.userHistoryDySearch.searchvalue = [];
      this.userHistoryDySearch.searchvalue.push(this.fieldValueModel);
      let labelsArr: string[] = [];
      let seriesArrA: number[] = [];
      // console.log(this.userHistoryDySearch);
      this.showSpinner = true;
      this._ReportService.GetUserCountsHistoryDyCount(this.userHistoryDySearch).subscribe(data => {
        // console.log(data);
        if (data) {
          // data.forEach(ele => {
          //   if (ele._id !== null && ele._id !== '') {
          //     labelsArr.push(ele._id);
          //     seriesArrA.push(ele.count);
          //   }
          // });

          this.selectMonthYearArray.forEach(ele => {
            // labelsArr.push(ele.month);
            let countUser = 0;
            data[0].forEach(ele1 => {
              if (ele.year === ele1._id.year) {
                if (ele.monthNo === ele1._id.month) {
                  countUser = ele1.count;
                }
              }
            });
            seriesArrA.push(countUser);
          });
          // this.dataDyCountUserHistory.labels = labelsArr;
          this.dataDyCountUserHistory.series = [seriesArrA];
          // console.log(this.dataDyCountUserHistory);
        }
      });

      this._ReportService.GetUserCountsHistoryDyCountGrid(this.userHistoryDySearch).subscribe(data1 => {
        this.adminlist = [];
        this.provinceLists = [];
        this.districtLists = [];
        this.areaLists = [];
        // console.log(data1);
        data1.forEach(element1 => {
          element1.forEach(element => {
            this.adminlist.push({
              fullname: element.person.fullname,
              province: element.person.province,
              district: element.person.district,
              area: element.person.area,
            });

            let ispfn = false;
            this.tempfulnameList.forEach(ele6 => {
              if (ele6 === element.person.fullname) {
                ispfn = true;
              }
            });

            if (ispfn) {
            } else {
              this.tempfulnameList.push(element.person.fullname);
            }


            let isppr = false;
            this.tempprovinceList.forEach(ele6 => {

              if (ele6 === element.person.province) {
                isppr = true;
              }
            });

            if (isppr) {
            } else {
              this.tempprovinceList.push(element.person.province);
            }

            let isd = false;
            this.tempdistrictList.forEach(ele6 => {
              if (ele6 === element.person.district) {
                isd = true;
              }
            });

            if (isd) {
            } else {
              this.tempdistrictList.push(element.person.district);
            }

            let isa = false;
            this.tempareaList.forEach(ele6 => {
              if (ele6 === element.person.area) {
                isa = true;
              }
            });

            if (isa) {
            } else {
              this.tempareaList.push(element.person.area);
            }


          });
          // console.log(this.fullnameLists);

        });

        this.tempfulnameList.forEach(ele6 => {
          this.fullnameLists.push({ label: ele6, value: ele6 });
        });
        this.tempprovinceList.forEach(ele6 => {
          this.provinceLists.push({ label: ele6, value: ele6 });
        });
        this.tempdistrictList.forEach(ele6 => {
          this.districtLists.push({ label: ele6, value: ele6 });
        });
        this.tempareaList.forEach(ele6 => {
          this.areaLists.push({ label: ele6, value: ele6 });
        });

      });


      setTimeout(() => {
         this.showSpinner = false;
        this.showGenDyCountReport = true;
      }, 500);
    } else {
      this.showGenDyCountReport = false;
      this.msgs = [];
      this.msgs.push({ severity: 'warn', summary: 'Warn Message', detail: 'please select Field & FieldValue' });
    }
    // this.dataDyCountUserHistory.series = [
    //   [15, 24, 43, 57, 65, 70, 77, 82, 98, 100, 125, 200],
    // ];
    // this.showGenDyCountReport = true;
  }
  genrateReportForDyBest() {
    if (this.fieldDyBestReport !== '') {
      let labelsArr: string[] = [];
      let seriesArrA: number[] = [];
       this.showSpinner = true;
      this._ReportService.GetUserCountsHistoryDyBest(this.userHistoryDySearch).subscribe(data => {
        // console.log(data);
        if (data) {
          data.forEach(ele => {
            if (ele._id !== null && ele._id !== '') {
              labelsArr.push(ele._id);
              seriesArrA.push(ele.count);
            }
          });
          this.dataDyBestUserHistory.labels = labelsArr;
          this.dataDyBestUserHistory.series = [seriesArrA];

          // console.log(this.dataDyBestUserHistory);
          this.userHistoryDySearch.searchvalue = labelsArr;
          this._ReportService.GetUserCountsHistoryDyBestGrid(this.userHistoryDySearch).subscribe(data1 => {
            this.adminlist = [];
            this.provinceLists = [];
            this.districtLists = [];
            this.areaLists = [];
            // console.log(data1);
            data1.forEach(element1 => {
              element1.forEach(element => {
                this.adminlist.push({
                  fullname: element.person.fullname,
                  province: element.person.province,
                  district: element.person.district,
                  area: element.person.area,
                });

                let ispfn = false;
                this.tempfulnameList.forEach(ele6 => {
                  if (ele6 === element.person.fullname) {
                    ispfn = true;
                  }
                });

                if (ispfn) {
                } else {
                  this.tempfulnameList.push(element.person.fullname);
                }


                let isppr = false;
                this.tempprovinceList.forEach(ele6 => {

                  if (ele6 === element.person.province) {
                    isppr = true;
                  }
                });

                if (isppr) {
                } else {
                  this.tempprovinceList.push(element.person.province);
                }

                let isd = false;
                this.tempdistrictList.forEach(ele6 => {
                  if (ele6 === element.person.district) {
                    isd = true;
                  }
                });

                if (isd) {
                } else {
                  this.tempdistrictList.push(element.person.district);
                }

                let isa = false;
                this.tempareaList.forEach(ele6 => {
                  if (ele6 === element.person.area) {
                    isa = true;
                  }
                });

                if (isa) {
                } else {
                  this.tempareaList.push(element.person.area);
                }


              });
              // console.log(this.fullnameLists);

            });

            this.tempfulnameList.forEach(ele6 => {
              this.fullnameLists.push({ label: ele6, value: ele6 });
            });
            this.tempprovinceList.forEach(ele6 => {
              this.provinceLists.push({ label: ele6, value: ele6 });
            });
            this.tempdistrictList.forEach(ele6 => {
              this.districtLists.push({ label: ele6, value: ele6 });
            });
            this.tempareaList.forEach(ele6 => {
              this.areaLists.push({ label: ele6, value: ele6 });
            });

          });
        }
      });
      // this.dataDyBestUserHistory.labels = ['Basra', 'Muthanna', 'Najaf', 'Babylon', 'Baghdad'];
      // this.dataDyBestUserHistory.series = [
      // [82, 98, 100, 125, 200],
      //   [15, 24, 43, 37, 65, 80, 77, 82, 98, 100, 125, 200],
      //     [13, 22, 49, 22, 4, 6, 24, 46, 57, 148, 22, 4],
      // ];
      // this.showGenDyBestReport = true;
      setTimeout(() => {
         this.showSpinner = false;
        this.showGenDyBestReport = true;
      }, 500);
    } else {
      this.showGenDyBestReport = false;
      this.msgs = [];
      this.msgs.push({ severity: 'warn', summary: 'Warn Message', detail: 'please select Field' });
    }

  }

  genrateReportForDyCompare() {
    // if (this.fieldValueModelList.length < 2) {
    //   this.msgs = [];
    //   this.msgs.push({ severity: 'warn', 
    // summary: 'Warn Message', detail: 'please select 2 FieldValues to Compare' });
    // }
    if (this.fieldDyCompareReport.labelname !== '' && this.fieldValueModelList.length > 0) {
      // this.userHistoryDySearch.searchvalue.push(this.fieldValueModel);
      this.userHistoryDySearch.searchvalue = this.fieldValueModelList;
      let labelsArr: string[] = [];
      let seriesArrA: number[] = [];
      let seriesArrB: number[] = [];
      let seriesArrC: number[] = [];
      let seriesArrD: number[] = [];
      let seriesArrE: number[] = [];
       this.showSpinner = true;
      // console.log(this.userHistoryDySearch);

      // this._ReportService.GetUserCountsHistoryDyCompare(this.userHistoryDySearch).subscribe(data => {
      //   console.log(data);
      //   if (data) {
      //     // data.forEach(ele => {
      //     //   if (ele._id !== null && ele._id !== '') {
      //     //     labelsArr.push(ele._id);
      //     //     seriesArrA.push(ele.count);
      //     //   }
      //     // });

      //     this.selectMonthYearArray.forEach(ele => {
      //       //labelsArr.push(ele.month);
      //       let countUser1 = 0;
      //       let countUser2 = 0;
      //       let countUser3 = 0;
      //       let countUser4 = 0;
      //       let countUser5 = 0;
      //       if (data[0] !== undefined) {
      //         data[0].forEach(ele1 => {
      //           if (ele.year === ele1._id.year) {
      //             if (ele.monthNo === ele1._id.month) {
      //               countUser1 = ele1.count;
      //             }
      //           }
      //         });
      //       }
      //       if (data[1] !== undefined) {
      //         data[1].forEach(ele1 => {
      //           if (ele.year === ele1._id.year) {
      //             if (ele.monthNo === ele1._id.month) {
      //               countUser2 = ele1.count;
      //             }
      //           }
      //         });
      //       }
      //       if (data[2] !== undefined) {
      //         data[2].forEach(ele1 => {
      //           if (ele.year === ele1._id.year) {
      //             if (ele.monthNo === ele1._id.month) {
      //               countUser3 = ele1.count;
      //             }
      //           }
      //         });
      //       }
      //       if (data[3] !== undefined) {
      //         data[3].forEach(ele1 => {
      //           if (ele.year === ele1._id.year) {
      //             if (ele.monthNo === ele1._id.month) {
      //               countUser4 = ele1.count;
      //             }
      //           }
      //         });
      //       }
      //       if (data[4] !== undefined) {
      //         data[4].forEach(ele1 => {
      //           if (ele.year === ele1._id.year) {
      //             if (ele.monthNo === ele1._id.month) {
      //               countUser5 = ele1.count;
      //             }
      //           }
      //         });
      //       }
      //       seriesArrA.push(countUser1);
      //       seriesArrB.push(countUser2);
      //       seriesArrC.push(countUser3);
      //       seriesArrD.push(countUser4);
      //       seriesArrE.push(countUser5);
      //     });
      //     // this.dataDyCompareUserHistory.labels = labelsArr;
      //     this.dataDyCompareUserHistory.series = [seriesArrA, seriesArrB];
      //     if (seriesArrC.length > 0) {
      //        this.dataDyCompareUserHistory.series.push(seriesArrC);
      //     }
      //       if (seriesArrD.length > 0) {
      //        this.dataDyCompareUserHistory.series.push(seriesArrD);
      //     }
      //       if (seriesArrE.length > 0) {
      //        this.dataDyCompareUserHistory.series.push(seriesArrE);
      //     }

      //     console.log(this.dataDyCompareUserHistory);
      //   }
      // });

      if (this.fieldValueModelList[0] !== undefined) {
        this.userHistoryDySearch.searchvalue = [];
         this.userHistoryDySearch.searchvalue = [this.fieldValueModelList[0]];
        this._ReportService.GetUserCountsHistoryDyCompare(this.userHistoryDySearch).subscribe(data => {
          // console.log(data);
          if (data) {
            // data.forEach(ele => {
            //   if (ele._id !== null && ele._id !== '') {
            //     labelsArr.push(ele._id);
            //     seriesArrA.push(ele.count);
            //   }
            // });

            this.selectMonthYearArray.forEach(ele => {
              //labelsArr.push(ele.month);
              let countUser1 = 0;
              // let countUser2 = 0;
              // let countUser3 = 0;
              // let countUser4 = 0;
              // let countUser5 = 0;
              if (data[0] !== undefined) {
                data[0].forEach(ele1 => {
                  if (ele.year === ele1._id.year) {
                    if (ele.monthNo === ele1._id.month) {
                      countUser1 = ele1.count;
                    }
                  }
                });
              }
              // if (data[1] !== undefined) {
              //   data[1].forEach(ele1 => {
              //     if (ele.year === ele1._id.year) {
              //       if (ele.monthNo === ele1._id.month) {
              //         countUser2 = ele1.count;
              //       }
              //     }
              //   });
              // }
              // if (data[2] !== undefined) {
              //   data[2].forEach(ele1 => {
              //     if (ele.year === ele1._id.year) {
              //       if (ele.monthNo === ele1._id.month) {
              //         countUser3 = ele1.count;
              //       }
              //     }
              //   });
              // }
              // if (data[3] !== undefined) {
              //   data[3].forEach(ele1 => {
              //     if (ele.year === ele1._id.year) {
              //       if (ele.monthNo === ele1._id.month) {
              //         countUser4 = ele1.count;
              //       }
              //     }
              //   });
              // }
              // if (data[4] !== undefined) {
              //   data[4].forEach(ele1 => {
              //     if (ele.year === ele1._id.year) {
              //       if (ele.monthNo === ele1._id.month) {
              //         countUser5 = ele1.count;
              //       }
              //     }
              //   });
              // }
              seriesArrA.push(countUser1);
              // seriesArrB.push(countUser2);
              // seriesArrC.push(countUser3);
              // seriesArrD.push(countUser4);
              // seriesArrE.push(countUser5);
            });
            // this.dataDyCompareUserHistory.labels = labelsArr;
            this.dataDyCompareUserHistory.series = [seriesArrA];
           
            // console.log(this.dataDyCompareUserHistory);
          }
        });

      }

      if (this.fieldValueModelList[1] !== undefined) {
        this.userHistoryDySearch.searchvalue = [];
         this.userHistoryDySearch.searchvalue = [this.fieldValueModelList[1]];
        this._ReportService.GetUserCountsHistoryDyCompare(this.userHistoryDySearch).subscribe(data => {
          // console.log(data);
          if (data) {
            // data.forEach(ele => {
            //   if (ele._id !== null && ele._id !== '') {
            //     labelsArr.push(ele._id);
            //     seriesArrA.push(ele.count);
            //   }
            // });

            this.selectMonthYearArray.forEach(ele => {
              //labelsArr.push(ele.month);
              let countUser1 = 0;
              if (data[0] !== undefined) {
                data[0].forEach(ele1 => {
                  if (ele.year === ele1._id.year) {
                    if (ele.monthNo === ele1._id.month) {
                      countUser1 = ele1.count;
                    }
                  }
                });
              }
             
               seriesArrB.push(countUser1);
             
            });
            // this.dataDyCompareUserHistory.labels = labelsArr;
            this.dataDyCompareUserHistory.series.push(seriesArrB);
            //console.log(this.dataDyCompareUserHistory);
          }
        });

      }

      if (this.fieldValueModelList[2] !== undefined) {
        this.userHistoryDySearch.searchvalue = [];
         this.userHistoryDySearch.searchvalue = [this.fieldValueModelList[2]];
        this._ReportService.GetUserCountsHistoryDyCompare(this.userHistoryDySearch).subscribe(data => {
          // console.log(data);
          if (data) {
           
            this.selectMonthYearArray.forEach(ele => {
              //labelsArr.push(ele.month);
              let countUser1 = 0;
            
              if (data[0] !== undefined) {
                data[0].forEach(ele1 => {
                  if (ele.year === ele1._id.year) {
                    if (ele.monthNo === ele1._id.month) {
                      countUser1 = ele1.count;
                    }
                  }
                });
              }
              seriesArrC.push(countUser1);
             
            });
            // this.dataDyCompareUserHistory.labels = labelsArr;
              this.dataDyCompareUserHistory.series.push(seriesArrC);
            // console.log(this.dataDyCompareUserHistory);
          }
        });

      }

      if (this.fieldValueModelList[3] !== undefined) {
        this.userHistoryDySearch.searchvalue = [];
         this.userHistoryDySearch.searchvalue = [this.fieldValueModelList[3]];
        this._ReportService.GetUserCountsHistoryDyCompare(this.userHistoryDySearch).subscribe(data => {
          // console.log(data);
          if (data) {
            
            this.selectMonthYearArray.forEach(ele => {
              //labelsArr.push(ele.month);
              let countUser1 = 0;
             
              if (data[0] !== undefined) {
                data[0].forEach(ele1 => {
                  if (ele.year === ele1._id.year) {
                    if (ele.monthNo === ele1._id.month) {
                      countUser1 = ele1.count;
                    }
                  }
                });
              }
            
               seriesArrD.push(countUser1);
            });
              this.dataDyCompareUserHistory.series.push(seriesArrD);
            // console.log(this.dataDyCompareUserHistory);
          }
        });

      }

      if (this.fieldValueModelList[4] !== undefined) {
        this.userHistoryDySearch.searchvalue = [];
         this.userHistoryDySearch.searchvalue = [this.fieldValueModelList[4]];
        this._ReportService.GetUserCountsHistoryDyCompare(this.userHistoryDySearch).subscribe(data => {
          // console.log(data);
          if (data) {
           
            this.selectMonthYearArray.forEach(ele => {
              //labelsArr.push(ele.month);
              let countUser1 = 0;
              
              if (data[0] !== undefined) {
                data[0].forEach(ele1 => {
                  if (ele.year === ele1._id.year) {
                    if (ele.monthNo === ele1._id.month) {
                      countUser1 = ele1.count;
                    }
                  }
                });
              }
             
               seriesArrE.push(countUser1);
            });
              this.dataDyCompareUserHistory.series.push(seriesArrE);
            // console.log(this.dataDyCompareUserHistory);
          }
        });

      }
      
      this.userHistoryDySearch.searchvalue = this.fieldValueModelList;

      this._ReportService.GetUserCountsHistoryDyCompareGrid(this.userHistoryDySearch).subscribe(data1 => {
        this.adminlist = [];
        this.provinceLists = [];
        this.districtLists = [];
        this.areaLists = [];
        // console.log(data1);
        data1.forEach(element1 => {
          element1.forEach(element => {
            this.adminlist.push({
              fullname: element.person.fullname,
              province: element.person.province,
              district: element.person.district,
              area: element.person.area,
            });

            let ispfn = false;
            this.tempfulnameList.forEach(ele6 => {
              if (ele6 === element.person.fullname) {
                ispfn = true;
              }
            });

            if (ispfn) {
            } else {
              this.tempfulnameList.push(element.person.fullname);
            }


            let isppr = false;
            this.tempprovinceList.forEach(ele6 => {

              if (ele6 === element.person.province) {
                isppr = true;
              }
            });

            if (isppr) {
            } else {
              this.tempprovinceList.push(element.person.province);
            }

            let isd = false;
            this.tempdistrictList.forEach(ele6 => {
              if (ele6 === element.person.district) {
                isd = true;
              }
            });

            if (isd) {
            } else {
              this.tempdistrictList.push(element.person.district);
            }

            let isa = false;
            this.tempareaList.forEach(ele6 => {
              if (ele6 === element.person.area) {
                isa = true;
              }
            });

            if (isa) {
            } else {
              this.tempareaList.push(element.person.area);
            }


          });
          // console.log(this.fullnameLists);

        });

        this.tempfulnameList.forEach(ele6 => {
          this.fullnameLists.push({ label: ele6, value: ele6 });
        });
        this.tempprovinceList.forEach(ele6 => {
          this.provinceLists.push({ label: ele6, value: ele6 });
        });
        this.tempdistrictList.forEach(ele6 => {
          this.districtLists.push({ label: ele6, value: ele6 });
        });
        this.tempareaList.forEach(ele6 => {
          this.areaLists.push({ label: ele6, value: ele6 });
        });

        //   this.districtLists = this.districtLists.filter(function (x, i, a) {
        //     return a.indexOf(x) === i;
        //   });
        //   this.areaLists = this.areaLists.filter(function (x, i, a) {
        //     return a.indexOf(x) === i;
        //   });

      });


      setTimeout(() => {
        this.showSpinner = false;
        this.showGenDyCompareReport = true;
      }, 900);
    } else {
      this.showGenDyCompareReport = false;
      this.msgs = [];
      this.msgs.push({ severity: 'warn', summary: 'Warn Message', detail: 'please select Field & FieldValue' });
    }

    // this.dataDyCompareUserHistory.series = [
    //   [15, 54, 43, 107, 65, 127, 87, 62, 98, 100, 125, 200],
    //   [13, 22, 52, 62, 104, 76, 54, 96, 107, 148, 180, 190],
    // ];
    // this.showGenDyCompareReport = true;
  }

  genrateReportForCompare() {
    if (this.compareTwo === 'Province') {
      if (this.firstProvince !== '' && this.secondProvince !== '') {

        let labelsArr: string[] = [];
        let seriesArrA: number[] = [];
        let seriesArrB: number[] = [];
        let seriesArrC: number[] = [];
        let seriesArrD: number[] = [];
        let seriesArrAP: number[] = [];
        let seriesArrBP: number[] = [];
        let settingCountA: number = 0;
        let settingCountB: number = 0;

        this._Settings.GetAllSetting().subscribe(data1 => {
          if (data1 !== null) {
            if (data1.noOfUserInProvince !== null) {
              this.provinceCountSettingsList = data1.noOfUserInProvince;

              this.provinceCountSettingsList.forEach(ele3 => {
                if (ele3.province === this.firstProvince) {
                  settingCountA = ele3.count;
                }
                if (ele3.province === this.secondProvince) {
                  settingCountB = ele3.count;
                }
              });
            }
          }
        });

        this._ReportService.GetUserCountsHistoryProvince(this.firstProvince).subscribe(data => {
          if (data !== null) {
            this.compareUserHistoryDataA = data;
            // let abc: any[] = this._ReportService.loadLastMonthsArray(2017, 4);
            // console.log(abc);
            this.selectMonthYearArray.forEach(ele => {
              labelsArr.push(ele.month);
              let countUser = 0;
              this.compareUserHistoryDataA.forEach(ele1 => {
                if (ele.year === ele1._id.year) {
                  if (ele.monthNo === ele1._id.month) {
                    countUser = ele1.count;
                  }
                }
              });
              seriesArrA.push(countUser);
              seriesArrC.push(settingCountA);
            });
            
          }

        });

        this._ReportService.GetUserCountsHistoryProvince(this.secondProvince).subscribe(data => {
          if (data !== null) {
            this.compareUserHistoryDataB = data;
           
            this.selectMonthYearArray.forEach(ele => {
              // labelsArr.push(ele.month);
              let countUser = 0;
              this.compareUserHistoryDataB.forEach(ele1 => {
                if (ele.year === ele1._id.year) {
                  if (ele.monthNo === ele1._id.month) {
                    countUser = ele1.count;
                  }
                }
              });
              seriesArrB.push(countUser);
              seriesArrD.push(settingCountB);
            });
           
          }

        });

        this._ReportService.GetUserPointsHistoryProvince(this.firstProvince).subscribe(data => {
          if (data !== null) {
            this.comparePointHistoryDataA = data;
           
            this.selectMonthYearArray.forEach(ele => {
              // labelsArr.push(ele.month);
              let countPoint = 0;
              this.comparePointHistoryDataA.forEach(ele1 => {
                if (ele.year === ele1._id.year) {
                  if (ele.monthNo === ele1._id.month) {
                    countPoint = ele1.count;
                  }
                }
              });
              seriesArrAP.push(countPoint);
            });
           
          }

        });
        this._ReportService.GetUserPointsHistoryProvince(this.secondProvince).subscribe(data => {
          if (data !== null) {
            this.comparePointHistoryDataB = data;
           
            this.selectMonthYearArray.forEach(ele => {
              // labelsArr.push(ele.month);
              let countPoint = 0;
              this.comparePointHistoryDataB.forEach(ele1 => {
                if (ele.year === ele1._id.year) {
                  if (ele.monthNo === ele1._id.month) {
                    countPoint = ele1.count;
                  }
                }
              });
              seriesArrBP.push(countPoint);

            });
           
          }

        });

        // this.dataComparePointHistory.labels = [];
        //this.dataComparePointHistory.series = [];
       
        this.dataComparePointHistory.series = [seriesArrAP];
        // this.dataComparePointHistory.series[0] = seriesArrA;
        this.dataComparePointHistory.series.push(seriesArrBP);

        this.dataCompareUserHistory.series = [seriesArrA];
        // this.dataCompareUserHistory.series[0] = seriesArrA;
        this.dataCompareUserHistory.series.push(seriesArrB);

        // this.dataCompareResultHistory.labels = [];
        // this.dataCompareResultHistory.series = [];
        // this.dataCompareResultHistory.labels = labelsArr;
        this.dataCompareResultHistory.series = [seriesArrA];
        // this.dataCompareResultHistory.series[0] = seriesArrA;
        this.dataCompareResultHistory.series.push(seriesArrB);
        this.dataCompareResultHistory.series.push(seriesArrC);
        this.dataCompareResultHistory.series.push(seriesArrD);

        setTimeout(() => {
          this.showGenCompareReport = true;
        }, 500);

      } else {
        this.showGenCompareReport = false;
        // alert('please select Province to Compare');
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: 'Warn Message', detail: 'please select Province to Compare' });
      }

    } else if (this.compareTwo === 'District') {
      if (this.firstDistrict !== '' && this.secondDistrict !== '') {

        let labelsArr: string[] = [];
        let seriesArrA: number[] = [];
        let seriesArrB: number[] = [];
        let seriesArrC: number[] = [];
        let seriesArrD: number[] = [];
        let seriesArrAP: number[] = [];
        let seriesArrBP: number[] = [];
        let settingCountA: number = 0;
        let settingCountB: number = 0;

        this._Settings.GetAllSetting().subscribe(data1 => {
          if (data1 !== null) {
            if (data1.noOfUserInProvince !== null) {
              this.districtCountSettingsList = data1.noOfUserInDistrict;

              this.districtCountSettingsList.forEach(ele3 => {
                if (ele3.district === this.firstDistrict) {
                  settingCountA = ele3.count;
                }
                if (ele3.district === this.secondDistrict) {
                  settingCountB = ele3.count;
                }
              });
            }
          }
        });

        this._ReportService.GetUserCountsHistoryDistrict(this.firstDistrict).subscribe(data => {
          if (data !== null) {
            this.compareUserHistoryDataA = data;
            // let abc: any[] = this._ReportService.loadLastMonthsArray(2017, 4);
            // console.log(abc);
            this.selectMonthYearArray.forEach(ele => {
              labelsArr.push(ele.month);
              let countUser = 0;
              this.compareUserHistoryDataA.forEach(ele1 => {
                if (ele.year === ele1._id.year) {
                  if (ele.monthNo === ele1._id.month) {
                    countUser = ele1.count;
                  }
                }
              });
              seriesArrA.push(countUser);
              seriesArrC.push(settingCountA);
            });
           
          }

        });

        this._ReportService.GetUserCountsHistoryDistrict(this.secondDistrict).subscribe(data => {
          if (data !== null) {
            this.compareUserHistoryDataB = data;
          
            this.selectMonthYearArray.forEach(ele => {
              // labelsArr.push(ele.month);
              let countUser = 0;
              this.compareUserHistoryDataB.forEach(ele1 => {
                if (ele.year === ele1._id.year) {
                  if (ele.monthNo === ele1._id.month) {
                    countUser = ele1.count;
                  }
                }
              });
              seriesArrB.push(countUser);
              seriesArrD.push(settingCountB);
            });
           
          }

        });

        this._ReportService.GetUserPointsHistoryDistrict(this.firstDistrict).subscribe(data => {
          if (data !== null) {
            this.comparePointHistoryDataA = data;
           
            this.selectMonthYearArray.forEach(ele => {
              // labelsArr.push(ele.month);
              let countPoint = 0;
              this.comparePointHistoryDataA.forEach(ele1 => {
                if (ele.year === ele1._id.year) {
                  if (ele.monthNo === ele1._id.month) {
                    countPoint = ele1.count;
                  }
                }
              });
              seriesArrAP.push(countPoint);
            });
          
          }

        });
        this._ReportService.GetUserPointsHistoryDistrict(this.secondDistrict).subscribe(data => {
          if (data !== null) {
            this.comparePointHistoryDataB = data;
           
            this.selectMonthYearArray.forEach(ele => {
              // labelsArr.push(ele.month);
              let countPoint = 0;
              this.comparePointHistoryDataB.forEach(ele1 => {
                if (ele.year === ele1._id.year) {
                  if (ele.monthNo === ele1._id.month) {
                    countPoint = ele1.count;
                  }
                }
              });
              seriesArrBP.push(countPoint);

            });
          
          }

        });


        // this.dataComparePointHistory = {
        //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        //   series: [
        //     [15, 24, 43, 27, 5, 10, 23, 44, 68, 100, 26, 8],
        //     [13, 22, 49, 22, 4, 6, 24, 46, 57, 148, 22, 4],
        //   ],
        // };

        // this.dataComparePointHistory.labels = [];
        this.dataComparePointHistory.series = [];
        // this.dataComparePointHistory.labels = labelsArr;
        this.dataComparePointHistory.series = [seriesArrAP];
        // this.dataComparePointHistory.series[0] = seriesArrA;
        this.dataComparePointHistory.series.push(seriesArrBP);

        // this.dataCompareUserHistory = {
        //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        //   series: [
        //     //  [20, 30, 60, 70, 80, 90, 100, 120, 125, 130, 133, 140],
        //     //  [13, 25, 30, 50, 64, 70, 80, 90, 95, 105, 120, 135],
        //     [5, 20, 30, 40, 60, 75, 85, 95, 98, 100, 115, 125],
        //     [4, 25, 35, 45, 55, 88, 105, 120, 130, 135, 140, 155],
        //   ],
        // };
        // this.dataCompareUserHistory.labels = [];
        this.dataCompareUserHistory.series = [];
        // this.dataCompareUserHistory.labels = labelsArr;
        this.dataCompareUserHistory.series = [seriesArrA];
        // this.dataCompareUserHistory.series[0] = seriesArrA;
        this.dataCompareUserHistory.series.push(seriesArrB);
        // this.dataCompareResultHistory = {
        //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        //   series: [
        //     [5, 20, 30, 40, 60, 75, 85, 95, 98, 100, 115, 125],
        //     [4, 25, 35, 45, 55, 88, 105, 120, 130, 135, 140, 155],
        //     [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
        //     [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
        //   ],
        // };
        // this.dataCompareResultHistory.labels = [];
        this.dataCompareResultHistory.series = [];
        // this.dataCompareResultHistory.labels = labelsArr;
        this.dataCompareResultHistory.series = [seriesArrA];
        // this.dataCompareResultHistory.series[0] = seriesArrA;
        this.dataCompareResultHistory.series.push(seriesArrB);
        this.dataCompareResultHistory.series.push(seriesArrC);
        this.dataCompareResultHistory.series.push(seriesArrD);


        setTimeout(() => {
          this.showGenCompareReport = true;
        }, 500);
      } else {
        this.showGenCompareReport = false;
        //alert('please select District to Compare');
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: 'Warn Message', detail: 'please select District to Compare' });
      }
    }

  }
  genrateReportForSelect() {
    //this.showGenSelectReport = true;


    if (this.selectType === 'Province') {
      if (this.selectProvince !== '') {
        let labelsArr: string[] = [];
        let seriesArrA: number[] = [];
        let seriesArrB: number[] = [];
        let seriesArrAP: number[] = [];
        let settingCount: number = 0;

        this._Settings.GetAllSetting().subscribe(data1 => {
          if (data1 !== null) {
            if (data1.noOfUserInProvince !== null) {
              this.provinceCountSettingsList = data1.noOfUserInProvince;

              this.provinceCountSettingsList.forEach(ele3 => {
                if (ele3.province === this.selectProvince) {
                  settingCount = ele3.count;
                }
              });
            }
          }
        });

        this._ReportService.GetUserCountsHistoryProvince(this.selectProvince).subscribe(data => {
          if (data !== null) {
            this.selectUserHistoryData = data;
          
            this.selectMonthYearArray.forEach(ele => {
              labelsArr.push(ele.month);
              let countUser = 0;
              this.selectUserHistoryData.forEach(ele1 => {
                if (ele.year === ele1._id.year) {
                  if (ele.monthNo === ele1._id.month) {
                    countUser = ele1.count;
                  }
                }
              });
              seriesArrA.push(countUser);
              seriesArrB.push(settingCount);
            });

          }

        });

        this._ReportService.GetUserPointsHistoryProvince(this.selectProvince).subscribe(data => {
          if (data !== null) {
            this.comparePointHistoryDataA = data;
          
            this.selectMonthYearArray.forEach(ele => {
              // labelsArr.push(ele.month);
              let countPoint = 0;
              this.comparePointHistoryDataA.forEach(ele1 => {
                if (ele.year === ele1._id.year) {
                  if (ele.monthNo === ele1._id.month) {
                    countPoint = ele1.count;
                  }
                }
              });
              seriesArrAP.push(countPoint);
            });
          
          }

        });


        // this.dataSelectPointHistory = {
        //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        //   series: [
        //     [15, 24, 43, 27, 5, 10, 23, 44, 68, 100, 26, 8],
        //   ],
        // };

        // this.dataSelectPointHistory.labels = [];
        this.dataSelectPointHistory.series = [];
        // this.dataSelectPointHistory.labels = labelsArr;
        this.dataSelectPointHistory.series = [seriesArrAP];
       
        // this.dataSelectUserHistory = {
        //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        //   series: [
        //     // [20, 30, 60, 70, 80, 90, 100, 120, 125, 130, 133, 140],
        //     [5, 20, 30, 40, 60, 75, 85, 95, 98, 100, 115, 125],
        //   ],
        // };

        // this.dataSelectUserHistory.labels = [];
        this.dataSelectUserHistory.series = [];
        // this.dataSelectUserHistory.labels = labelsArr;
        this.dataSelectUserHistory.series = [seriesArrA];

        // this.dataSelectResultHistory = {
        //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        //   series: [
        //     [5, 20, 30, 40, 60, 75, 85, 95, 98, 100, 115, 125],
        //     [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
        //   ],
        // };

        // this.dataSelectResultHistory.labels = [];
        this.dataSelectResultHistory.series = [];
        // this.dataSelectResultHistory.labels = labelsArr;
        this.dataSelectResultHistory.series = [seriesArrA];
        this.dataSelectResultHistory.series.push(seriesArrB);


        setTimeout(() => {
          this.showGenSelectReport = true;
        }, 500);

      } else {
        this.showGenSelectReport = false;
        //alert('please select Province to Compare');
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: 'Warn Message', detail: 'please select Province' });
      }

    } else if (this.selectType === 'District') {
      if (this.selectDistrict !== '') {

        let labelsArr: string[] = [];
        let seriesArrA: number[] = [];
        let seriesArrB: number[] = [];
        let seriesArrAP: number[] = [];
        let settingCount: number = 0;

        this._Settings.GetAllSetting().subscribe(data1 => {
          if (data1 !== null) {
            if (data1.noOfUserInProvince !== null) {
              this.districtCountSettingsList = data1.noOfUserInDistrict;

              this.districtCountSettingsList.forEach(ele3 => {
                if (ele3.district === this.selectDistrict) {
                  settingCount = ele3.count;
                }
              });
            }
          }
        });

        this._ReportService.GetUserCountsHistoryDistrict(this.selectDistrict).subscribe(data => {
          if (data !== null) {
            this.selectUserHistoryData = data;
          
            this.selectMonthYearArray.forEach(ele => {
              labelsArr.push(ele.month);
              let countUser = 0;
              this.selectUserHistoryData.forEach(ele1 => {
                if (ele.year === ele1._id.year) {
                  if (ele.monthNo === ele1._id.month) {
                    countUser = ele1.count;
                  }
                }
              });
              seriesArrA.push(countUser);
              seriesArrB.push(settingCount);
            });

          }

        });

        this._ReportService.GetUserPointsHistoryDistrict(this.selectDistrict).subscribe(data => {
          if (data !== null) {
            this.comparePointHistoryDataA = data;
        
            this.selectMonthYearArray.forEach(ele => {
              // labelsArr.push(ele.month);
              let countPoint = 0;
              this.comparePointHistoryDataA.forEach(ele1 => {
                if (ele.year === ele1._id.year) {
                  if (ele.monthNo === ele1._id.month) {
                    countPoint = ele1.count;
                  }
                }
              });
              seriesArrAP.push(countPoint);
            });
         
          }

        });

        // this.dataSelectPointHistory = {
        //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        //   series: [
        //     [15, 24, 43, 27, 5, 10, 23, 44, 68, 100, 26, 8],
        //   ],
        // };

        // this.dataSelectPointHistory.labels = [];
        this.dataSelectPointHistory.series = [];
        // this.dataSelectPointHistory.labels = labelsArr;
        this.dataSelectPointHistory.series = [seriesArrAP];
        // this.dataSelectPointHistory.series[0] = seriesArrA;

        // this.dataSelectUserHistory = {
        //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        //   series: [
        //     // [20, 30, 60, 70, 80, 90, 100, 120, 125, 130, 133, 140],
        //     [5, 20, 30, 40, 60, 75, 85, 95, 98, 100, 115, 125],
        //   ],
        // };

        // this.dataSelectUserHistory.labels = [];
        this.dataSelectUserHistory.series = [];
        // this.dataSelectUserHistory.labels = labelsArr;
        this.dataSelectUserHistory.series = [seriesArrA];

        // this.dataSelectResultHistory = {
        //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        //   series: [
        //     [5, 20, 30, 40, 60, 75, 85, 95, 98, 100, 115, 125],
        //     [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
        //   ],
        // };

        // this.dataSelectResultHistory.labels = [];
        this.dataSelectResultHistory.series = [];
        // this.dataSelectResultHistory.labels = labelsArr;
        this.dataSelectResultHistory.series = [seriesArrA];
        this.dataSelectResultHistory.series.push(seriesArrB);


        setTimeout(() => {
          this.showGenSelectReport = true;
        }, 500);
      } else {
        this.showGenSelectReport = false;
        //alert('please select District to Compare');
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: 'Warn Message', detail: 'please select District' });
      }
    }

  }

  resetAllCharts() {
    this.dataComparePointHistory = {
      labels: this.defaultLabelArr,
      series: [this.defaultseriesArr],
    };
    this.dataCompareUserHistory = {
      labels: this.defaultLabelArr,
      series: [this.defaultseriesArr],
    };
    this.dataCompareResultHistory = {
      labels: this.defaultLabelArr,
      series: [this.defaultseriesArr],
    };
    this.dataSelectPointHistory = {
      labels: this.defaultLabelArr,
      series: [this.defaultseriesArr],
    };
    this.dataSelectUserHistory = {
      labels: this.defaultLabelArr,
      series: [this.defaultseriesArr],
    };
    this.dataSelectResultHistory = {
      labels: this.defaultLabelArr,
      series: [this.defaultseriesArr],
    };
  }

  getResponsive(padding, offset) {
    return this._chartistJsService.getResponsive(padding, offset);
  }
}
