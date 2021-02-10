
// Список меню
const menu = {
    template: `
    <h3>МЕНЮ</h3>
    <ul data-role="listview" data-inset="true" data-mini="true" data-theme="a">
        <li><a href="#clusters">Кластеры</a></li>
        <li><a href="#info_bases">Базы</a></li>
        <li><a href="#sessions">Сеансы</a></li>
        <li><a href="#settings">Настройки</a></li>
        <li><a href="#info">Информация</a></li>
    </ul>`,
    methods: {
        remove_item(e) {
            //console.log(e.target)
            return !e.target.hash == '#' + $('.ui-page-active')[0].id
            //$(this).$('a')[0].href == '#' + $('.ui-page-active')[0].id
        }
    }
}

// Вывод меню на страницу Кластера
Vue.createApp({}).component('app-menu', menu).mount('#menu-cluster')
// Вывод меню на страницу списка баз
Vue.createApp({}).component('app-menu', menu).mount('#menu-bases')
// Вывод меню на страницу списка сеасов
Vue.createApp({}).component('app-menu', menu).mount('#menu-sessions')
// Вывод меню на страницу настроек
const menu_settings = Vue.createApp({}).component('app-menu', menu).mount('#menu-settings')
// Вывод меню на страницу информации
Vue.createApp({}).component('app-menu', menu).mount('#menu-info')

// Компонент Кластер и его вывод на страницу кластера
const listClusters = {
    data() {
        return {
            clusters: []
        }
    }
}
const clusters = Vue.createApp(listClusters).mount('#list_clusters')

// Компонент Базы и его вывод на страницу баз
const listBases = {
    data() {
        return {
            bases: [], // Массив баз
            base: ''   // Имя текущей базы
        }
    },
    methods: {
        count() {
            return this.bases.length // Количество баз в списке
        },
        scroll() {  // Данные для прокрутки списка баз на странице
            return {
                overflow: 'scroll',
                //height: String(screen.height - $('div.ui-header.ui-bar-inherit.ui-header-fixed.slidedown')[0].offsetHeight * 6) + 'px'
                height: String(screen.height / 2) + 'px'
            }
        },
        click(e) { // Клик по базе
            this.base = e.currentTarget.id // Текущая база
            let autor = JSON.parse(localStorage.getItem(this.base)) // Получение данных авторизации базы
            if (autor) { // Если авторизация есть, запрашиваем данные базы с сервера и выводим в модальную форму
                getData('/get/info_base.info/?callback=getBases&id_base=' + this.base + '&' +
                    autor[0].name + '=' + autor[0].value + '&' + autor[1].name + '=' + autor[1].value)
                $('#info_base').popup('open')
            }
            else {
                $('#autor_base').popup('open') // Открываем форму авторизации
            }
        }
    }
}
const bases = Vue.createApp(listBases).mount('#list_bases')

// Компонент списка сеансов и вывод его на страницу сеансов
const listSesions = {
    data() {
        return {
            sessions: [], // Массив сеансов
            base: ""
        }
    },
    methods: {
        count() {
            return this.sessions.length // Количество сеансов
        },
        scroll() { // Данные для прокрутки Сеансов на странице
            return {
                overflow: 'scroll',
                //height: String(screen.height - $('div.ui-header.ui-bar-inherit.ui-header-fixed.slidedown')[0].offsetHeight * 6) + 'px'
                height: String(screen.height / 2) + 'px'
            }
        },
        click(e) { // Клик по сеансу
            //getData('/del/sessions.sessions?callback=delSession&session=' + e.currentTarget.id)
            getData('/get/session.infos?callback=getSessions&session=' + e.currentTarget.id)
            session.id = e.currentTarget.id
            $('#info_session').popup('open')
            $('#tbody_session').css(session.scroll())
            //console.log(e.currentTarget.children[0].innerText + ':' + e.currentTarget.id)
        }
    }
}
const sessions = Vue.createApp(listSesions).mount('#list_sessions')

// Компонент Подробная информация о базе и его вывод на страницу в виде модальной формы 
const info_base = Vue.createApp({
    data() {
        return {
            info: {},
            id: '',
            bloc: {
                if(info){
                    info.ЗапретПодключенияСессий
                }
            }
        }
    },
    methods: {
        sessions_base(){ // Получение списка сеансов базы
            getData('/get/sessions.sessions?callback=getSessions&basa=' + bases.base);
            sessions.base = bases.base
            $('#table_scroll').css(listSesions.methods.scroll());
            document.location.href = '#sessions'
        },
        autor(){ // Изменение авторизации в базе
            $('#info_base').popup('close')
            setTimeout(function(){
                $('#autor_base').popup('open')
            }, 500)  
        },
        block_base(){ // Устанавливает блокировку базы
            $('#info_base').popup('close')
            setTimeout(function(){
                //$('#block_base form').attr('action', host + '/block_base')
                $('#block_base form input[name="База"]').val(bases.base)
                let autor = JSON.parse(localStorage.getItem(bases.base))
                $('#block_base form input[name="Пользователь"]').val(autor[0].value)
                $('#block_base form input[name="Пароль"]').val(autor[1].value)
                $('#block_base').popup('open')
                $('#block_base form input[class="data"]').on('input', function(e){
                    let mess = $('#block_base form input[class="messeg"]').val()
                    $('#block_base form input[class="messeg"]').val(mess + ' ' + e.target.name + ' ' + e.target.value)
                })
            }, 300)            
        }  
    }
}).mount('#info_base')

const session = Vue.createApp({
    data() {
        return {
            infos: {},
            id: ''
        }
    },
    created(){

    },
    methods: {
        del() {
            getData('/del/sessions.sessions?callback=delSession&session=' + this.id)
            $('#info_session').popup('close')
        },
        scroll(){
            return{
                overflow: 'scroll',
                height: String(screen.height / 2) + 'px'
            }
        }
    },
    template: `
    <a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-left">Закрыть</a>
    <h4 align="center">Свойства сеанса</h4>
    <div>
        <table>
            <thead>
                <tr>
                    <th>Свойство</th>
                    <th>Значение</th>
                </tr>
            </thead>
        </table>
    </div>
    <div id='tbody_session' :style='scroll'>
        <table>
            <tbody>
                <tr v-for='(info, index) in infos'>
                    <td>{{index}}</td>
                    <td>{{info}}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <button class="ui-btn ui-corner-all" @click='del'>Удалить</button>
    `
}).mount('#info_session')