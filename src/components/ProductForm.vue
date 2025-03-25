<template>
    <div class="admin-container">
        <h2 class="mb-4">{{ formTitle }}</h2>

        <div class="card">
            <div class="card-body">
                <form @submit.prevent="submitForm">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="pdId" class="form-label">Product ID</label>
                                <input type="text" class="form-control" id="pdId" v-model="product.pdId" required
                                    :disabled="isEditMode">
                            </div>

                            <div class="mb-3">
                                <label for="pdName" class="form-label">Product Name</label>
                                <input type="text" class="form-control" id="pdName" v-model="product.pdName" required>
                            </div>

                            <div class="mb-3">
                                <label for="pdPrice" class="form-label">Price</label>
                                <input type="number" class="form-control" id="pdPrice" v-model="product.pdPrice"
                                    required min="0">
                            </div>

                            <div class="mb-3">
                                <label for="pdTypeId" class="form-label">Product Type</label>
                                <select class="form-select" id="pdTypeId" v-model="product.pdTypeId" required>
                                    <option value="T01">Camping Tent</option>
                                    <option value="T02">Table & Chair</option>
                                    <option value="T03">Sleeping Bag</option>
                                    <option value="T04">Camping Equipment</option>
                                    <option value="T05">Bag and Backpack</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="brandId" class="form-label">Brand</label>
                                <select class="form-select" id="brandId" v-model="product.brand.brandId" required>
                                    <option value="B01">CampPro</option>
                                    <option value="B02">CampMaster</option>
                                    <option value="B03">WildExplorer</option>
                                    <option value="B04">AdventureGear</option>
                                    <option value="B05">OutdoorMaster</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label for="pdRemark" class="form-label">Description</label>
                                <textarea class="form-control" id="pdRemark" v-model="product.pdRemark"
                                    rows="3"></textarea>
                            </div>

                            <div class="mb-3">
                                <label for="productImage" class="form-label">Product Image</label>
                                <input type="file" class="form-control" id="productImage" @change="handleImageUpload">
                                <small class="text-muted">Only upload new image if you want to change the current
                                    one</small>

                                <div v-if="imagePreview" class="mt-3">
                                    <img :src="imagePreview" class="img-thumbnail" style="max-height: 200px;">
                                </div>
                                <div v-else-if="isEditMode && product.pdId" class="mt-3">
                                    <p>Current Image:</p>
                                    <img :src="getCurrentImageUrl()" class="img-thumbnail" style="max-height: 200px;">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4">
                        <router-link to="/" class="btn btn-secondary me-2">Cancel</router-link>
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ProductForm',
    props: {
        isEditMode: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            product: {
                pdId: '',
                pdName: '',
                pdPrice: 0,
                pdTypeId: '',
                brand: {
                    brandId: '',
                    brandName: ''
                },
                pdRemark: ''
            },
            imageFile: null,
            imagePreview: null
        };
    },
    computed: {
        formTitle() {
            return this.isEditMode ? 'Edit Product' : 'Add New Product';
        }
    },
    mounted() {

        if (this.isEditMode) {
            this.fetchProduct();
        }
    },
    methods: {
        fetchProduct() {
            const pdId = this.$route.params.pdId;
            axios.get(`http://localhost:3000/admin/products/${pdId}`)
                .then(res => {
                    this.product = res.data;
                })
                .catch(err => {
                    console.error(err);
                    alert('Failed to fetch product');
                });
        },
        handleImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.imageFile = file;

                // Create preview
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.imagePreview = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        getCurrentImageUrl() {
            if (!this.product.pdId) return '';

            switch (this.product.pdTypeId) {
                case 'T01': return `http://localhost:3000/tent/${this.product.pdId}.jpg`;
                case 'T02': return `http://localhost:3000/table_chair/${this.product.pdId}.jpg`;
                case 'T03': return `http://localhost:3000/sleeping_bag/${this.product.pdId}.jpg`;
                case 'T04': return `http://localhost:3000/eqt_camping/${this.product.pdId}.jpg`;
                case 'T05': return `http://localhost:3000/backpack/${this.product.pdId}.jpg`;
                default: return '';
            }
        },
        submitForm() {
            const formData = new FormData();

            // Append all product data to formData
            Object.keys(this.product).forEach(key => {
                if (key === 'brand') {
                    formData.append('brandId', this.product.brand.brandId);
                } else {
                    formData.append(key, this.product[key]);
                }
            });

            // Append image file if selected
            if (this.imageFile) {
                formData.append('productImage', this.imageFile);
            }

            const url = this.isEditMode
                ? `http://localhost:3000/admin/products/${this.product.pdId}`
                : 'http://localhost:3000/admin/products/add';

            const method = this.isEditMode ? 'put' : 'post';

            axios({
                method,
                url,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(() => {
                    alert('Product saved successfully');
                    this.$router.push('/admin/products');
                })
                .catch(err => {
                    console.error(err);
                    alert('Failed to save product');
                });
        }
    }
};
</script>

<style scoped>
.admin-container {
    padding: 20px;
    background-color: #f8f9fa;
    min-height: 100vh;
}
</style>