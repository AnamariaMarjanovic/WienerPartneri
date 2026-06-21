import { Routes } from '@angular/router';
import { PartnerList } from './components/partner-list/partner-list';
import { PartnerForm } from './components/partner-form/partner-form';

export const routes: Routes = [
  { path: '', component: PartnerList },
  { path: 'partner/new', component: PartnerForm },
  { path: '**', redirectTo: '' },
];
