import { Directive, ElementRef, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { ChartLoaderService } from './ng2-googlechart.service';
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
        this.loadChart();
        this.w.onresize = () => {
            this.drawWrapperChart(this.chartType, this.options, this.data, this.el);
        };
    }
    /**
     * loadChart() method is called to load google chart packages
     */
    private loadChart() {
        this.w = window;
        if (!chartLoaded) {
            chartLoaded = true;
            this.w.onload = () => {
                this.w.google.charts.load('current', { packages: ['corechart'] });
            };
        }
        setTimeout(() => {
            this.drawWrapperChart(this.chartType, this.options, this.data, this.el);
        }, 1000);

    }
    private drawWrapperChart(chartType, options, dataTable, el) {
        const wrapper = new google.visualization.ChartWrapper({
            chartType: chartType,
            dataTable: dataTable,
            options: options || {}
        });
        wrapper.draw(el);
        this.w.google.visualization.events.addListener(wrapper, 'select', () => {
            var selectedData = wrapper.getSelection();
            var row;
            var item = new EventData();
            if (selectedData[0]) {
                let column = selectedData[0].column;
                var item1 = dataTable.getColumnLabel(column);
                row = selectedData[0].row;
                var item2 = dataTable.getValue(row, 0);
                item.row = item2;
                item.column = item1;
                this.select.next(item);
                return this.select.next;
            }
        });
        this.w.google.visualization.events.addListener(wrapper, 'onmouseover', (e) => {
            if (e.row != null) {
                var item = new EventData();
                item.row = e.row;
                item.column = dataTable.getValue(e.row, 0);
                this.onmouseover.next(item);
            }

        });
        this.w.google.visualization.events.addListener(wrapper, 'onmouseout', (e) => {
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
