<template>
    <div v-if="isAdmin">
        <div class="background">
            <div class="content-container" style="margin-top: 60px;">
                <div class="container text-center" style="background: rgba(255, 255, 255, 0.95);">
                    <h2 class="mb-4">Create New Product</h2>
                </div>

                <div class="container mt-4">
                    <form @submit.prevent="submitForm" class="p-4 bg-white rounded">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="pdId" class="form-label">Product ID :</label>
                                    <input type="text" id="pdId" v-model="product.pdId" required class="form-control" />
                                </div>

                                <div class="form-group mb-3">
                                    <label for="pdName" class="form-label">Product Name :</label>
                                    <input type="text" id="pdName" v-model="product.pdName" required
                                        class="form-control" />
                                </div>

                                <div class="form-group mb-3">
                                    <label for="pdPrice" class="form-label">Price :</label>
                                    <input type="number" id="pdPrice" v-model.number="product.pdPrice" step="0.01"
                                        class="form-control" />
                                </div>

                                <div class="form-group mb-3">
                                    <label for="pdRemark" class="form-label">Remark :</label>
                                    <textarea id="pdRemark" v-model="product.pdRemark" class="form-control"
                                        rows="3"></textarea>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="pdTypeId" class="form-label">Product Type :</label>
                                    <select id="pdTypeId" v-model="product.pdTypeId" class="form-control" required>
                                        <option value="T01">Camping Tent</option>
                                        <option value="T02">Table & Chair</option>
                                        <option value="T03">Sleeping Bag</option>
                                        <option value="T04">Camping Equipment</option>
                                        <option value="T05">Bag and Backpack</option>
                                    </select>
                                </div>

                                <div class="form-group mb-3">
                                    <label for="brandId" class="form-label">Brand :</label>
                                    <select id="brandId" v-model="product.brandId" class="form-control" required>
                                        <option value="B01">Camping Tent</option>
                                        <option value="B02">Table & Chair</option>
                                        <option value="B03">Sleeping Bag</option>
                                        <option value="B04">Camping Equipment</option>
                                        <option value="B05">Bag and Backpack</option>
                                    </select>
                                </div>

                                <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                    <button type="button" class="btn btn-secondary me-md-2" @click="resetForm">
                                        Reset Form
                                    </button>
                                    <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                                        {{ isSubmitting ? 'Creating...' : 'Create Product' }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div v-if="errorMessage" class="alert alert-danger mt-3">
                            {{ errorMessage }}
                        </div>

                        <div v-if="successMessage" class="alert alert-success mt-3">
                            {{ successMessage }}
                            <div v-if="createdProduct" class="mt-2">
                                <strong>Product ID:</strong> {{ createdProduct.pdId }}<br>
                                <strong>Name:</strong> {{ createdProduct.pdName }}<br>
                                <strong>Price:</strong> {{ createdProduct.pdPrice }} THB
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div v-else class="no-permission background">
        <div class="alert text-center">
            <h4>You don't have permission to access this page.</h4>
            <p>Only administrators can access this page.</p>
            <router-link to="/Homepage" class="btn btn-primary mt-1">Back to Home</router-link>
        </div>
    </div>
</template>

<script>
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import axios from 'axios';
import { EventBus } from '../event-bus'
import CartInfo from "./CartInfo.vue";
import Navbar from "./Navbar.vue";

axios.defaults.withCredentials = true

export default {
    name: 'ProductForm',
    components: {
        CartInfo,
        Navbar
    },
    data() {
        return {
            product: {
                pdId: '',
                pdName: '',
                pdPrice: null,
                pdRemark: '',
                pdTypeId: '',
                brandId: '',
            },
            isSubmitting: false,
            errorMessage: '',
            successMessage: '',
            createdProduct: null,

            token: "",
            decodedToken: null,
            memEmail: null,
            memName: null,
            memPhone: null,
            memGender: null,
            memBirth: null,
            memRole: null,
            login: false,
            isAdmin: false
        }
    },
    mounted() {
        this.checkPermission();
        EventBus.on('login_ok', () => {
            this.checkPermission();
        });
    },
    methods: {
        async checkPermission() {
            try {
                this.token = Cookies.get('token');
                if (this.token) {
                    this.decodedToken = jwtDecode(this.token);
                    this.memRole = this.decodedToken.memRole;
                    this.isAdmin = this.memRole === 'admin';
                } else {
                    this.decodedToken = null;
                    this.isAdmin = false;
                    setTimeout(() => {
                        this.$router.push('/Login');
                    }, 3000);
                }
            } catch (err) {
                console.error(`Failed to decode token ${err}`);
                this.decodedToken = null;
                this.isAdmin = false;
            }
        },
        async submitForm() {
            if (!this.product.pdId || !this.product.pdName) {
                this.errorMessage = 'Product ID and Name are required';
                return;
            }

            this.isSubmitting = true;
            this.errorMessage = '';
            this.successMessage = '';

            try {
                const response = await axios.post('http://localhost:3000/products', this.product);

                this.successMessage = 'Product created successfully!';
                this.createdProduct = response.data;
                this.resetForm();
                this.$router.push('/Product');
            } catch (err) {
                console.error("Error creating product:", err);
                if (err.response && err.response.status === 409) {
                    this.errorMessage = `Product ID ${this.product.pdId} already exists!`;
                } else if (err.response && err.response.status === 422) {
                    this.errorMessage = err.response.data.error || 'Validation failed';
                } else {
                    this.errorMessage = 'Failed to create product';
                }
            }
        },
        resetForm() {
            this.product = {
                pdId: '',
                pdName: '',
                pdPrice: null,
                pdRemark: '',
                pdTypeId: '',
                brandId: '',
            };
            this.errorMessage = '';
            this.successMessage = '';
            this.createdProduct = null;
        }
    }
}
</script>

<style scoped>
.gradient-text {
    background: linear-gradient(90deg,
            #ffb3ff,
            #d0baff,
            #bae1ff,
            #baffc9,
            #ffffba,
            #ffdfba,
            #ffb3ba);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.nav-transparent {
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    padding: 10px 20px;
}

.nav-items {
    color: white;
    text-decoration: none;
    padding: 5px 10px;
    position: relative;
    transition: color 0.3s ease-in-out;
}

.nav-items:hover {
    color: #ffc107;
}

.nav-items::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 2px;
    background-color: #ffc107;
    transform: scaleX(0);
    transition: transform 0.3s ease-in-out;
}

.nav-items:hover::after {
    transform: scaleX(1);
}

.nav-links {
    display: flex;
    justify-content: flex-end;
    width: 100%;
}

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
    padding: 40px 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15);
    max-width: 1500px;
    width: 90%;
    max-height: 90vh;
    overflow: auto;
    position: relative;
}

.form-control {
    border-radius: 5px;
    border: 1px solid #ced4da;
    padding: 10px;
}

.form-control:focus {
    border-color: #86b7fe;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.btn-primary {
    background-color: #0d6efd;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
}

.btn-primary:hover {
    background-color: #0b5ed7;
}

.btn-primary:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

.alert {
    border-radius: 8px;
    padding: 15px;
    margin-top: 20px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.no-permission {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f8f9fa;
}

.no-permission .alert {
    max-width: 700px;
    width: 100%;
}
</style>