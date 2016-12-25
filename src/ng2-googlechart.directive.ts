/**
*      This directive will draw a chart from the array of records provided
*
**/
import {Directive, ElementRef, Input, Output, EventEmitter, OnInit} from "@angular/core";

@Directive({
    selector: "div[chart]",
    exportAs: 'chart'
})
export class ChartDirective implements OnInit {
    el: HTMLElement;
    w: any;  // To store the window, without generating errors in typescript on window.google
    @Input() data: any[];
    @Input() labels: any[];
    @Input() columnTypes: any[];
    @Input() options: any;
    @Input() chartType: any;
    @Input() isRole: boolean;
    @Input() roleData: any[];
    @Input() roles: any[];
    @Output() select = new EventEmitter();
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
        if (typeof this.columnTypes !== undefined && typeof this.labels !== undefined && typeof this.data != undefined) {
            for (let c of this.columnTypes) {
                dataTable.addColumn(c.type, c.value);
            }
            if (this.isRole) {
                for (let role of this.roles) {
                    dataTable.addColumn(role);
                }
                for (let index = 0; index < this.data.length; index++) {
                    tempData.push([this.labels[index], this.data[index], this.roleData[index]]);
                }
            } else {
                for (let index = 0; index < this.data.length; index++) {
                    tempData.push([this.labels[index], this.data[index]]);
                }
            }
        }
    }
    private selectChartType(dataTable: any) {
        let chart;
        switch (this.chartType) {
            case "Column":
                chart = (new this.w.google.visualization.ColumnChart(this.el));

                break;
            case "Bar":
                chart = (new this.w.google.visualization.BarChart(this.el));

                break;
            case "Pie":
                chart = (new this.w.google.visualization.PieChart(this.el));

                break;
            case "Donut":
                this.options.pieHole = 0.5;
                chart = (new this.w.google.visualization.PieChart(this.el));

                break;
            case "Line":
                chart = (new this.w.google.visualization.LineChart(this.el));

                break;
            case "Area":
                chart = (new this.w.google.visualization.AreaChart(this.el));

                break;
            case "Geo":
                chart = (new this.w.google.visualization.GeoChart(this.el));

                break;
            case "Histogram":
                chart = (new this.w.google.visualization.Histogram(this.el));

                break;
            default:
                break;
        }
        chart.draw(dataTable, this.options || {});
        this.w.google.visualization.events.addListener(chart, 'select', () => {

            var selectedData = chart.getSelection();
            var row, item;
            if (selectedData[0]) {
                row = selectedData[0].row;
                item = dataTable.getValue(row, 0);
                this.select.next(item);
            }
            return this.select.next;

        });

    }
}
