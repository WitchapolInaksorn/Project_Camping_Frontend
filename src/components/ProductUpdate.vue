<template>
    <div v-if="isAdmin">
        <div class="background">
            <div class="content-container" style="margin-top: 60px;">
                <div class="container text-center" style="background: rgba(255, 255, 255, 0.95);">
                    <h2 class="mb-4">Update Product</h2>
                </div>

                    <div class="row">
                        <div class="col-lg-6 col-md-12">
                            <div class="card mx-auto mb-4 product-card">
                                <img v-if="products.pdTypeId === 'T01' && !imageLoadError" 
                                    :src="`http://localhost:3000/tent/${products.pdId}.jpg?${imageTimestamp}`"
                                    @error="handleImageError"
                                    alt="Tent Image" 
                                    class="card-img-top product-img">
                                <img v-if="products.pdTypeId === 'T02' && !imageLoadError"
                                    :src="`http://localhost:3000/table_chair/${products.pdId}.jpg?${imageTimestamp}`"
                                    @error="handleImageError"
                                    alt="Table & Chair Image"
                                    class="card-img-top product-img">
                                <img v-if="products.pdTypeId === 'T03' && !imageLoadError"
                                    :src="`http://localhost:3000/sleeping_bag/${products.pdId}.jpg?${imageTimestamp}`"
                                    @error="handleImageError"
                                    alt="Sleeping Bag Image"
                                    class="card-img-top product-img">
                                <img v-if="products.pdTypeId === 'T04' && !imageLoadError"
                                    :src="`http://localhost:3000/eqt_camping/${products.pdId}.jpg?${imageTimestamp}`"
                                    @error="handleImageError"
                                    alt="Camping Equipment Image"
                                    class="card-img-top product-img">
                                <img v-if="products.pdTypeId === 'T05' && !imageLoadError"
                                    :src="`http://localhost:3000/backpack/${products.pdId}.jpg?${imageTimestamp}`"
                                    @error="handleImageError"
                                    alt="Backpack Image"
                                    class="card-img-top product-img">
                                
                                <div v-if="imageLoadError" class="d-flex justify-content-center align-items-center" style="height: 500px;">
                                    <div class="text-center">
                                        <i class="bi bi-image text-muted" style="font-size: 3rem;"></i>
                                        <p class="mt-2">Image not available</p>
                                    </div>
                                </div>
                            </div>
                            
                            <form @submit.prevent="uploadFile()" class="p-3 bg-light rounded">
                                <div class="mb-3">
                                    <label for="formFile" class="form-label">Update Product Image</label>
                                    <input class="form-control" type="file" id="formFile" @change="onFileChange" required />
                                </div>
                                <button class="btn btn-primary w-100" type="submit" :disabled="!file">
                                    Upload Image
                                </button>
                                <div v-if="fileMessage" class="alert mt-3" :class="fileMessage === 'fail' ? 'alert-danger' : 'alert-success'">
                                    {{ fileMessage === 'fail' ? 'Upload failed' : fileMessage }}
                                </div>
                            </form>
                        </div>
                        
                        <div class="col-lg-6 col-md-12">
                            <form @submit.prevent="updateProduct(products)" class="p-4 bg-white rounded">
                                <div class="mb-3">
                                    <label for="pdId" class="form-label">Product ID</label>
                                    <input type="text" id="pdId" v-model="products.pdId" class="form-control" required readonly />
                                </div>
                                <div class="mb-3">
                                    <label for="pdName" class="form-label">Product Name</label>
                                    <input type="text" id="pdName" v-model="products.pdName" class="form-control" required />
                                </div>
                                <div class="mb-3">
                                    <label for="pdPrice" class="form-label">Price</label>
                                    <input type="number" id="pdPrice" v-model.number="products.pdPrice" step="0.01" class="form-control" required />
                                </div>
                                <div class="mb-3">
                                    <label for="pdRemark" class="form-label">Remark</label>
                                    <textarea id="pdRemark" v-model="products.pdRemark" class="form-control" rows="3"></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="pdTypeId" class="form-label">Product Type</label>
                                    <select id="pdTypeId" v-model="products.pdTypeId" class="form-control" required @change="handleTypeChange">
                                        <option value="T01">Camping Tent</option>
                                        <option value="T02">Table & Chair</option>
                                        <option value="T03">Sleeping Bag</option>
                                        <option value="T04">Camping Equipment</option>
                                        <option value="T05">Bag and Backpack</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="brandId" class="form-label">Brand</label>
                                    <select id="brandId" v-model="products.brandId" class="form-control" required>
                                        <option value="B01">CampPro</option>
                                        <option value="B02">CampMaster</option>
                                        <option value="B03">WildExplorer</option>
                                        <option value="B04">AdventureGear</option>
                                        <option value="B05">OutdoorMaster</option>
                                    </select>
                                </div>
                                <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                    <button type="button" class="btn btn-secondary me-md-2" @click="$router.go(-1)">
                                        Cancel
                                    </button>
                                    <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                                        {{ isSubmitting ? 'Updating...' : 'Update Product' }}
                                    </button>
                                </div>
                                
                                <div v-if="errorMessage" class="alert alert-danger mt-3">
                                    {{ errorMessage }}
                                </div>
                                <div v-if="successMessage" class="alert alert-success mt-3">
                                    {{ successMessage }}
                                </div>
                            </form>
                        </div>
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

