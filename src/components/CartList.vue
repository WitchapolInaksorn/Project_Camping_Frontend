<template>
    <div class="background">
        <div class="container content-container">
            <h1 class="title">Transaction History </h1>
            <div class="table-wrapper">
                <table class="table">
                    <thead>
                        <tr class="table-header">
                            <td></td>
                            <td>Transaction Id</td>
                            <td>Date</td>
                            <td class="text-center">Quality</td>
                            <td class="text-end">Price</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(ct, cartId) in cart" :key="cartId" class="table-row">
                            <td>{{ ct.row_number }}</td>
                            <td>
                                <router-link :to="`/cartshow/${ct.cartId}`" class="text-primary link">
                                    {{ ct.cartId }}
                                </router-link>
                            </td>
                            <td>{{ formattedDate(ct.cartDate) }}</td>
                            <td class="text-center">{{ ct.sqty ?? 0 }}</td>
                            <td class="text-end">{{ (ct.sprice ?? 0).toLocaleString() }}</td>
                            <td class="text-center">
                                <i @click="deleteCart(ct.cartId)" class="bi-x-lg text-danger delete-icon"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export default {
    name: "CartList",
    data() {
        return {
            memEmail: null,
            memName: null,
            cart: []
        };
    },
    async mounted() {
        this.getCookie();
        await this.getCartList();
    },
    methods: {
        formattedDate(dateStr) {
            const date = new Date(dateStr);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        },
        async getCartList() {
            let customer = { id: this.memEmail };
            await axios.post(`http://localhost:3000/carts/getcartbycus`, customer)
                .then(res => { 
                    this.cart = res.data;
                    this.cart.forEach(item => {
                        if (item.sprice === 0 || item.sprice === null) {
                            this.deleteCart(item.cartId);
                        }
                    });
                })
                .catch(err => { console.error(err); });
        },
        async deleteCart(cartId) {
            try {
                await axios.delete(`http://localhost:3000/carts/deletecart/${cartId}`);
                this.cart = this.cart.filter(item => item.cartId !== cartId);
                EventBus.emit('cart_deleted');
                this.$router.push('/Product');
            } catch (err) {
                console.error("Error deleting cart:", err);
            }
        },
        getCookie() {
            try {
                this.token = Cookies.get('token');
                this.memEmail = jwtDecode(this.token).memEmail;
                this.memName = jwtDecode(this.token).memName;
            } catch (err) {
                console.error(`Fail to decode token: ${err}`);
            }
        }
    }
};
</script>

<style scoped>
.background {
    background-color: #f8f9fa;
    min-height: 100vh;
    padding: 50px 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.content-container {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
    max-width: 1000px;
    width: 90%;
}

.title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
}

.table-wrapper {
    max-height: 60vh;
    overflow-y: auto;
    border-radius: 8px;
    border: 1px solid #dee2e6;
    background: #fff;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table-header {
    background: #e9ecef;
    height: 40px;
    font-size: 16px;
    font-weight: bold;
}

.table-row {
    height: 40px;
    font-size: 14px;
}

.table td,
.table th {
    padding: 12px;
    border-bottom: 1px solid #dee2e6;
}

.link {
    text-decoration: none;
    font-weight: bold;
}

.delete-icon {
    cursor: pointer;
    font-size: 18px;
}
</style>