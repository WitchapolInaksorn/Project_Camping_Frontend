<template>
    <h1>{{ memEmail }}</h1>
    <table class="table">
        <thead>
        <tr class="bg-secondary bg-opacity-10" style="height: 30px;">
            <td></td>
            <td>เลขที่</td>
            <td>วันที่</td>
            <td class="text-center">จำนวน</td>
            <td class="text-end">ยอดเงิน</td>
            <td></td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(ct, cartId) in cart" :key="cartId" style="height: 30px;" >
            <td>{{ ct.row_number }}</td>
            <td><span class="text-primary">
                    <router-link :to="`/cartshow/${ct.cartId }`" style="text-decoration: none;">
                        {{ ct.cartId }}
                    </router-link>
                </span>
            </td>
            <td>{{ formattedDate(ct.cartDate) }}</td>
            <td class="text-center">{{ (ct.sqty??0) }}</td>
            <td class="text-end">{{ (ct.sprice??0).toLocaleString()}}</td>
            <td class="text-center">
                <i class="bi-x-lg text-danger"></i>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true
import Cookies from 'js-cookie'
import {jwtDecode} from 'jwt-decode'; 
export default {
    name:"CartList",
    data(){
        return{
            memEmail:null,
            decodedToken:null,
            cart:[] 
        }
    },
    async mounted(){
        this.getCookie() 
        await this.getCartList() 
    },
    methods:{
        formattedDate(dateStr) {
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = String(date.getMonth()+ 1).padStart(2, '0'); 
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        async getCartList() {
            let customer = {  id:this.memEmail }
            console.log('Get CartLIST')
            await axios.post(`http://localhost:3000/carts/getcartbycus`,customer)
                .then(res => {
                    console.log("Cart \n" + res.data)
                    this.cart = res.data
                })
                .catch(err => { console.error(err); });
        },
        getCookie() {
            try{
                this.token = Cookies.get('token');
                this.decodedToken = jwtDecode(this.token)
                this.memEmail=this.decodedToken.memEmail
            }catch(err){
                console.error(`fail decode token ${err}`)
                this.decodedToken=null
            }
        },
    }
}
</script>
<style></style>