axios.defaults.withCredentials = true

export default {
    name: 'ProductUpdate',
    data() {
        return {
            products: [{
                pdId: '',
                pdName: '',
                pdPrice: 0,
                pdRemark: '',
                pdTypeId: '',
                brandId: ''
            }],
            id: null,
            file: null,
            fileMessage: null,
            imageTimestamp: Date.now(),
            imageLoadError: false,
            
            isSubmitting: false,
            errorMessage: '',
            successMessage: '',
            
            token: "",
            decodedToken: null,
            memRole: null,
            isAdmin: false
        };
    },
    async mounted () {
        await this.checkPermission();
        this.id = this.$route.params.pdId;
        console.log(this.id);
        
        this.fetchProduct();
    },
    methods: {
        async checkPermission() {
            try {
                this.token = Cookies.get('token');
                if (this.token) {
                    this.decodedToken = jwtDecode(this.token);
                    this.memRole = this.decodedToken.memRole;
                    // console.log('memRole',this.memRole);
                    
                    this.isAdmin = this.memRole === 'admin';
                    // console.log('isAdmin', this.isAdmin);
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
        async fetchProduct() {
            try {
                const response = await axios.get(`http://localhost:3000/products/${this.id}`);
                this.products = response.data;
                this.imageLoadError = false; // Reset error state when fetching new product
            } catch (err) {
                console.error(err);
                this.errorMessage = 'Failed to fetch product data';
            }
        },
        async updateProduct(product) {
            this.isSubmitting = true;
            this.errorMessage = '';
            this.successMessage = '';
            
            try {
                const response = await axios.put(
                    `http://localhost:3000/products/update/${this.id}`, 
                    {
                        pdId: product.pdId,
                        pdName: product.pdName,
                        pdPrice: product.pdPrice,
                        pdRemark: product.pdRemark,
                        pdTypeId: product.pdTypeId,
                        brandId: product.brandId
                    },
                    { headers: { 'Content-Type': 'application/json' } }
                );
                
                if (response.data.update) {
                    this.successMessage = response.data.message;
                    setTimeout(() => {
                        this.$router.push('/Product');
                    }, 1500);
                } else {
                    this.errorMessage = response.data.message;
                }
            } catch (error) {
                console.error("Failed to update product:", error);
                this.errorMessage = error.response?.data?.message || 'Failed to update product';
            } finally {
                this.isSubmitting = false;
            }
        },
        onFileChange(e) {
            this.file = e.target.files[0];
            this.fileMessage = null;
        },
        async uploadFile() {
            if (!this.file) {
                this.fileMessage = "Please select a file first";
                return;
            }
            
            const formData = new FormData();
            formData.append("pdId", this.id);
            formData.append("pdTypeId", this.products.pdTypeId);
            formData.append("file", this.file);
            
            try {
                const response = await axios.post(
                    "http://localhost:3000/products/uploadimg", 
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                
                this.fileMessage = response.data.message;
                this.imageTimestamp = Date.now(); 
                this.imageLoadError = false; 
                
                setTimeout(() => {
                    this.fileMessage = null;
                    this.file = null;
                    document.getElementById('formFile').value = '';
                    this.$router.push('/Product');
                }, 2000);
            } catch (err) {
                console.error("Upload failed:", err);
                this.fileMessage = "fail";
            }
        },
        handleImageError() {
            this.imageLoadError = true;
        },
        handleTypeChange() {
            this.imageTimestamp = Date.now(); 
            this.imageLoadError = false; 
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

.product-card {
    background-color: rgba(255, 255, 255, 0.95);
    width: 100%;
    max-width: 700px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s ease-in-out;
}

.product-img {
    background-color: #f8f9fa;
    width: 100%;
    height: 500px;
    object-fit: contain;
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