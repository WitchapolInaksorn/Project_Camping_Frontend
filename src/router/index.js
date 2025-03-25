import { createRouter , createWebHistory } from "vue-router";
import Homepage from "@/components/Homepage.vue";
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";
import MemberPage from "@/components/MemberPage.vue";
import ProductPage from "@/components/ProductPage.vue";
import ProductShow from "@/components/ProductShow.vue";
import CartShow from "@/components/CartShow.vue";
import CartList from "@/components/CartList.vue";
import MemberEditPage from "@/components/MemberEditPage.vue";
import ProductForm from "@/components/ProductForm.vue";

const routes = [
    {
        path : '/',
        name : 'Homepages',
        component : Homepage
    },
    {
        path : '/Homepage',
        name : 'Homepage',
        component : Homepage
    },
    {
        path : '/Login',
        name : 'Login',
        component : Login
    },
    {
        path : '/Register',
        name : 'Register',
        component : Register
    },
    {
        path : '/Member',
        name : 'Member',
        component : MemberPage
    },
    {
        path : '/Product',
        name : 'Product',
        component : ProductPage
    },
    {
        path : '/ProductShow/:pdId',
        name : 'ProductShow',
        component : ProductShow
    },
    {
        path : '/cartShow/:cartId',
        name : 'CartShow',
        component : CartShow
    },
    {
        path:'/cartList',
        name:'CartList',
        component : CartList
    },
    {
        path:'/MemberEditPage',
        name:'MemberEditPage',
        component : MemberEditPage
    },
    {
        path:'/ProductForm',
        name:'ProductForm',
        component : ProductForm
    },

]

const router = createRouter({
    history : createWebHistory(import.meta.env.BASE_URL) , routes
})

export default router