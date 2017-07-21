import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../../../theme/nga.module';

import { routing } from './manage-people.routing';
import { ManagePeopleComponent } from './manage-people.component';

import { AppTranslationModule } from '../../../../app.translation.module';
import { DataTableModule, SharedModule } from 'primeng/primeng';

import { FieldsService } from '../../../../core/services/dynamic-fields/fields.service';
import { ManagepeopleService } from '../../../../core/services/people/manage-people.service';
import { GrowlModule } from 'primeng/primeng';

import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { PagerService } from '../../../../core/services/common/pager.service';


@NgModule({
  imports: [
    CommonModule,
    AppTranslationModule,
    FormsModule,
    NgaModule,
    routing,
    DataTableModule,
    SharedModule,
    GrowlModule,
    ConfirmDialogModule,
  ],
  declarations: [
    ManagePeopleComponent,
  ],
  providers: [
    ManagepeopleService,
    FieldsService,
    ConfirmationService,
    PagerService,
  ],
})
export class ManagePeopleModule {}
