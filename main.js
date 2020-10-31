import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'
import myBar from './components/bar/bar.vue';
Vue.component('navBar',myBar)
import chapterList from 'components/chapterList/chapterList.vue';
Vue.component('chapterList',chapterList)

const app = new Vue({
	...App
})
app.$mount()
