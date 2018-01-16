import { NgModule } from '@angular/core';
import { ChartDirective } from "./ng2-googlechart.directive";
import { ComboChartDirective } from "./ng2-googlechart-combo.directive";

@NgModule({
    declarations: [
      ChartDirective,
      ComboChartDirective
    ],
    exports: [
      ChartDirective,
      ComboChartDirective
    ]
})
export class Ng2GoogleChartModule {
}
