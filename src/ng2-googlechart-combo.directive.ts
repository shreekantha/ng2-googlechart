/**
* This directive will draw a combo chart from the array of records provided
*
**/
import { Directive, ElementRef, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import {ChartLoaderService} from './ng2-googlechart.service';

var chartLoaded;
@Directive({
    selector: "div[combo-chart]",
    exportAs: 'combo-chart'
})
export class ComboChartDirective implements OnInit {
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
    // Constructor inject a ref to the element
    constructor(elementRef: ElementRef,private chartLoaderServ:ChartLoaderService) {
        this.w = window;
        this.el = elementRef.nativeElement; // You cannot use elementRef directly !
        
    }
    ngOnInit() {
       this.chartLoaderServ.loadLoader().subscribe(googlecha=>{
        this.loadChartPackages().subscribe(loaded => {
            this.comboChartData();
            this.w.onresize = () => {
                this.comboChartData();
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
    private comboChartData() {
        let dataTable = new this.w.google.visualization.DataTable();
        let tempData: any[] = new Array();
        this.drawComboChart(dataTable, tempData);
    }
    private drawComboChart(dataTable: any, tempData: any) {
        if (typeof this.columnTypes !== undefined && typeof this.labels !== undefined && typeof this.data != undefined) {
            if (this.isRole) {
                for (let i = 0; i < this.columnTypes.length; i++) {
                    if (i === 0) {
                        dataTable.addColumn(this.columnTypes[i].type, this.columnTypes[i].value);
                    } else {
                        dataTable.addColumn(this.columnTypes[i].type, this.columnTypes[i].value);
                        dataTable.addColumn(this.roles[i - 1]);
                    }
                }
                for (let i = 0; i < this.labels.length; i++) {
                    let item: any[] = new Array();
                    item.push(this.labels[i]);
                    for (let j = i; j < this.labels.length; j++) {
                        for (let k = 0; k < this.data.length; k++) {
                            item.push(this.data[k][j]);
                            item.push(this.roleData[k][j]);
                        }
                        break;
                    }
                    tempData.push(item);
                }
            } else {
                for (let i = 0; i < this.columnTypes.length; i++) {
                    dataTable.addColumn(this.columnTypes[i].type, this.columnTypes[i].value);
                }
                for (let i = 0; i < this.labels.length; i++) {
                    let item: any[] = new Array();
                    item.push(this.labels[i]);
                    for (let j = i; j < this.labels.length; j++) {
                        for (let k = 0; k < this.data.length; k++) {
                            item.push(this.data[k][j]);
                        }
                        break;
                    }
                    tempData.push(item);
                }
            }
        }
        dataTable.addRows(tempData);
        let chart = (new this.w.google.visualization.ColumnChart(this.el));
        chart.draw(dataTable, this.options || {});
        this.w.google.visualization.events.addListener(chart, 'select', () => {
            var selectedData = chart.getSelection();
            var row;
            var item = new EventData();
            if (selectedData[0]) {
                if (this.columnSelection) {
                    let column = selectedData[0].column;
                    var item1 = dataTable.getColumnLabel(column);
                    row = selectedData[0].row;
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
