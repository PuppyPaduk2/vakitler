import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import moment from 'moment'

let secondToArray = (second) => {
  let pad = (x) => {
    return x < 10 ? '0' + x : x
  }
  return [
    pad(Math.floor(second / 3600)),
    pad(Math.floor(second % 3600 / 60)),
    pad(Math.floor(second % 60))
  ]
}

Vue.use(Vuex)

export const store = new Vuex.Store({
  actions,
  mutations,
  state: {
    // Settings
    allCountries: [],
    allStates: [],
    allTowns: [],
    // Home
    periods: {},
    currentPeriod: '',
    nextPeriod: '',
    counter: '',
    periodTotalTime: '',
    // Ramadan
    ramadan: {
      start: moment('5-27-2017', 'MM-DD-YYYY'),
      end: moment('6-24-2017', 'MM-DD-YYYY'),
      status: '',
      counter: ''
    }
  },
  getters: {
    splitCounter (state) {
      return secondToArray(state.counter)
    },
    percentCounter (state) {
      return state.counter * 100 / state.periodTotalTime
    },
    splitFatoorCounter (state) {
      return secondToArray(state.ramadan.counter)
    }
  }
})
