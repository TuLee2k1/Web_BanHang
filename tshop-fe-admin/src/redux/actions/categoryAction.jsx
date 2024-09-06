import CategoryService from "../../service/categoryService";
import { CATEGORIES_SET, CATEGORY_SET, CATEGORY_STATE_CLEAR, COMMON_ERROR_SET, COMMON_MESSAGE_SET , CATEGORY_DELETE} from "./actionTypes";
export const insertCategory = (category, navigate) => async (dispatch) => {
    const service = new CategoryService()
    try {
        console.log('insert category');

        const response = await service.insertCategory(category);

        if(response.status === 201){
            dispatch({
                type: CATEGORY_SET,
                payload: Response.data,
            });

            dispatch({
                type: COMMON_MESSAGE_SET,
                payload: "Category is saved",
            });
            console.log('Category is saved');
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
    navigate("/categories/list");
};

export const updateCategory = (id, category, navigate) => async (dispatch) => {
    const service = new CategoryService()
    try {
        console.log('update category');

        const response = await service.updateCategory(id,category);

        if(response.status === 201){
            dispatch({
                type: CATEGORY_SET,
                payload: Response.data,
            });

            dispatch({
                type: COMMON_MESSAGE_SET,
                payload: "Category is update",
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
    navigate("/categories/list");
};

export const getCategories = () => async (dispatch) => {
    const service = new CategoryService();

    try {
        console.log("get categories");

        const reponse = await service.getCategories();

        console.log(reponse);

        if(reponse.status === 200){
            dispatch({
                type: CATEGORIES_SET,
                payload: reponse.data,
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

export const deleteCategory = (id) => async (dispatch) => {
    const service = new CategoryService();

    try {
        console.log("delete category");

        const reponse = await service.deleteCategory(id);

        console.log(reponse);

        if(reponse.status === 200){
            dispatch({
                type: CATEGORY_DELETE,
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

export const getCategory = (id) => async (dispatch) => {
    const service = new CategoryService();

    try {
        console.log("get category");

        const reponse = await service.getCategory(id);

        console.log(reponse);

        if(reponse.status === 200){
            dispatch({
                type: CATEGORY_SET,
                payload: reponse.data,
            });
            console.log("get thành công!")
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

export const clearCategoryState = () => (dispatch) => {
    dispatch({type: CATEGORY_STATE_CLEAR});
};

export const clearCategory = () => (dispatch) => {
    dispatch({type: CATEGORY_SET, payload:{id: '', name: '', status: "Visible"}});
};