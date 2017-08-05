/**
 * Created by zhenghuiqiang on 17/8/5.
 */
import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import router from './router'

window.jQuery = window.$ = require('jquery/dist/jquery')

const app = new Vue({
	router,
	...App
})

export { app, router }
