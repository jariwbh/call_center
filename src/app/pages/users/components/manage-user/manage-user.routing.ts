import { Routes, RouterModule } from '@angular/router';
import { ManageUserComponent } from './manage-user.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  { path: '', component: ManageUserComponent },
  { path: 'lists', component: ManageUserComponent },
  { path: 'lists/:msg', component: ManageUserComponent },
];

export const routing = RouterModule.forChild(routes);
