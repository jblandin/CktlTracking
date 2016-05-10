import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject,
} from '@angular/core/testing';
import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {MestempsComponent} from './mestemps.component';
import {TrackingService} from '../shared';
import {HTTP_PROVIDERS} from '@angular/http';

describe('Component: Mestemps', () => {
  let builder: TestComponentBuilder;

  beforeEachProviders(() => [HTTP_PROVIDERS, MestempsComponent, TrackingService]);
  beforeEach(
      inject([TestComponentBuilder], function(tcb: TestComponentBuilder) { builder = tcb; }));

  it('should inject the component', inject([MestempsComponent], (component: MestempsComponent) => {
       expect(component).toBeTruthy();
     }));

  it('should create the component', inject([], () => {
       return builder.createAsync(MestempsComponentTestController)
           .then((fixture: ComponentFixture<any>) => {
             let query = fixture.debugElement.query(By.directive(MestempsComponent));
             expect(query).toBeTruthy();
             expect(query.componentInstance).toBeTruthy();
           });
     }));
});

@Component({
  selector: 'test',
  template: `
    <app-mestemps></app-mestemps>
  `,
  directives: [MestempsComponent]
})
class MestempsComponentTestController {
}
