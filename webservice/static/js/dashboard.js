/* 
Copyright 2021 Vittorio Lo Mele

Licensed under the Apache License, Version 2.0 (the "License");
You may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. 
*/

var debug;
var intervallo = "1h";
var tempgraphobj = $("#graficoTemperatura").get();
var toastList;
var v_autoreload;
$("#alertsas").hide();
var tempgraph = new Chart(tempgraphobj, {
  type: 'line',
  data: {
    labels: [
    ],
    datasets: [{
      data: [
      ],
      lineTension: 0,
      backgroundColor: 'transparent',
      borderColor: '#DC3545',
      borderWidth: 1,
      pointBackgroundColor: '#DC3545'
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: false
        }
      }]
    },
    legend: {
      display: false
    }
  }
})
var umidgraphobj = $("#graficoUmidita").get();
var umidgraph = new Chart(umidgraphobj, {
  type: 'line',
  data: {
    labels: [
    ],
    datasets: [{
      data: [
      ],
      lineTension: 0,
      backgroundColor: 'transparent',
      borderColor: '#007BFF',
      borderWidth: 1,
      pointBackgroundColor: '#007BFF'
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: false
        }
      }]
    },
    legend: {
      display: false
    }
  }
})
var pressgraphobj = $("#graficoPressione").get();
var pressgraph = new Chart(pressgraphobj, {
  type: 'line',
  data: {
    labels: [
    ],
    datasets: [{
      data: [
      ],
      lineTension: 0,
      backgroundColor: 'transparent',
      borderColor: '#FFC107',
      borderWidth: 1,
      pointBackgroundColor: '#FFC107'
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: false
        }
      }]
    },
    legend: {
      display: false
    }
  }
})

function fetchJsonData() {
  $.ajax({
    url: "getjsdata.php",
    data: {
      "intervallo": intervallo
    },
    type: "get",
    success: function (results) {
      tempgraph.data.labels = [];
      tempgraph.data.datasets.forEach((dataset) => {
        dataset.data = [];
      });
      umidgraph.data.labels = [];
      umidgraph.data.datasets.forEach((dataset) => {
        dataset.data = [];
      });
      pressgraph.data.labels = [];
      pressgraph.data.datasets.forEach((dataset) => {
        dataset.data = [];
      });

      result = JSON.parse(results);
      $("#datelbl").text(result.date);
      $("#timelbl").text(result.time);
      $("#templbl").text(result.temp);
      $("#presslbl").text(result.press);
      $("#umidlbl").text(result.umidit);
      if (result.alarm) {
        $("#alertsas").show();
        $("#alertsas").text("I dati potrebbero non essere aggiornati, controlla il backend!");
      }
      result.datastore.reverse();
      result.datastore.forEach(function (arrayItem) {
        tempgraph.data.labels.push(arrayItem.time);
        //tempgraph.data.labels.reverse();
        tempgraph.data.datasets.forEach((dataset) => {
          dataset.data.push(arrayItem.temp);
          //dataset.data.reverse();
        });
        umidgraph.data.labels.push(arrayItem.time);
        //umidgraph.data.labels.reverse();
        umidgraph.data.datasets.forEach((dataset) => {
          dataset.data.push(arrayItem.umidit);
          //dataset.data.reverse();
        });
        pressgraph.data.labels.push(arrayItem.time);
        //pressgraph.data.labels.reverse();
        pressgraph.data.datasets.forEach((dataset) => {
          dataset.data.push(arrayItem.press);
          //dataset.data.reverse();
        });
      });
      tempgraph.update();
      umidgraph.update();
      pressgraph.update();
    },
    error: function () {
      $("#alertsas").show();
      $("#alertsas").text("Impossibile leggere i dati dall'API, controlla il collegamento con il backend!");
    }
  });
}

function btnGroupToggleSwitch(name) {
  $(".switcher").removeClass("active");
  $(".switcher").removeAttr("aria-current");
  intervallo = name;
  $("#" + name + "btn").addClass("active");
  $("#" + name + "btn").attr('aria-current', 'page');
  $("#" + name + "btn").blur();
  fetchJsonData();
}

$(document).ready(function () {
  feather.replace();
  var toastElList = [].slice.call(document.querySelectorAll('.toast'))
  toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl)
  })
  fetchJsonData();
});

function btnReload() {
  fetchJsonData();
  $("#rels").blur();
}

function autoReload() {
  if ($("#flexSwitchCheckChecked").prop('checked')) {
    fetchJsonData();
  }
}

setInterval(autoReload, 60 * 1000);