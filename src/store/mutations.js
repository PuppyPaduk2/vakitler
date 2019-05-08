export default {
  SAVE_COUNTRIES(state, data) {
    state.countries = data
  },
  SAVE_CITIES(state, data) {
    state.cities = data
  },
  SAVE_TOWNS(state, data) {
    state.towns = data
  },
  SAVE_TIMES(state, data) {
    state.times = data
  },
  SAVE_COUNTRY_ID(state, id) {
    state.countryId = id
  },
  SAVE_CITY_ID(state, id) {
    state.cityId = id
  },
  SAVE_TOWN_ID(state, id) {
    state.townId = id
  }
}
