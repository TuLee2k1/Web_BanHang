import axios from "axios";
import { API_CATEGORY } from "./constant";

export default class CategoryService {
    insertCategory = async (category) => {
        try {
            return await axios.post(API_CATEGORY, category);
        } catch (error) {
            console.error("Error:",error);
        }
        
    };

    getCategories = async() => {
        return await axios.get(API_CATEGORY);
    };

    deleteCategory = async(id) => {
        return await axios.delete(API_CATEGORY + "/" + id);
    };

    getCategory = async(id) => {
        return await axios.get(API_CATEGORY + "/" + id + "/get");
    };

    updateCategory = async(id,category) => {
        return await axios.patch(API_CATEGORY + "/" + id, category);
    };
}