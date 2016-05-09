import {Component} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {MestempsComponent} from './+mestemps';
import {Routes, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router';
import {TrackingService} from './shared'

@Component({
  moduleId: module.id, selector: 'cktl-tracking-app', templateUrl: 'cktl-tracking.component.html',
      styleUrls:['cktl-tracking.component.css'], directives:[ROUTER_DIRECTIVES],
      providers:[ROUTER_PROVIDERS, HTTP_PROVIDERS, TrackingService]
})
@Routes([{path: '/mestemps', component: MestempsComponent}])
export class CktlTrackingAppComponent {
  title = 'cktl-tracking works!';
}
