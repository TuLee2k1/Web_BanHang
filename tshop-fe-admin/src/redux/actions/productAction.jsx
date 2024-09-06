
import axios from "axios";
import productService from "../../service/productService";
import {  PRODUCT_SET, COMMON_ERROR_SET, COMMON_MESSAGE_SET, PRODUCTS_SET, PRODUCT_DELETE, PRODUCT_STATE_CLEAR } from "./actionTypes";

export const insertProduct = (product, navigate) => async (dispatch) => {
    const service = new productService();
    try {
        console.log('Inserting product...');
        console.log("Product being sent: ", product);

        const processedProduct = {
            ...product,
            image: product.image ? {
                ...product.image,
                name: product.image.name || null,
                fileName: product.image.fileName || null,
                uri: product.image.uri || null,

            } : null,
            images: (product.images || []).map(img => ({
                ...img,
                fileName: img.fileName || null,
                name: img.name || null,
            })),
        };
        console.log("Product Image Data: ", product.image);

        // Log dữ liệu ảnh chính
        if (processedProduct.image) {
            console.log("Main image filename: " + processedProduct.image.filename);
        } else {
            console.log("No main image provided.");
        }

        console.log("Processed Product: ", processedProduct);

        const response = await service.insertProduct(processedProduct);

        if (response.status === 201) {
            dispatch({
                type: PRODUCT_SET,
                payload: response.data,
            });

            dispatch({
                type: COMMON_MESSAGE_SET,
                payload: "Product is saved",
            });
            console.log('Product is saved successfully.');
        } else {
            dispatch({
                type: COMMON_ERROR_SET,
                payload: response.data.message || "An error occurred while saving the product.",
            });
            console.log('Failed to save the product.');
        }

        console.log("Response: ", response);
    } catch (error) {
        const errorMessage = error.response ? error.response.data : error.message;
        console.log("Error: ", errorMessage);
        dispatch({
            type: COMMON_ERROR_SET,
            payload: errorMessage,
        });
    }
    navigate("/products/list");
};





export const updateProduct = (id, product, navigate) => async (dispatch) => {
    const service = new productService()
    try {
        console.log('update product');

        const response = await service.updateProduct(id,product);

        if(response.status === 201){
            dispatch({
                type: PRODUCT_SET,
                payload: Response.data,
            });

            dispatch({
                type: COMMON_MESSAGE_SET,
                payload: "Product is update",
            });
        }else{
            dispatch({
                type: COMMON_ERROR_SET,
                payload: response.message,
            });
            console.log('Nooooo');
        }

        console.log(response);
    } catch (error) {
        console.log("Error" + error);
        dispatch({
            type: COMMON_ERROR_SET,
            payload: error,
        })
        
    }
    navigate("/products/list");
};

export const getProducts = (page = 0, size = 5, sort = "id,desc") => async (dispatch) => {

    try {
        console.log("get products");

        const reponse = await axios.get(`http://localhost:8080/api/v1/products/find?query=&page=${page}&size=${size}&sort=${sort}`);

        console.log("API response: ", reponse.data);
        console.log(reponse);

        if(reponse.status === 200){
            dispatch({
                type: PRODUCTS_SET,
                payload:  reponse.data,
            });
        }else{
            dispatch({
                type: COMMON_ERROR_SET,
                payload: reponse.message,
            });
        }


    } catch (error) {
        console.log(error);
        dispatch({
            type: COMMON_ERROR_SET,
            payload: error,
        })
    }
};

export const deleteProduct = (id) => async (dispatch) => {
    const service = new productService();

    try {
        console.log("delete product");

        const reponse = await service.deleteProduct(id);

        console.log(reponse);

        if(reponse.status === 200){
            dispatch({
                type: PRODUCT_DELETE,
                payload: id,
            });
            console.log("Delete thành công!")
        }else{
            dispatch({
                type: COMMON_ERROR_SET,
                payload: reponse.message,
            });
            console.log("Nooo")
        }


    } catch (error) {
        console.log(error);
        dispatch({
            type: COMMON_ERROR_SET,
            payload: error,
        })
    }

};

export const getProduct = (id) => async (dispatch) => {
    console.log("Dispatching getProduct with ID:", id);
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/products/${id}/getedit`);
        console.log("getProduct response:", response);
        if(response.status === 200){
            dispatch({
                type: PRODUCT_SET,
                payload: response.data,
                
            });
            console.log("Get Thành công");
            return response;
            
        }
    } catch (error) {
        console.error("Error in getProduct:", error);
        dispatch({
            type: COMMON_ERROR_SET,
            payload: error.message,
        });
    }
};



export const clearProductState = () => (dispatch) => {
    dispatch({type: PRODUCT_STATE_CLEAR});
};

export const clearProduct = () => (dispatch) => {
    dispatch({type: PRODUCT_SET, payload:{id: '', name: '',quantity: '0',price: '0', discount: '0', isFeatured: 'false', status: "InStock"}});
};