<template>
    <div class="background">
        <div class="content-container member-container" style="margin-top: 60px;">
            <div class="container text-center">
                <h2 class="mb-4"> Profile </h2>
                <div class="row justify-content-center">
                    <div class="col-md-12 col-sm-12">
                        <div class="card profile-card">
                            <div class="card-body text-start">
                                <p class="card-title"><strong>Username :</strong> {{ memName }}</p>
                                <p class="card-text"><strong>Email :</strong> {{ memEmail }}</p>
                                <p class="card-text"><strong>Phone :</strong> {{ memPhone }}</p>
                                <p class="card-text"><strong>Gender :</strong> {{ memGender }}</p>
                                <p class="card-text"><strong>Birthdate :</strong> {{ memBirth }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
export default {
    name: 'MemberPage',
    data() {
        return {
            token: "",
            decodedToken: null,
            memEmail: null,
            memName: null,
            memPhone: null,
            memGender: null,
            memBirth: null
        };
    },
    mounted() {
        this.getCookie();
    },
    methods: {
        getCookie() {
            try {
                this.token = Cookies.get('token');
                this.decodedToken = jwtDecode(this.token);
                console.log(this.decodedToken);
                this.memEmail = this.decodedToken.memEmail;
                this.memName = this.decodedToken.memName;
                this.memPhone = this.decodedToken.memPhone;
                this.memGender = this.decodedToken.memGender;
                this.memBirth = this.formatDate(this.decodedToken.memBirth);
            } catch (err) {
                console.error(`Fail to decode token: ${err}`);
            }
        },
        formatDate(isoString) {
            const date = new Date(isoString);

            const day = date.getDate();
            const month = date.toLocaleString('en-US', { month: 'long' });
            const year = date.getFullYear();

            const suffix = this.getDaySuffix(day);

            return `${day}${suffix} ${month}, ${year}`;
        },
        getDaySuffix(day) {
            if (day > 3 && day < 21) return "th"; 
            switch (day % 10) {
                case 1: return "st"; 
                case 2: return "nd"; 
                case 3: return "rd"; 
                default: return "th"; 
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
    position: relative;
    padding: 50px 0;
}

.member-container {
    background: white;
    padding: 40px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    width: 90%;
    border-radius: 5px;
}

.profile-card {
    background-color: #ffffff;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 20px;
    transition: transform 0.3s ease-in-out;
    width: 100%;
}
</style>
