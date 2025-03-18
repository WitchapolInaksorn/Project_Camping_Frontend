<template>
  <div class="d-flex justify-content-center align-items-center background">
    <div class="login-container">
      <form @submit.prevent="handleSubmit()">
        <div class="card login-card">
          <div class="card-body">
            <h3 class="card-title text-center mb-3 text-white">Login</h3>
            <div class="form-floating mb-3">
              <input type="email" class="form-control" id="memEmail" required placeholder="Email"
                v-model.trim="memEmail">
              <label for="memEmail">Email</label>
            </div>
            <div class="form-floating mb-3">
              <input type="password" class="form-control" id="password" required placeholder="Password"
                v-model="password">
              <label for="password">Password</label>
            </div>
            <div class="text-center mt-3">
              <button class="btn btn-success w-50 mb-2" type="submit">
                <i class="bi bi-check-lg"></i>&nbsp;Login
              </button>
              <p style="color: darkgrey;">Don't have an account?
                <router-link to="/register" style="color: cornflowerblue;">Register here</router-link>
              </p>
            </div>
          </div>
        </div>
      </form>
      <p v-if="login === true" class="mt-3 text-center alert-text" style="color: darkgrey;">Login Successful</p>
      <p v-else-if="login === false" class="mt-3 text-center alert-text" style="color: darkgrey;">Incorrect email or password</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true;

export default {
  name: 'Login',
  data() {
    return {
      memEmail: '',
      password: '',
      login: null
    };
  },
  methods: {
    async handleSubmit() {
      let members = {
        memEmail: this.memEmail,
        password: this.password,
      };
      try {
        const response = await axios.post('http://localhost:3000/login', members);
        this.login = response.data.login;
        if (this.login) {
          this.$router.push('/Member');
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style>
.background {
  background-image: url('../images/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  width: 100%;
  max-width: 500px;
}

.login-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.alert-text {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

</style>
