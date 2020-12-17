import Vue from 'vue'
import Vuex from 'Vuex'
import Users from "./modules/user"
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    count: 1,
    token : '',
  },
  getters: {
	  	getCount: state => {
	    	return state.count + 1
		},
		getToken: state => {
	    	return state.token
		},
  },
  modules:{
    Users
  },
  mutations : {
	  add (state) {
		  state.count = state.count +1
	  },
	  redu (state) {
		  state.count = state.count -1
	  },
	  initToken (state, token) {
		  state.token = token
	  }
  }
})
export default store
