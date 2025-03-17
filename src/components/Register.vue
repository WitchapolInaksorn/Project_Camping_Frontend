<template>
    <div class="d-flex justify-content-center background">
        <div class="col-lg-6 col-md-8 col-sm-12 ">
            <form @submit.prevent="handleSubmit()">
                <div class="card row" style="background: rgba(0, 0, 0, 0.1); backdrop-filter: blur(10px);">
                    <div class="card-body">
                        <h3 class="card-title text-white mb-3">Register</h3>
                        <div class="col-lg-12 mb-3">
                            <div class="form-floating mb-3">
                                <input type="email" class="form-control" id="memEmail" autocomplete="off" required
                                    placeholder="Email" v-model.trim="memEmail">
                                <label for="memEmail">Email</label>
                            </div>
                        </div>
                        <div class="col-lg-12 mb-3">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="memName" autocomplete="off" required
                                    placeholder="ชื่อ" v-model="memName">
                                <label for="memName">Username</label>
                            </div>
                        </div>
                        <div class="col-lg-12 mb-3">
                            <div class="form-floating mb-3">
                                <input type="password" class="form-control" id="password" autocomplete="off" required
                                    placeholder="Password" v-model="password">
                                <label for="password">Password</label>
                            </div>
                        </div>
                        <div class="col-lg-12 mb-3">
                            <div class="form-floating mb-3">
                                <input type="tel" class="form-control" id="memPhone" autocomplete="off" required
                                    placeholder="Enter your phone number" v-model="memPhone" pattern="[0-9]{10}"
                                    title="Enter a 10-digit phone number">
                                <label for="memPhone">Phone</label>
                            </div>
                        </div>
                        <div class="col-lg-12 mb-3">
                            <div class="form-floating mb-3">
                                <select class="form-select" id="memGender" v-model="memGender" required>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">LGBTQ+</option>
                                </select>
                                <label for="memGender">Gender</label>
                            </div>
                        </div>

                        <div class="col-lg-12 mb-3">
                            <div class="form-floating mb-3">
                                <input type="date" class="form-control" id="memBirth" autocomplete="off" required
                                    placeholder="ชื่อ" v-model="memBirth">
                                <label for="memBirth">Birth</label>
                            </div>
                        </div>
                        <div class="col-sm-12">
                            <button class="btn btn-success float-end" type="submit">
                                <i class="bi bi-check-lg"></i>&nbsp;ตกลง</button>
                        </div>

                    </div>
                </div>
            </form>
            <p v-if="regist == true" class="alert alert-success mt-3">Register Successful</p>
            <p v-else-if="regist == false" class="alert alert-danger mt-3">Register Fail : {{ backendmessage }}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'TheRegister',
    data() {
        return {
            memEmail: null,
            memName: null,
            password: null,
            memPhone: null,
            memGender: null,
            memBirth: null,
            regist: null,
            backendmessage: null
        }
    },
    methods: {
        async handleSubmit() {
            let members = {
                memEmail: this.memEmail,
                memName: this.memName,
                password: this.password,
                memPhone: this.memPhone,
                memGender: this.memGender,
                memBirth: this.memBirth
            }
            try {
                const response = await axios.post(`http://localhost:3000/regist`, members)
                this.regist = response.data.regist
                this.backendmessage = response.data.message
            }
            catch (err) {
                console.log(err)
            }
        }
    }
}
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
    position: relative;
}
</style>