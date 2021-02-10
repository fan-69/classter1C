
let host = 'http://localhost:1850'
let nameCallback = 'callback=getData'

$(document).ready(function () {
    host = localStorage.getItem('host')
    if (host) {
        $('#host').val(host)
    }
    else document.location.href = '#settings'
})

function getError(data) { }

// Отправка запроса на сервер (в виде получения js)
function getData(request) {
    let script = document.createElement('script');
    script.src = host + request;
    document.body.append(script);
    script.remove();
}

// Получение данных Кластера 1С
function getClusters(data) { }
$('#get_cluster').on('click', function (event) {
    getData('/get/clusters.clusters?callback=getClusters');
})

// Получение списка Баз данных
function getBases(data) { }
$('#get_bases').on('click', function (event) {
    getData('/get/bases.bases?callback=getBases');
    $('#table_body').css(listBases.methods.scroll());
})

// Получение списка сеансов кластера 1С
function getSessions(data) { }
$('#get_sessions').on('click', function (event) {
    sessions.base = ''
    getData('/get/sessions.sessions?callback=getSessions');
    $('#table_scroll').css(listSesions.methods.scroll());
})

// Удаление сеанса из списка кластера 1С
function delSession(data) {
    if (sessions.base) {
        getData('/get/sessions.sessions?callback=getSessions&basa=' + sessions.base)
    }
    else getData('/get/sessions.sessions?callback=getSessions')
    $('#table_scroll').css(listSesions.methods.scroll());
}

// Запись данных авторизации базы данных в локальное хранилище
$('#autor_base form div button').on('click', function (e) {
    localStorage.setItem(bases.base, JSON.stringify($('#autor_base form').serializeArray()))
    $('#autor_base').popup('close')
})

// Событие при изменении адреса сервера
$('#host').change(function (e) {
    localStorage.setItem(e.target.id, e.target.value)
    host = e.target.value
})

// Открытие боковой панели свайпом вправо
$("div[data-role='page']").on("swiperight", function (e) {
    $('#' + e.currentTarget.id + " div[data-role='panel']").panel('open')
})

// Тестовый пример диаграммы
/* let dat = {
    labels: ['erp_mmk', 'itil_mmk', 'uat_mmk'],
    series: [55, 15, 4]
}

let options = {
    labelInterpolationFnc: function(value) {
      return value[0]
    }
  }
  
  let responsiveOptions = [
    ['screen and (min-width: 500px)', {
      chartPadding: 30,
      labelOffset: 100,
      labelDirection: 'explode',
      labelInterpolationFnc: function(value) {
        return value;
      }
    }],
    ['screen and (min-width: 600px)', {
      labelOffset: 80,
      chartPadding: 20
    }]
  ];
  
  new Chartist.Pie('.ct-chart', dat, options, responsiveOptions); */

// Поиск в таблице сеансов
$('#filtr_sessions').on('keyup', function () {
    let val = $(this).val().toLowerCase()
    $('#table_scroll table tr').filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1)
    })
})

// Получение диаграммы Количество пользователей в базах
function count_sessions_bases(data){
    new Chartist.Bar('#count_sessions_bases', data, 
        {distributeSeries: true}
    )
}
$('#get_count_sessions_bases').on('click', function () {
    getData('/get/count_sessions_bases?callback=count_sessions_bases')
})

// Отправить запрос на блокировку базы
$('#block_base a').on('click', function(e){
    $.ajax({
        type: 'POST',
        url: host + '/block/base',
        data: $('#block_base form').serializeArray()
    })
    $('#block_base').popup('close')
})