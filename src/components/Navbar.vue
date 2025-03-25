<template>
    <nav class="navbar navbar-expand-lg nav-transparent fixed-top">
        <div class="container-fluid">
            <!-- ส่วนแสดงชื่อผู้ใช้ -->
            <router-link 
                :to="memRole === 'admin' ? '/Admin' : '/Member'" 
                class="navbar-brand text-decoration-none fw-bold gradient-text"
                v-if="decodedToken"
            >
                {{ memRole === 'admin' ? 'Admin' : memName }}
            </router-link>
            
            <a class="navbar-brand text-light" href="#" v-if="!decodedToken">Camping Shop</a>

            <div v-if="decodedToken != null">
                <a class="nav-item">
                    <CartInfo />
                </a>
            </div>

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

                    <li class="nav-item" v-if="memRole == 'member' || decodedToken == null">
                        <router-link to="/Product"
                            class="text-decoration-none nav-items fw-normal">Shopping</router-link>
                    </li>

                    <li class="nav-item" v-if="memRole == 'admin' && decodedToken != null">
                        <router-link to="/Product"
                            class="text-decoration-none nav-items fw-normal">Product</router-link>
                    </li>

                    <li class="nav-item" v-if="decodedToken != null && memRole == 'member'">
                        <router-link to="/cartlist" class="text-decoration-none nav-items fw-normal">
                            Transaction
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
import { EventBus } from '../event-bus'
import CartInfo from "./CartInfo.vue";

axios.defaults.withCredentials = true

export default {
    name: 'Navbar',
    data() {
        return {
            token: "",
            decodedToken: null,
            memEmail: null,
            memName: null,
            memPhone: null,
            memGender: null,
            memBirth: null,
            memRole: null,
            login: false
        }
    },
    components: {
        CartInfo
    },
    mounted() {
        this.getCookie();

        EventBus.on('login_ok', () => {
            this.getCookie();
        });

        EventBus.on('update_profile', () => {
            this.getCookie();
        });

        EventBus.on('cart_deleted', () => {
            this.chkCart();
        });

        EventBus.on('cart_confirmed', () => {
            this.chkCart();
        });

        this.chkCart();
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
                    this.memBirth = this.decodedToken.memBirth;
                    this.memRole = this.decodedToken.memRole;
                } else {
                    this.decodedToken = null;
                }
            } catch (err) {
                console.error(`fail decode token ${err}`);
                this.decodedToken = null;
            }
        },
        async memLogout() {
            const cf = window.confirm('ต้องการออกจากระบบ?');
            if (cf) {
                try {
                    const response = await axios.get(`http://localhost:3000/logout`);
                    this.login = response.data.login;
                    if (!this.login) {
                        Cookies.remove('token');
                        EventBus.emit('memlogout');
                        this.getCookie();
                        this.$router.push('/');
                    }
                } catch (err) {
                    console.log(err);
                    this.decodedToken == null;
                }
            }
        },
        async chkCart() {
            if (!this.memEmail) return;
            
            console.log('chkCart');
            let members = {
                memEmail: this.memEmail
            };
            try {
                const response = await axios.post(`http://localhost:3000/carts/chkcart`, members);
                let cartId = response.data.cartId;
                EventBus.emit('cartdtlOK', { id: cartId });
                console.log("---" + cartId);
            } catch (err) { 
                console.log(err); 
            }
        },
    }
}
</script>

<style>
.gradient-text {
    background: linear-gradient(90deg,
            #ffb3ff,
            #d0baff,
            #bae1ff,
            #baffc9,
            #ffffba,
            #ffdfba,
            #ffb3ba);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

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
</style>