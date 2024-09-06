import axios from "axios";
import { API_PRODUCT } from "./constant";

export default class ProductService {
    // Insert a new product
    async insertProduct(product) {
        try {
            const response = await axios.post(API_PRODUCT, product);
            return response.data;
        } catch (error) {
            console.error('There was an error inserting the product!', error);
            throw error;
        }
    }

    // Get a list of products with pagination and sorting
    async getProducts(page = 0, pageSize = 5, sort = 'id,desc') {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/products/find', {
                params: {
                    query: '',
                    page: page,
                    size: pageSize,
                    sort: sort
                }
            });
            return response.data;
        } catch (error) {
            console.error('There was an error fetching the products!', error);
            throw error;
        }
    }

    // Delete a product by ID
    async deleteProduct(id) {
        try {
            const response = await axios.delete(`http://localhost:8080/api/v1/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('There was an error deleting the product!', error);
            throw error;
        }
    }

    // Get a product by name
    async getProductByName(params) {
        try {
            const response = await axios.get(`${API_PRODUCT}/find`, { params });
            return response.data;
        } catch (error) {
            console.error('There was an error fetching the product by name!', error);
            throw error;
        }
    }

    // Get a product by ID
    async getProduct(id) {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/products/${id}/getedit`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }

    // Update a product by ID
    async updateProduct(id, product) {
        try {
            let formData = new FormData();
            formData.append("name", product.name);
            if (product.logoFile && product.logoFile[0] && product.logoFile[0].originFileObj) {
                formData.append("logoFile", product.logoFile[0].originFileObj);
            }
            const response = await axios.patch(`${API_PRODUCT}/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    // Delete a product image by file name
    static async deleteProductImage(fileName) {
        try {
            await axios.delete(`${API_PRODUCT}/images/${fileName}`);
        } catch (error) {
            console.error('Error deleting product image:', error);
            throw error;
        }
    }

    // Get the URL for a product image
    static getProductImageUrl(filename) {
        if (!filename) {
            return '';
        }
        return `http://localhost:8080/api/v1/products/images/${filename}`;
    }

    // Get the URL for uploading a product image
    static getProductImageUploadUrl() {
        return `${API_PRODUCT}/images/one`;
    }
}
