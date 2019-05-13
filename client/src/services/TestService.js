import Api from '@/services/Api'

export default {
  get_test (info) {
    return Api().get(`test/${info.id}`, {
      params: {
        q: info.q
      }
    })
  }
}
