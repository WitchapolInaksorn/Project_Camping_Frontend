<template>
    <div class="d-flex justify-content-center background">
        <div class="col-lg-6 col-md-8 col-sm-12">
            <form @submit.prevent="handleUpdate()">
                <div class="card row" style="background: rgba(0, 0, 0, 0.1); backdrop-filter: blur(10px);">
                    <div class="card-body">
                        <h3 class="card-title text-white mb-3">Update Profile</h3>
                        <div class="col-lg-12 mb-3">
                            <div class="form-floating mb-3">
                                <input type="email" class="form-control" id="memEmail" autocomplete="off" required
                                    placeholder="Email" v-model.trim="memEmail" disabled>
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
                                <input type="tel" class="form-control" id="memPhone" autocomplete="off" required
                                    placeholder="Enter your phone number" v-model="memPhone" pattern="[0-9]{10}"
                                    title="Enter a 10-digit phone number">
                                <label for="memPhone">Phone</label>
                            </div>
                        </div>
                        <div class="col-lg-12 mb-3">
                            <div class="form-floating mb-3">
                                <select class="form-select" id="memGender" v-model="memGender" required>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="LGBTQ+">LGBTQ+</option>
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
                                <i class="bi bi-check-lg"></i>&nbsp;Update</button>
                        </div>
                    </div>
                </div>
            </form>
            <p v-if="update == true" class="alert alert-success mt-3">Update Successful</p>
            <p v-else-if="update === false" class="alert alert-danger mt-3">Update Failed: {{ backendMessage }}
            </p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { EventBus } from '@/event-bus';
export default {
    name: 'MemberEditPage',
    data() {
        return {
            token: "",
            decodedToken: null,
            memEmail: '',
            memName: '',
            memPhone: '',
            memGender: '',
            memBirth: '',
            update: null,
            backendMessage: ''
        };
    },
    mounted() {
        this.getCookie();
    },
    methods: {
        getCookie() {
            try {
                this.token = Cookies.get('token');
                if (this.token) {
                    this.decodedToken = jwtDecode(this.token);
                    this.memEmail = this.decodedToken.memEmail;
                    this.memName = this.decodedToken.memName;
                    this.memPhone = this.decodedToken.memPhone;
                    this.memGender = this.decodedToken.memGender;
                    
                    const birthDate = new Date(this.decodedToken.memBirth);
                    const year = birthDate.getFullYear();
                    const month = String(birthDate.getMonth() + 1).padStart(2, '0');
                    const day = String(birthDate.getDate()).padStart(2, '0');
                    this.memBirth = `${year}-${month}-${day}`;
                }
            } catch (err) {
                console.error(`Fail to decode token: ${err}`);
            }
        },
        async handleUpdate() {
            let memberData = {
                memEmail: this.memEmail,
                memName: this.memName,
                memPhone: this.memPhone,
                memGender: this.memGender,
                memBirth: this.memBirth
            };

            try {
                const response = await axios.put("http://localhost:3000/members/update", memberData);
                this.update = response.data.update;
                this.backendMessage = response.data.message;

                if (this.update) {
                    if (response.data.token) {
                        Cookies.set('token', response.data.token, {
                            secure: true,
                            sameSite: 'none'
                        });
                    }

                    EventBus.emit("update_profile");
                    this.$router.push('/Member');
                }
            } catch (err) {
                console.error(err);
                this.update = false;
                this.backendMessage = 'An error occurred. Please try again later.';
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
    position: relative;
}
</style>