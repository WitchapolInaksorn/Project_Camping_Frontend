<template>
    <nav class="navbar navbar-expand-lg nav-transparent fixed-top">
        <div class="container-fluid">

            <a class="navbar-brand text-light" href="#">Navbar</a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse d-flex justify-content-end" id="navbarSupportedContent">
                <ul class="navbar-nav mb-2 mb-lg-0 gap-2">
                    <li class="nav-item">
                        <router-link to="/Homepage" class="text-decoration-none nav-items fw-normal">Home</router-link>
                    </li>

                    <li class="nav-item" v-if="decodedToken == null">
                        <router-link to="/Login" class="text-decoration-none nav-items fw-normal">Login</router-link>
                    </li>

                    <li class="nav-item">
                        <router-link to="/Product"
                            class="text-decoration-none nav-items fw-normal">Shopping</router-link>
                    </li>

                    <li class="nav-item" v-if="decodedToken != null">
                        <router-link to="/Member" class="text-decoration-none nav-items fw-normal email-highlight">
                            {{ memName }}
                        </router-link>
                    </li>

                    <li class="nav-item" v-if="decodedToken != null">
                        <a href="#" @click="memLogout()" class="text-decoration-none nav-items fw-normal">Logout</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import axios from 'axios';
axios.defaults.withCredentials = true
export default {
    name: 'Navbar',
    data() {
        return {
            token: "",
            decodedToken: null,
            memEmail: null,
            memName: null,
            dutyId: null,
            memPhone: null,
            memGender: null,
            memBirth: null
        }
    },
    mounted() {
        this.getCookie();
    },
    methods: {
        getCookie() {
            try {
                this.token = Cookies.get('token');
                this.decodedToken = jwtDecode(this.token)
                console.log(this.decodedToken)
                this.memEmail = this.decodedToken.memEmail
                this.memName = this.decodedToken.memName
                this.dutyId = this.decodedToken.dutyId
                this.memPhone = this.decodedToken.memPhone
                this.memGender = this.decodedToken.memGender
                this.memBirth = this.decodedToken.memBirth
            } catch (err) {
                console.error(`fail decode token ${err}`)
                this.decodedToken = null
            }
        },
        async memLogout() {
            const cf = window.confirm('ต้องการออกจากระบบ?')
            if (cf) {
                try {
                    const response = await axios.get(`http://localhost:3000/logout`)
                    this.login = response.data.login
                    if (!this.login) {
                        this.getCookie()
                        this.$router.push('/')
                    }
                }
                catch (err) {
                    console.log(err)
                }
            }
        }
    }
}
</script>

<style>
.nav-transparent {
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    padding: 10px 20px;
}

.nav-items {
    color: white;
    text-decoration: none;
    padding: 5px 10px;
    position: relative;
    transition: color 0.3s ease-in-out;
}

.nav-items:hover {
    color: #ffc107;
}

.nav-items::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 2px;
    background-color: #ffc107;
    transform: scaleX(0);
    transition: transform 0.3s ease-in-out;
}

.nav-items:hover::after {
    transform: scaleX(1);
}

.nav-links {
    display: flex;
    justify-content: flex-end;
    width: 100%;
}

@media (max-width: 991px) {
    .nav-links {
        justify-content: flex-start;
    }
}
</style>
