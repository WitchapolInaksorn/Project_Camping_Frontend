import { createRouter , createWebHistory } from "vue-router";
import Homepage from "@/components/Homepage.vue";
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";
import MemberPage from "@/components/MemberPage.vue";
import ProductPage from "@/components/ProductPage.vue";

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
]

const router = createRouter({
    history : createWebHistory(import.meta.env.BASE_URL) , routes
})

export default router