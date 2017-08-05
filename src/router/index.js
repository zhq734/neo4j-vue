/**
 * Created by zhenghuiqiang on 17/8/5.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

export default new VueRouter({
	mode: 'history',
	linkActiveClass: 'is-active',
	scrollBehavior: () => ({ y: 0 }),
	routes: [{
		path: '/',
		redirect: '/neo4j'
	}, {
		name : 'neo4j',
		path: '/neo4j',
		component: require('../views/Main')
	}]
})
