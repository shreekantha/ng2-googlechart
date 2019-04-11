/**
*      This directive will draw a chart from the array of records provided
*
**/
import { Directive, ElementRef, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import {ChartLoaderService} from './ng2-googlechart.service';
var chartLoaded;
@Directive({
    selector: "div[chart]",
    exportAs: 'chart'
})
export class ChartDirective implements OnInit {
    el: HTMLElement;
    w: any;  
  // To store the window, without generating errors in typescript on window.google
    @Input() data: any[];
    @Input() labels: any[];
    @Input() columnTypes: any[];
    @Input() options: any;
    @Input() chartType: any;
    @Input() isRole: boolean;
    @Input() roleData: any[];
    @Input() roles: any[];
    @Input() columnSelection: boolean;
    @Output() select = new EventEmitter();
    @Output() selectchart = new EventEmitter();
    @Output() onmouseover = new EventEmitter();
    @Output() onmouseout = new EventEmitter();
    constructor(elementRef: ElementRef,private chartLoaderService:ChartLoaderService) {
        this.w = window;
        this.el = elementRef.nativeElement; // You cannot use elementRef directly !
       
        
    }
    ngOnInit() {
         this.chartLoaderService.loadLoader().subscribe(googlecha=>{
        this.loadChartPackages().subscribe(loaded => {
            this.prepareDataTable();
            this.w.onresize = () => {
                this.prepareDataTable();
            };
        }, error => {
            console.error('Error in loading Google chart packages');
        });
        },error=>{
         console.error("Error in loading Visualisation packages");

        }); 
      
    }
    /**
    * loadChart() method is called to load google chart packages
    */
    private loadChartPackages(): Observable<any> {
        return Observable.create(observer => {
            this.w = window;
            if (!this.w.google.visualization) {
                if (!chartLoaded) {
                    chartLoaded = true;
                    this.w.google.charts.load('current', { packages: ['corechart'] });
                } setTimeout(function () {
                    observer.next();
                    observer.complete();
                }, 1000);
            } else {
                observer.next();
                observer.complete();
            }
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
            var row;
            var item = new EventData();
            if (selectedData[0]) {
                if (this.columnSelection) {
                    let column = selectedData[0].column;
                    row = selectedData[0].row;
                    var item1 = dataTable.getValue(row,column);
                    var item2 = dataTable.getValue(row, 0);
                    item.row = item2;
                    item.column = item1;
                    this.selectchart.next(item);
                    return this.selectchart.next;
                } else {
                    row = selectedData[0].row;
                    var rowitem = dataTable.getValue(row, 0);
                    this.select.next(rowitem);
                    return this.select.next;
                }
            }
        });
        

        this.w.google.visualization.events.addListener(chart, 'onmouseover', ()=> {
            this.el.style.cursor='pointer';
          });
          this.w.google.visualization.events.addListener(chart, 'onmouseout', ()=>  {
              this.el.style.cursor='default';
  
          });

    }
}
export class EventData {
    row: any;
    column: any;
}
