import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  labels = ['DS', 'LD', 'EC', 'M3', 'DS Lab', 'EC Lab'];
  data = [83, 75, 67, 50, 90, 35];

  columnTypes = [{
    'type': 'string',
    'value': 'subjectName'
  },
    {
      'type': 'number',
      'value': 'Marks'
    }];

  chartType = 'Column';

  options = {
    'width': 750,
    'height': 400,
    'bars': 'vertical',
    'chartArea': { 'left': 150, 'bottom': 50, 'right': 100, 'top': 50 },
    hAxis: {
      title: 'Subject'
    },
    vAxis: {
      title: 'Marks'
    }
  }
}
