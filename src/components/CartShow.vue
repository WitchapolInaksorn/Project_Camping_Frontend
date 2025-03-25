<template>
    <div class="background">
        <div class="container content-container" style="margin-top: 50px;">
            <div v-if="memEmail == cusId">
                <div v-if="cart.length === 0" class="text-center mt-5">
                    <h4 class="text-muted">No shopping cart</h4>
                </div>
                <div v-else>
                    <div v-for="(ct, cartId) in cart" :key="cartId" class="mt-5">
                        <div class="card product-card">
                            <div class="card-body">
                                <h4 class="card-title text-primary opacity-75">Order No :  {{ ct.cartId }}</h4>
                                <h5 class="card-subtitle mt-2 text-muted">
                                    Order date : {{ formattedDate(ct.cartDate) }}
                                </h5>
                                <div class="text-success fw-bold text-end">
                                    {{ ct.sqty }} items Total {{ (ct.sprice ?? 0).toLocaleString() }} THB
                                </div>
                                <hr />
                                <a class="btn btn-danger" @click="deleteCart(ct.cartId)">
                                    <i class="bi-cart-x-fill"></i> Delete Cart
                                </a>
                                <a class="btn btn-primary float-end" @click="confirmCart(ct.cartId)">
                                    <i class="bi-currency-dollar"></i> Confirm Order
                                </a>
                            </div>
                        </div>
                    </div>

                    <table class="table mt-3 product-card">
                        <thead>
                            <tr class="table-secondary">
                                <th></th>
                                <th>Product ID</th>
                                <th>Product Name</th>
                                <th class="text-end">Unit Price</th>
                                <th class="text-center">Quantity</th>
                                <th class="text-end">Subtotal</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(ctd, pdId) in cartDtl" :key="pdId">
                                <td>{{ ctd.row_number }}</td>
                                <td>{{ ctd.pdId }}</td>
                                <td>{{ ctd.pdName }}</td>
                                <td class="text-end">{{ ctd.price }}</td>
                                <td class="text-center">{{ ctd.qty }}</td>
                                <td class="text-end">{{ ((ctd.price * ctd.qty) ?? 0).toLocaleString() }}</td>
                                <td class="text-center">
                                    <i @click="deleteCartDetail(ctd.pdId)" style="cursor: pointer;"> 🗑️ </i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { EventBus } from '@/event-bus';
import axios from 'axios';
axios.defaults.withCredentials = true
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode';

export default {
    name: "CartShow",
    data() {
        return {
            cart: [],
            cartDtl: [],
            cartId: null,
            memEmail: null,
            decodedToken: null,
            cusId: null
        }
    },
    async mounted() {
        this.getCookie()
        this.cartId = this.$route.params.cartId
        await this.getCart()
        await this.getCartDtl()
    },
    methods: {
        formattedDate(dateStr) {
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        async getCart() {
            console.log('Get Cart')
            await axios.get(`http://localhost:3000/carts/getcart/${this.cartId}`)
                .then(res => {
                    console.log("Cart \n" + res.data)
                    this.cart = res.data
                    this.cusId = res.data[0].cusId
                })
                .catch(err => { console.error(err); });
        },
        async getCartDtl() {
            console.log('Get CartCartDtl')
            await axios.get(`http://localhost:3000/carts/getcartdtl/${this.cartId}`)
                .then(res => {
                    console.log("CartDtl \n" + res.data)
                    this.cartDtl = res.data
                })
                .catch(err => { console.error(err); });
        },
        getCookie() {
            try {
                this.token = Cookies.get('token');
                this.decodedToken = jwtDecode(this.token)
                this.memEmail = this.decodedToken.memEmail
            } catch (err) {
                console.error(`fail decode token ${err}`)
                this.decodedToken = null
            }
        },
        async deleteCart(cartId) {
            if (!confirm("ยืนยันลบตะกร้า?")) return;
            try {
                await axios.delete(`http://localhost:3000/carts/deletecart/${cartId}`);
                this.cart = this.cart.filter(item => item.cartId !== cartId);
                EventBus.emit('cart_deleted');
                this.$router.push('/Product');
            } catch (err) {
                console.error("Error deleting cart:", err);
            }
        },

        async deleteCartDetail(pdId) {
            if (!confirm("ยืนยันลบสินค้าออกจากตะกร้า?")) return;
            try {
                await axios.delete(`http://localhost:3000/carts/deletecartdtl/${pdId}`);
                this.cartDtl = this.cartDtl.filter(item => item.pdId !== pdId);
            } catch (err) {
                console.error("Error deleting cart detail:", err);
            }
        },

        async confirmCart(cartId) {
            if (!confirm("ยืนยันการสั่งซื้อ?")) return;
            try {
                await axios.post(`http://localhost:3000/carts/confirmCart/${cartId}`);
                this.cart = this.cart.filter(item => item.cartId !== cartId);
                EventBus.emit('cart_confirmed');
                this.$router.push('/Product')
            } catch (err) {
                console.error("Error confirming cart:", err);
            }
        }
    }
}
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
    max-height: 90vh;
    overflow: auto;
    position: relative;
}

.product-card {
    background-color: rgba(255, 255, 255, 0.95);
    width: 100%;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease-in-out;
    cursor: pointer;
    margin-bottom: 20px;
    overflow-y: auto
}

.table {
    width: 100%;
    margin-bottom: 1rem;
    color: #212529;
}

.table td,
.table th {
    padding: 0.75rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;
}

.table-secondary {
    background-color: #f8f9fa;
}

.text-end {
    text-align: right;
}

.text-center {
    text-align: center;
}

.btn {
    margin: 5px;
}
</style>