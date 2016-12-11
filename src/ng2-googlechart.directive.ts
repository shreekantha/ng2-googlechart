/**
*      This directive will draw a chart from the array of records provided
*
**/
import {Directive, ElementRef, Input, OnInit} from "@angular/core";

@Directive({
    selector: "chart",
})
export class ChartDirective implements OnInit {
    el: HTMLElement;
    w: any;  // To store the window, without generating errors in typescript on window.google
    @Input() data: any[];
    @Input() rowlabels: any[];
    @Input() columnlabels: any[];
    @Input() options: any;
    @Input() charttype: any;
    @Input() isrole: boolean;
    @Input() roledata: any[];
    @Input() roles: any[];
    constructor(elementRef: ElementRef) {
        this.w = window;
        this.el = elementRef.nativeElement; // You cannot use elementRef directly !
        if (!this.w.google) { console.error("Hey ! It seems the needed google script was not loaded ?"); };
    }
    ngOnInit() {
        this.prepareDataTable();
    }
    private prepareDataTable(): any {
        let dataTable = new this.w.google.visualization.DataTable();
        let tempData: any[] = new Array();
        this.drawChart(dataTable, tempData);
        dataTable.addRows(tempData);
        this.selectChartType(dataTable);
    }
    private drawChart(dataTable: any, tempData: any) {
        if (typeof this.columnlabels !== undefined && typeof this.rowlabels !== undefined && typeof this.data != undefined) {
            for (let c of this.columnlabels) {
                dataTable.addColumn(c.type, c.value);
            }
            if (this.isrole) {
                for (let role of this.roles) {
                    dataTable.addColumn(role);
                }
                for (let index = 0; index < this.data.length; index++) {
                    tempData.push([this.rowlabels[index], this.data[index], this.roledata[index]]);
                }
            } else {
                for (let index = 0; index < this.data.length; index++) {
                    tempData.push([this.rowlabels[index], this.data[index]]);
                }
            }
        }
    }
    private selectChartType(dataTable: any) {
        switch (this.charttype) {
            case "Column":
                (new this.w.google.visualization.ColumnChart(this.el))
                    .draw(dataTable, this.options || {});
                break;
            case "Bar":
                (new this.w.google.visualization.BarChart(this.el))
                    .draw(dataTable, this.options || {});
                break;
            case "Pie":
                (new this.w.google.visualization.PieChart(this.el))
                    .draw(dataTable, this.options || {});
                break;
            case "Donut":
                this.options.pieHole = 0.5;
                (new this.w.google.visualization.PieChart(this.el))
                    .draw(dataTable, this.options || {});
                break;
            case "Line":
                (new this.w.google.visualization.LineChart(this.el))
                    .draw(dataTable, this.options || {});
                break;
            case "Area":
                (new this.w.google.visualization.AreaChart(this.el))
                    .draw(dataTable, this.options || {});
                break;
            case "Geo":
                (new this.w.google.visualization.GeoChart(this.el))
                    .draw(dataTable, this.options || {});
                break;
            case "Histogram":
                (new this.w.google.visualization.Histogram(this.el))
                    .draw(dataTable, this.options || {});
                break;
            default:
                break;
        }

    }
}
