<template>
    <div class="background">
        <div class="content-container" style="margin-top: 60px;">
            <form @submit.prevent="searchProduct()" class="search-form">
                <div class="container text-center" style="background: rgba(255, 255, 255, 0.95);">
                    <h2 class="mb-4">Product</h2>
                    <div class="row justify-content-center ">
                        <div class="col-md-4 col-sm-6">
                            <input type="text" class="form-control" v-model="stext" placeholder="Search Product...">
                        </div>
                        <div class="col-auto">
                            <button class="btn btn-primary" type="submit">Search</button>
                        </div>
                        <div class="col-auto">
                            <router-link to="/ProductForm" v-if="memRole == 'admin' && decodedToken != null">
                                <button class="btn btn-success"> Add Product </button>
                            </router-link>
                        </div>
                    </div>
                </div>
            </form>

            <div class="container">
                <div class="row">
                    <h4 class="mb-4 mt-4">
                        Camping Tent
                    </h4>
                    <div v-for="(pd, pdId) in campingTent" :key="pdId"
                        class="col-lg-4 col-md-6 col-sm-12 mb-4 d-flex justify-content-center">
                        <div class="card product-card">
                            <img :src="`http://localhost:3000/tent/${pd.pdId}.jpg`" class="card-img-top product-img"
                                alt="Product Image">
                            <div class="card-body text-center">
                                <h5 class="card-title">{{ pd.pdName }}</h5>
                                <div class="card-text">Brand : {{ pd.brand.brandName }}</div>
                                <div class="card-text mb-2">Price : {{ Number(pd.pdPrice).toLocaleString() }} ฿</div>
                                <router-link :to="{ name: 'ProductShow', params: { pdId: pd.pdId } }"
                                    style="text-decoration: none;">
                                    <button class="btn btn-success"> see detail </button>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container mt-4">
                <div class="row">
                    <h4 class="mb-4">Table & Chair</h4>
                    <div v-for="(pd, pdId) in tableChair" :key="pdId"
                        class="col-lg-4 col-md-6 col-sm-12 mb-4 d-flex justify-content-center">
                        <div class="card product-card">
                            <img :src="`http://localhost:3000/table_chair/${pd.pdId}.jpg`"
                                class="card-img-top product-img" alt="Product Image">
                            <div class="card-body text-center">
                                <h5 class="card-title">{{ pd.pdName }}</h5>
                                <div class="card-text">Brand : {{ pd.brand.brandName }}</div>
                                <div class="card-text mb-2">Price : {{ Number(pd.pdPrice).toLocaleString() }} ฿</div>
                                <router-link :to="{ name: 'ProductShow', params: { pdId: pd.pdId } }"
                                    style="text-decoration: none;">
                                    <button class="btn btn-success"> see detail </button>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container mt-4">
                <div class="row">
                    <h4 class="mb-4"> Sleeping Bag </h4>
                    <div v-for="(pd, pdId) in sleepingBag" :key="pdId"
                        class="col-lg-4 col-md-6 col-sm-12 mb-4 d-flex justify-content-center">
                        <div class="card product-card">
                            <img :src="`http://localhost:3000/sleeping_bag/${pd.pdId}.jpg`"
                                class="card-img-top product-img" alt="Product Image">
                            <div class="card-body text-center">
                                <h5 class="card-title">{{ pd.pdName }}</h5>
                                <div class="card-text">Brand : {{ pd.brand.brandName }}</div>
                                <div class="card-text mb-2">Price : {{ Number(pd.pdPrice).toLocaleString() }} ฿</div>
                                <router-link :to="{ name: 'ProductShow', params: { pdId: pd.pdId } }"
                                    style="text-decoration: none;">
                                    <button class="btn btn-success"> see detail </button>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container mt-4">
                <div class="row">
                    <h4 class="mb-4"> Camping Equipment </h4>
                    <div v-for="(pd, pdId) in eqtCamping" :key="pdId"
                        class="col-lg-4 col-md-6 col-sm-12 mb-4 d-flex justify-content-center">
                        <div class="card product-card">
                            <img :src="`http://localhost:3000/eqt_camping/${pd.pdId}.jpg`"
                                class="card-img-top product-img" alt="Product Image">
                            <div class="card-body text-center">
                                <h5 class="card-title">{{ pd.pdName }}</h5>
                                <div class="card-text">Brand : {{ pd.brand.brandName }}</div>
                                <div class="card-text mb-2">Price : {{ Number(pd.pdPrice).toLocaleString() }} ฿</div>
                                <router-link :to="{ name: 'ProductShow', params: { pdId: pd.pdId } }"
                                    style="text-decoration: none;">
                                    <button class="btn btn-success"> see detail </button>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container mt-4">
                <div class="row">
                    <h4 class="mb-4"> Bag and Backpack </h4>
                    <div v-for="(pd, pdId) in backpack" :key="pdId"
                        class="col-lg-4 col-md-6 col-sm-12 mb-4 d-flex justify-content-center">
                        <div class="card product-card">
                            <img :src="`http://localhost:3000/backpack/${pd.pdId}.jpg`" class="card-img-top product-img"
                                alt="Product Image">
                            <div class="card-body text-center">
                                <h5 class="card-title">{{ pd.pdName }}</h5>
                                <div class="card-text">Brand : {{ pd.brand.brandName }}</div>
                                <div class="card-text mb-2">Price : {{ Number(pd.pdPrice).toLocaleString() }} ฿</div>
                                <router-link :to="{ name: 'ProductShow', params: { pdId: pd.pdId } }"
                                    style="text-decoration: none;">
                                    <button class="btn btn-success"> see detail </button>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"

