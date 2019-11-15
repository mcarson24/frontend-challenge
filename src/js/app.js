import Vue from 'vue'
import Header from './components/Header.vue'
import SideBar from './components/SideBar.vue'
import IndegoMap from './components/IndegoMapComponent.vue'

Vue.component('sidebar', SideBar)
Vue.component('header-input', Header)
Vue.component('indego-map', IndegoMap)

let sharedData = {
  indegoMap: '',
  stations: [],
  amountToShow: null,
  filteredStations: []
}

const vue = new Vue({
  el: '#app',
  data: {
    sharedData
  }
})
