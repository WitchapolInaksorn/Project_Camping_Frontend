<template>
<div class="" style="margin-top: 100px;">
    <h1> This is member Page</h1>
    <h1> {{ memEmail }}</h1>
    <h1> {{ memName }}</h1>
    <h1> {{ dutyId }}</h1>
    <h1> {{ memPhone }}</h1>
    <h1> {{ memGender }}</h1>
    <h1> {{ memBirth }}</h1>
</div>

</template>

<script>
import Cookies from "js-cookie"
import {jwtDecode} from "jwt-decode"
export default {
    name : 'Membar',
    data(){
        return {
            token:"",
            decodedToken:null,
            memEmail:null,
            memName:null,
            dutyId:null,
            memPhone : null,
            memGender : null,
            memBirth : null
        }
    },
    mounted() {
        this.getCookie(); 
    },
    methods:{
        getCookie() {
            try{
                this.token = Cookies.get('token');
                this.decodedToken = jwtDecode(this.token)
                console.log(this.decodedToken)
                this.memEmail=this.decodedToken.memEmail
                this.memName=this.decodedToken.memName
                this.dutyId=this.decodedToken.dutyId
                this.memPhone=this.decodedToken.memPhone
                this.memGender=this.decodedToken.memGender
                this.memBirth=this.decodedToken.memBirth
            }catch(err){
                console.error(`fail decode token ${err}`)
            }
        }
    }

}
</script>

<style>

</style>