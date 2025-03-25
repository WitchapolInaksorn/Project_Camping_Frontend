<template>
    <div v-if="cartId != null && qty != null && money != null">
        <button class="btn btn-success btn-sm text-white" @click="$router.push(`/cartshow/${cartId}`)">
            {{ cartId }} [{{ qty }}] - {{ money }}฿
        </button>
    </div>
    <div v-if="cartId != null && qty == null && money == null"></div>
</template>
<script>
import axios from 'axios';
axios.defaults.withCredentials = true
import { EventBus } from "../event-bus"
export default {
    name: "CartInfo",
    data() {
        return {
            cartId: null,
            qty: 0,
            money: 0,
            id: null
        }
    },
    mounted() {
        EventBus.on('cartdtlOK', (data) => {
            this.sumCart(data.id)
        })

        EventBus.on('memlogout', () => {
            this.clearCart()
        })

        EventBus.on('cart_deleted', () => {
            this.clearCart();
        });

        EventBus.on('cart_confirmed', () => {
            this.clearCart();
        });
    },
    methods: {
        async sumCart(cid) {
            console.log(`sumCart${cid}`)
            await axios.get(`http://localhost:3000/carts/sumcart/${cid}`)
                .then(res => {
                    console.log("SumCart" + res.data)
                    this.cartId = res.data.id
                    this.qty = res.data.qty
                    this.money = res.data.money
                })
                .catch(err => {
                    console.error(err);
                    this.clearCart();
                });
        },
        clearCart() {
            console.log('Clear Cart')
            this.cartId = null
            this.qty = 0
            this.money = 0
        }
    }
}
</script>
<style></style>