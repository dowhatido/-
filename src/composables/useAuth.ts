import { ref } from 'vue'

const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true')
const currentUser = ref(JSON.parse(localStorage.getItem('currentUser') || 'null'))

export function useAuth() {
  const login = (user: any) => {
    isLoggedIn.value = true
    currentUser.value = user
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  const logout = () => {
    isLoggedIn.value = false
    currentUser.value = null
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('currentUser')
  }

  return {
    isLoggedIn,
    currentUser,
    login,
    logout
  }
}
