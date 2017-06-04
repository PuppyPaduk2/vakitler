import _ from 'lodash'
import moment from 'moment'

export default {

  SET_COUNTRY (state, countries) {
    const TR = _.find(countries, ['UlkeAdi', 'TÜRKİYE'])
    if (TR) countries.unshift(TR)
    state.AllCountries = countries
  },

  SET_STATE (state, states) {
    const IST = _.find(states, ['SehirAdi', 'İSTANBUL'])
    if (IST) states.unshift(IST)
    state.AllStates = states
  },

  SET_TOWN (state, towns) {
    state.AllTowns = towns
  },

  SET_PERIODS (state, allPeriods) {
    const NOW = new Date()
    // 2 to 02
    let day = NOW.getDate().toString()
    day = _.size(day) === 1 ? `0${day}` : day
    // 2 to 02
    let month = (NOW.getMonth() + 1).toString()
    month = _.size(month) === 1 ? `0${month}` : month

    const DATA = _.find(allPeriods, ['MiladiTarihKisa', `${day}.${month}.${NOW.getFullYear()}`])
    state.Periods = _.pick(DATA, ['Imsak', 'Gunes', 'Ogle', 'Ikindi', 'Aksam', 'Yatsi'])
  },

  FIND_CURRENT_PERIOD (state) {
    let _periods = []
    _.forEach(state.Periods, (periodTime, periodName) => {
      const HOURS_MINUTES = periodTime.split(':')
      const NOW = new Date()
      const PERIOD = moment([NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), HOURS_MINUTES[0], HOURS_MINUTES[1]])
      if (moment(NOW).diff(PERIOD, 'seconds') > 0) {
        _periods.push(periodName)
      }
    })
    if (_periods.length > 0) {
      state.currentPeriod = _.last(_periods)
    } else {
      state.currentPeriod = _.last(_.keys(state.Periods))
    }
  },

  FIND_NEXT_PERIOD (state) {
    const KEYS = _.keys(state.Periods)
    const CURRENT_INDEX = _.indexOf(KEYS, state.currentPeriod)
    const NEXT_INDEX = CURRENT_INDEX === (KEYS.length - 1) ? 0 : CURRENT_INDEX + 1
    state.nextPeriod = KEYS[NEXT_INDEX]
  },

  COUNTER (state) {
    const NOW = new Date()
    const CURRENT_HOURS_MINUTES = state.Periods[state.currentPeriod].split(':')
    const NEXT_HOURS_MINUTES = state.Periods[state.nextPeriod].split(':')
    let NEXT_PERIOD = moment([NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), NEXT_HOURS_MINUTES[0], NEXT_HOURS_MINUTES[1]])
    if (state.currentPeriod === 'Yatsi' && NOW.getHours() >= CURRENT_HOURS_MINUTES[0]) NEXT_PERIOD.add(1, 'day')
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // DEBUG
    const DEBUG = false
    if (DEBUG) {
      // let newDate = moment(NOW).add(161, 'm')
      let newDate = moment(NOW).subtract(64, 'm')
      state.secCounter = Math.abs(newDate.diff(NEXT_PERIOD, 'second'))
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!
    } else {
      state.secCounter = Math.abs(moment(NOW).diff(NEXT_PERIOD, 'second'))
    }
  },

  TOTAL_TIME (state) {
    const NOW = new Date()
    const CURRENT_HOURS_MINUTES = state.Periods[state.currentPeriod].split(':')
    const NEXT_HOURS_MINUTES = state.Periods[state.nextPeriod].split(':')
    let START_PERIOD = moment([NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), CURRENT_HOURS_MINUTES[0], CURRENT_HOURS_MINUTES[1]])
    let END_PERIOD = moment([NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), NEXT_HOURS_MINUTES[0], NEXT_HOURS_MINUTES[1]])
    if (state.currentPeriod === 'Yatsi' && NOW.getHours() >= CURRENT_HOURS_MINUTES[0]) END_PERIOD.add(1, 'day')
    state.periodTotalTime = Math.abs(moment(START_PERIOD).diff(END_PERIOD, 'second'))
  },

  RAMAZAN_DA_MIYIZ (state, ramadanStatus) {
    state.Ramadan.status = ramadanStatus
  },

  IFTARA_KALAN_SURE (state) {
    const NOW = new Date()
    const NEXT_HOURS_MINUTES = state.Periods['Aksam'].split(':')
    let NEXT_PERIOD = moment([NOW.getFullYear(), NOW.getMonth(), NOW.getDate(), NEXT_HOURS_MINUTES[0], NEXT_HOURS_MINUTES[1]])
    state.Ramadan.totalTime = Math.abs(moment(NOW).diff(NEXT_PERIOD, 'second'))
  }

}
