/**
*      This directive will draw a chart from the array of records provided
*
**/
import { Directive, ElementRef, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { ChartLoaderService } from './ng2-googlechart.service';
import { Observable } from 'rxjs/Observable';
var chartLoaded;
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
    @Output() onmouseover = new EventEmitter();
    @Output() onmouseout = new EventEmitter();
    constructor(elementRef: ElementRef, private chartLoaderService: ChartLoaderService) {
        this.w = window;
        this.el = elementRef.nativeElement; // You cannot use elementRef directly !
    }
    ngOnInit() {
        this.loadChartPackages().subscribe(loaded => {
            this.prepareDataTable();
            this.w.onresize = () => {
                this.prepareDataTable();
            };
        }, error => {
            console.error('Error in loading Google chart packages');
        });
    }
    /**
    * loadChart() method is called to load google chart packages
    */
    private loadChartPackages(): Observable<any> {
        return Observable.create(observer => {
            this.w = window;
            if (!chartLoaded) {
                chartLoaded = true;
                this.w.onload = () => {
                    this.w.google.charts.load('current', { packages: ['corechart'] });
                };
            }
            setTimeout(() => {
                observer.next();
                observer.complete();
            }, 1000);
        });
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
        this.w.google.visualization.events.addListener(chart, 'onmouseover', (e) => {
            if (e.row != null) {
                var item = new EventData();
                item.row = e.row;
                item.column = dataTable.getValue(e.row, 0);
                this.onmouseover.next(item);
            }

        });
        this.w.google.visualization.events.addListener(chart, 'onmouseout', (e) => {
            if (e.row != null) {
                var item = new EventData();
                item.row = e.row;
                item.column = dataTable.getValue(e.row, 0);
                this.onmouseout.next(item);
            }
        });

    }
}
export class EventData {
    row: any;
    column: any;
}
