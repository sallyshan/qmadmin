import axios from 'axios'
let http = axios.create({
  baseURL: 'http://api.qmve.com',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    'token' : localStorage.getItem('token')
  },
  transformRequest: [function (data) {
    let newData = ''
    for (let k in data) {
      if (data.hasOwnProperty(k) === true) {
        newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
      }
    }
    return newData
  }]
})

function apiAxios (method, url, params, response) {
  
    var token = localStorage.getItem("token")
  http({
    method: method,
    url: url,
    headers : {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'token' : token
    },
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null
  }).then(function (res) {
    // if( res.data.bol === false && res.data.error_code==40007)
    // {
    //   localStorage.removeItem('token');
    //   window.location.href='/admin/login'
    // }
    response(res)
  }).catch(function (err) {
    response(err)
  })
}

export default {
  get: function (url, params, response) {
    var token = localStorage.getItem("token")
    return apiAxios('GET', url, params, response)
  },
  post: function (url, params, response) {
    return apiAxios('POST', url, params, response)
  },
  put: function (url, params, response) {
    return apiAxios('PUT', url, params, response)
  },
  delete: function (url, params, response) {
    return apiAxios('DELETE', url, params, response)
  }
}
