import Vue from 'vue'
import App from './App'
import JsonExcel from 'vue-json-excel'
import store from './store'

Vue.component('downloadExcel', JsonExcel)

Vue.config.productionTip = false
Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()

