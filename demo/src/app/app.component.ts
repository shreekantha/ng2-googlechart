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
    'bars': 'vertical',
    hAxis: {
      title: 'Subject'
    },
    vAxis: {
      title: 'Marks'
    }
  }
  rowlabels = ['DS', 'EC', 'LD', 'CPP'];
  data1 = [[10, 15, 20, 30], [70, 80, 65, 90]];

  columnlabels = [{
    'type': 'string',
    'value': 'subjectName'
  },
    {
      'type': 'number',
      'value': 'Internal Score'
    }, {
      'type': 'number',
      'value': 'External Score'
    }];

  options1 = {
    'vAxis': {
      'title': ' Scores',
      'ticks': [0, 25, 50, 75, 100, 125, 150]
    },
    backgroundColor: 'transparent',
    'hAxis': {
      'title': 'Courses',
      'slantedText': 'true',
      'slantedTextAngle': 45
    },
    'legend': {
      'position': 'top',
      'alignment': 'end'
    },
    'colors': ['#d4ae5d', '#8aa8a1'],
    'isStacked': true,
    seriesType: 'bars',
    'bar': {
      'groupWidth': '40%'
    },
    lineWidth: 0,
    animation: {
      startup: true,
      duration: 500,
      easing: 'out',
    }
  };
}
