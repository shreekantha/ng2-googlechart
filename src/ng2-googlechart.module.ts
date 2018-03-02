import { NgModule } from '@angular/core';
import { ChartDirective } from "./ng2-googlechart.directive";
import { ComboChartDirective } from "./ng2-googlechart-combo.directive";
import { GoogleChartDirective } from "./ng2-googlechart-wrapper.directive";
import {ChartLoaderService } from './ng2-googlechart.service';
@NgModule({
  declarations: [
    ChartDirective,
    ComboChartDirective, GoogleChartDirective
  ], providers: [ChartLoaderService],
  exports: [
    ChartDirective,
    ComboChartDirective, GoogleChartDirective
  ]
})
export class Ng2GoogleChartModule {
}
