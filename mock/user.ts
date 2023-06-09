import mocker from './_Mocker'

export default mocker.use([
  {
    url: '/login',
    method: 'post',
    response: req => {
      console.log(req)
      return {
        token: '---token---'
      }
    }
  },
  {
    url: '/getUserInfo',
    method: 'get',
    response: req => {
      console.log(req)
      return {
        id: '@guid',
        name: '游客@increment',
        gender: '男',
        age: 8,
        emai: '@email(email.com)',
        address: '四川省成都市'
      }
    }
  },
  {
    url: '/logout',
    method: 'post'
  }
])
