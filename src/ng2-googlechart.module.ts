import { NgModule } from '@angular/core';
import { ChartDirective } from "./ng2-googlechart.directive";
import { ComboChartDirective } from "./ng2-googlechart-combo.directive";
import { ChartWrapperDirective } from "./ng2-googlechart-wrapper.directive";

import {ChartService} from './ng2-googlechart.service';
@NgModule({
    declarations: [
      ChartDirective,
      ComboChartDirective,ChartWrapperDirective
    ],providers:[ChartService],
    exports: [
      ChartDirective,
      ComboChartDirective,ChartWrapperDirective
    ]
})
export class Ng2GoogleChartModule {
}
