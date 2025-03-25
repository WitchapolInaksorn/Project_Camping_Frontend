<template>
    <div class="background">
        <div class="container content-container" style="margin-top: 50px;">
            <div class="row">
                <div class="col-lg-6 col-md-12">
                    <div class="card mx-auto mb-4 product-card">
                        <img v-if="product.pdTypeId === 'T01'" :src="`http://localhost:3000/tent/${product.pdId}.jpg`"
                            alt="Tent Image" class="card-img-top product-img">
                        <img v-if="product.pdTypeId === 'T02'"
                            :src="`http://localhost:3000/table_chair/${product.pdId}.jpg`" alt="Table & Chair Image"
                            class="card-img-top product-img">
                        <img v-if="product.pdTypeId === 'T03'"
                            :src="`http://localhost:3000/sleeping_bag/${product.pdId}.jpg`" alt="Sleeping Bag Image"
                            class="card-img-top product-img">
                        <img v-if="product.pdTypeId === 'T04'"
                            :src="`http://localhost:3000/eqt_camping/${product.pdId}.jpg`" alt="Camping Equipment Image"
                            class="card-img-top product-img">
                        <img v-if="product.pdTypeId === 'T05'"
                            :src="`http://localhost:3000/backpack/${product.pdId}.jpg`" alt="Backpack Image"
                            class="card-img-top product-img">
                    </div>
                </div>
                <div class="col-lg-6 col-md-12">
                    <div class="card product-card">
                        <div class="card-body">
                            <table class="table">
                                <tbody>
                                    <tr class="table-secondary">
                                        <td>
                                            <h5>ID</h5>
                                        </td>
                                        <td>
                                            <h5>{{ product.pdId }}</h5>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <h5>Name</h5>
                                        </td>
                                        <td>
                                            <h5>{{ product.pdName }}</h5>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <h5>Price</h5>
                                        </td>
                                        <td>
                                            <h5>{{ product.pdPrice }} ฿</h5>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <h5>Brand</h5>
                                        </td>
                                        <td>
                                            <h5>{{ product.brand ? product.brand.brandName : 'Unknown' }}</h5>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <h5>Details</h5>
                                        </td>
                                        <td>
                                            <h5>{{ product.pdRemark }}</h5>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="d-flex justify-content-end">
                                <button class="btn btn-success btn-md" @click="chkLogin()"><i class="bi bi-cart" ></i> Add to Cart</button>
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
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode';
import { EventBus } from "../event-bus"
axios.defaults.withCredentials = true;

export default {
    name: 'ProductShow',
    data() {
        return {
            id: null,
            token: "",
            decodedToken: null,
            memEmail: null,
            memRole : null,
            cartId: null,
            product: [],
        };
    },
    mounted() {
        const productId = this.$route.params.pdId;
        axios.get(`http://localhost:3000/products/${productId}`)
            .then(res => {
                this.product = res.data;
            })
            .catch(err => {
                console.error(err);
            });
    },
    methods: {
        async getCookie() {
            try {
                this.token = await Cookies.get('token');
                this.decodedToken = jwtDecode(this.token)
                this.memEmail = this.decodedToken.memEmail
                this.memRole = this.decodedToken.memRole
            } catch (err) {
                console.error(`fail decode token ${err}`)
            }
        },
        async chkLogin() {
            console.log('chkLogin')
            await this.getCookie()
            if (this.memEmail == null) {
                alert("ต้อง Login เข้าระบบก่อน")
                console.warn("ยังไม่ได้ login ")
                return false
            }
            console.log("login แล้ว")
            await this.chkCart()
            if (this.cartId == null) {
                await this.addCart();
            }
            this.addCartDtl();
        },
        async chkCart() {
            console.log('chkCart')
            let members = {
                memEmail: this.memEmail
            }
            try {
                const response = await axios.post(`http://localhost:3000/carts/chkcart`, members)
                this.cartId = response.data.cartId
                console.log(this.cartId)
            }
            catch (err) { console.log(err) }
        },
        async addCart() {
            console.log("addCard")
            let customer = {
                cusId: this.memEmail
            }
            try {
                const response = await axios.post(
                    `http://localhost:3000/carts/addcart`, customer
                )
                this.backendMessage = response.data.messageAddCart;
                this.cartId = response.data.messageAddCart
                console.log(response.data)
            }
            catch (err) {
                console.log(err)
            }
        },
        async addCartDtl() {
            console.log("addCartDtl")
            let cartdtl = {
                cartId: this.cartId,
                pdId: this.product.pdId,
                pdPrice: this.product.pdPrice
            }
            try {
                const response = await axios.post(
                    `http://localhost:3000/carts/addcartdtl`, cartdtl
                )
                EventBus.emit('cartdtlOK',{id:this.cartId})

                this.backendMessage = response.data.messageAddCartDtl;
                console.log(response.data)
            }
            catch (err) {
                console.log(err)
            }
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
    padding: 50px;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.15);
    border-radius: 15px;
    max-width: 1400px;
    width: 90%;
    overflow: auto;
    position: relative;
}

.product-card {
    background-color: rgba(255, 255, 255, 0.95);
    width: 100%;
    max-width: 700px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease-in-out;
    cursor: pointer;
}

.product-img {
    background-color: rgba(255, 255, 255, 0.95);
    width: 100%;
    height: 700px;
    object-fit: cover;
}

.table h4,
.table h5 {
    margin-bottom: 0;
}

.table td {
    padding: 10px 20px;
}

.d-flex {
    gap: 15px;
}
</style>