export default {
    name: 'ProductPage',
    data() {
        return {
            products: [],
            campingTent: [],
            tableChair: [],
            sleepingBag: [],
            eqtCamping: [],
            backpack: [],
            stext: '',
            token: "",
            decodedToken: null,
            memRole: null
        };
    },
    watch: {
        stext(newVal) {
            if (newVal === "") {
                this.searchProduct();
            }
        }
    },
    mounted() {
        this.loadProducts();
        this.checkAuth();
    },
    methods: {
        loadProducts() {
            axios.get('http://localhost:3000/products')
                .then(res => {
                    this.products = res.data;
                    this.filterProduct();
                })
                .catch(err => console.log(err.message));
        },
        checkAuth() {
            try {
                this.token = Cookies.get('token');
                if (this.token) {
                    this.decodedToken = jwtDecode(this.token);
                    this.memRole = this.decodedToken.memRole;
                }
            } catch (err) {
                console.error('Failed to decode token:', err);
            }
        },
        searchProduct() {
            if (this.stext == "") {
                this.loadProducts();
            }
            else {
                axios.get(`http://localhost:3000/products/search/${this.stext}`)
                    .then(res => {
                        this.products = res.data;
                        this.filterProduct();
                    })
                    .catch(err => console.log(err.message));
            }
        },
        filterProduct() {
            this.campingTent = this.products.filter(pd => pd.pdTypeId === "T01")
            this.tableChair = this.products.filter(pd => pd.pdTypeId === "T02")
            this.sleepingBag = this.products.filter(pd => pd.pdTypeId === "T03")
            this.eqtCamping = this.products.filter(pd => pd.pdTypeId === "T04")
            this.backpack = this.products.filter(pd => pd.pdTypeId === "T05")
        }
    }
};
</script>
<style scoped>
.background {
    background-image: url('../images/background.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px 0;
}

.content-container {
    background: rgba(255, 255, 255, 0.95);
    padding: 40px 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15);
    max-width: 1500px;
    width: 90%;
    max-height: 90vh;
    overflow: auto;
    position: relative;
}

.search-form {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
}

.product-card {
    width: 100%;
    max-width: 400px;
    background-color: #ffffff;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease-in-out;
}

.product-card:hover {
    transform: scale(1.05);
}

.product-img {
    width: 100%;
    height: 400px;
    object-fit: cover;
}
</style>