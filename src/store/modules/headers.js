var ADD_USERID = 'ADD_USERID';
var ADD_DEVICEID = 'ADD_DEVICEID';

var headers = {
  state: {
    user_id: 0,
    token: '4c23b267-acd5-43b3-ba10-d26fda5d2e97'
  },
  mutations: {
    ADD_USERID: (state, user_id) => {
      state.user_id = user_id
    },
    ADD_TOKEN: (state, token) => {
      state.token = token
    }
  },
  actions: {
    setUserId({
      commit
    }, user_id) {
      commit('ADD_USERID', user_id)
    },
    setToken({
      commit
    }, token) {
      commit('ADD_TOKEN', token)
    }
  }
}

export default headers;
