import { Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {CreatorComponent} from "./pages/creator/creator.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'creator', component: CreatorComponent },
  { path: '**', redirectTo: '' }
];
