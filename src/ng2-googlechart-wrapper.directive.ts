import { Directive, ElementRef, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { ChartLoaderService } from './ng2-googlechart.service';
import { Observable } from 'rxjs/Observable';

var chartLoaded;
declare const google: any;

@Directive({
    selector: "div[google-chart]",
    exportAs: 'google-chart'
})
export class GoogleChartDirective implements OnInit {
    el: HTMLElement;
    w: any;  // To store the window, without generating errors in typescript on window.google
    resize: any;
    @Input() data: any;
    @Input() options: any;
    @Input() chartType: any;
    @Output() select = new EventEmitter();
    @Output() onmouseover = new EventEmitter();
    @Output() onmouseout = new EventEmitter();
    constructor(private elementRef: ElementRef, private chartLoaderService: ChartLoaderService) {
        this.el = this.elementRef.nativeElement; // You cannot use elementRef directly !
    }
    ngOnInit() {
         this.chartLoaderService.loadLoader().subscribe(googlecha=>{
        this.loadChart().subscribe(loaded => {
             this.drawWrapperChart(this.chartType, this.options, this.data, this.el);
            this.w.onresize = () => {
                this.drawWrapperChart(this.chartType, this.options, this.data, this.el);
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
    private loadChart() : Observable<any> {
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
    private drawWrapperChart(chartType, options, dataTable, el) {
        const wrapper = new google.visualization.ChartWrapper({
            chartType: chartType,
            dataTable: dataTable,
            options: options || {}
        });
       let chart= wrapper.draw(el);
        this.w.google.visualization.events.addListener(wrapper, 'select', () => {
          var selectedData = wrapper.getChart().getSelection();
            var row;
            var item = new EventData();
            if (selectedData[0]) {
                var column = selectedData[0].column;
                let selectedDataTable=wrapper.getDataTable();
                var item1 = selectedDataTable.getColumnLabel(column);
                row = selectedData[0].row;
                var item2 = selectedDataTable.getValue(row, column);
                item.row = item2;
                item.column = item1;
                this.select.next(item);
                return this.select.next;
            }
        });
        this.w.google.visualization.events.addListener(wrapper.getChart(), 'onmouseover', (e) => {
            if (e.row != null) {
              let selectedDataTable=wrapper.getDataTable();
                var item = new EventData();
                item.row = selectedDataTable.getValue(e.row,e.column);
                item.column = selectedDataTable.getColumnLabel(e.column);
                this.onmouseover.next(item);
            }

        });
        this.w.google.visualization.events.addListener(wrapper.getChart(), 'onmouseout', (e) => {
            if (e.row != null) {
               let selectedDataTable=wrapper.getDataTable();
                var item = new EventData();
                item.row = selectedDataTable.getValue(e.row,e.column);
                item.column = selectedDataTable.getColumnLabel(e.column);
                this.onmouseout.next(item);
            }
        });
    }

}
export class EventData {
    row: any;
    column: any;
}
