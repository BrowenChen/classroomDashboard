/*
 * Play with this code and it'll update in the panel opposite.
 *
 * Why not try some of the options above?
 */
Morris.Donut({
  element: 'donut-example',
  data: [
    {label: "Exceeding", value: 50},
    {label: "Passing", value: 30},
    {label: "Failing", value: 20}
  ],
  backgroundColor: '#ddd',
  labelColor: '#060',
  resizing:true,
  colors: [
    '#0BA462',
    '#DADC86',
    '#EB5254'
  ]
});


Morris.Bar({
  element: 'bar-example',
  data: [


    { y: 'Metric 1', a: 100, b: 90, c: 25 },
    { y: 'Metric 2', a: 75,  b: 65, c: 25 },
    { y: 'Metric 3', a: 50,  b: 40, c: 25 }
  ],
  xkey: 'y',
  ykeys: ['a', 'b', 'c'],
  labels: ['Exceeding', 'Passing', 'Failing'],
  stacked: true,
  resizing: true
});
