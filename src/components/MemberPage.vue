<template>
    <div class="background">
        <div class="content-container member-container" style="margin-top: 60px;">
            <div class="container text-center">
                <h2 class="mb-4"> Profile </h2>
                <div class="row justify-content-center">
                    <div class="col-md-6 col-sm-12">
                        <div class="card profile-card">
                            <div class="card-body text-start">
                                <p class="card-text"><strong>Username :</strong> {{ memName }}</p>
                                <p class="card-text"><strong>Email :</strong> {{ memEmail }}</p>
                                <p class="card-text"><strong>Phone :</strong> {{ memPhone }}</p>
                                <p class="card-text"><strong>Gender :</strong> {{ memGender }}</p>
                                <p class="card-text"><strong>Birthdate :</strong> {{ memBirth }}</p>
                            </div>
                            <div class="d-flex justify-content-center align-items-center mt-2 mb-2">
                                <router-link to="/MemberEditPage">
                                    <button class="btn btn-secondary text-center" style="width: 100px;">Edit</button>
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-12">
                        <div class="card profile-card">
                            <div class="card-body text-center" v-if="imageExists">
                                <img :src="`http://localhost:3000/img_mem/${memEmail}.jpg?timestamp=${imageTimestamp}`"
                                    :alt="memEmail" class="img-fluid rounded-circle" style="max-width: 200px;">
                            </div>
                            <div class="card-body text-center" v-else>
                                <img :src="`http://localhost:3000/img_mem/default.jpg`" :alt="memEmail"
                                    class="img-fluid rounded-circle" style="max-width: 200px;">
                            </div>
                        </div>
                        <form @submit.prevent="uploadFile()">
                            <div class="row g-3 mt-3 d-flex align-items-center">
                                <div class="col-10">
                                    <input class="form-control" type="file" id="formFile" @change="onFileChange"
                                        required />
                                </div>
                                <div class="col-2 d-flex justify-content-center align-items-center">
                                    <button class="btn btn-secondary btn-sm" type="submit">Upload</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from 'axios'
import { EventBus } from "@/event-bus";

axios.defaults.withCredentials = true
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
            memBirth: null,
            memRole: null,
            imageExists: false,
            fileMessage: null,
            file: null,
            imageTimestamp: Date.now()
        };
    },
    mounted() {
        this.getCookie();
        this.checkImage();
        EventBus.on("update_profile", this.getCookie);
    },
    methods: {
        async getCookie() {
            try {
                this.token = Cookies.get('token');
                this.decodedToken = jwtDecode(this.token);
                this.memEmail = this.decodedToken.memEmail;
                this.memName = this.decodedToken.memName;
                this.memPhone = this.decodedToken.memPhone;
                this.memGender = this.decodedToken.memGender;
                this.memBirth = this.formatDate(this.decodedToken.memBirth);
                this.memRole = this.formatDate(this.decodedToken.memRole);
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
        },
        checkImage() {
            const image = new Image();
            image.src = `http://localhost:3000/img_mem/${this.memEmail}.jpg`;
            image.onload = () => {
                this.imageExists = true;
            };
            image.onerror = () => {
                this.imageExists = false;
            };
        },
        onFileChange(e) {
            this.file = e.target.files[0];
        },

        async uploadFile() {
            if (!this.file) {
                this.fileMessage = "เลือก File ก่อน";
                return;
            }

            const formData = new FormData();
            formData.append("memEmail", this.memEmail)
            formData.append("file", this.file);

            try {
                const response = await axios.post(
                    "http://localhost:3000/members/uploadImg", formData, {

                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
                );
                this.fileMessage = response.data.message;

                this.checkImage();
                this.imageTimestamp = Date.now();
            } catch (err) {
                this.fileMessage = "fail";
            }
        },

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
    background: rgba(255, 255, 255, 0.95);
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