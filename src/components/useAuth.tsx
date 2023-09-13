function useAuth() {
   return localStorage.getItem('token') != null
  }

  export default useAuth;