
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../../../theme/nga.module';

import { routing } from './chartistJs.routing';
import { ChartistJsComponent } from './chartistJs.component';
import { ChartistJsService } from './chartistJs.service';
import { ReportService } from './../../../../core/services/report/report.service';
import { FieldsService } from './../../../../core/services/dynamic-fields/fields.service';

import { AppTranslationModule } from '../../../../app.translation.module';
import { GrowlModule } from 'primeng/primeng';

import { MultiSelectModule } from 'primeng/primeng';

import { DataTableModule, SharedModule } from 'primeng/primeng';

import { SliderModule, DropdownModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    AppTranslationModule,
    FormsModule,
    NgaModule,
    routing,
    GrowlModule,
    MultiSelectModule,
    DataTableModule,
    SharedModule,
    SliderModule,
    DropdownModule,
  ],
  declarations: [
    ChartistJsComponent,
  ],
  providers: [
    ChartistJsService,
    ReportService,
    FieldsService,
  ],
})
export class ChartistJsModule {}
