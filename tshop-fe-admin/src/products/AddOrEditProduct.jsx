import React, { Component } from 'react'
import { Button, Col, Divider, Row, Space, Steps, message, notification } from 'antd';
import withRouter from '../helpers/withRouter';
import ProductForm from './ProductForm';
import UploadImage from './UploadImage';
import ContentHeader from '../components/common/ContentHeader';
import {SaveOutlined} from "@ant-design/icons";
import CategoryService from '../service/categoryService';
import { connect } from 'react-redux';
import { insertProduct, getProduct, updateProduct, } from '../redux/actions/productAction';
import ProductService from '../service/productService';
import { toast } from 'react-toastify';




class AddOrEditProduct extends Component {
    constructor(props){
        super(props);

        this.state = {
            step: 0,
            product: {},
            productImages: [],
            updateProductImages: [],
            categories: [],
        };
        
    }

    

    handleUpdateProduct = (product) => {
        ProductService.updateProduct(product.id, product)
            .then(response => {
                console.log('Product updated successfully:', response);
            })
            .catch(error => {
                console.error('Error updating product:', error);
            });
    };
    


    goNext =(values) => {
        this.setState({...this.state, product:values, step:1});
    };

    goPrevious = () => {
        console.log('State before previous:', this.state);
        this.setState(prevState => ({
            ...prevState,
            step: 0,
            fileList: Array.isArray(prevState.fileList) ? prevState.fileList : [], // Đảm bảo fileList là mảng
        }), () => {
            console.log('State after previous:', this.state);
        });
    };
    
    

    onUpdateFileList = (fileList) => {
        console.log('updated filelist', fileList)

        this.setState({...this.state, updateProductImages: fileList})
    }
    

    static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.product && nextProps.product.images && nextProps.product.images.length > 0) {
        const productImages = nextProps.product.images.map(item => ({
            ...item,
            uid: item.id,
            url: ProductService.getProductImageUrl(item.fileName),
            status: "done",
        }));
        if (JSON.stringify(productImages) !== JSON.stringify(prevState.productImages)) {
            return { productImages };
        }
    }
    return null;
}

    

    notify = () => {
        const {id} =this.state.product
        if(!id){
          toast.success("Thêm thành công !!",);
        }else{
          toast.success("Update thành công !!",);
        }
        
      }

    

      saveProduct = () => {
        const { product, productImages, updateProductImages } = this.state;
    
        console.log("Saving product");
    
        // Xử lý `image`
        const processedImage = product?.image && product?.image.filename ? {
            name: product.image.name || null,
            filename: product?.image?.filename || null,
            uri: product?.image?.uri || null,
        } : null;
    
        // Xử lý `images`
        const processedImages = (updateProductImages.length > 0 ? updateProductImages : productImages).map(item => ({
            name: item.name || null,
            filename: item?.filename || null,
            uri: item?.uri || null,
            status: item.status || 'done', // Ensure status is set
        }));
    
        const newProduct = {
            ...product,
            image: processedImage,
            images: processedImages,
        };
    
        console.log("New Product being sent: ", newProduct);
    
        // Kiểm tra trạng thái của hình ảnh
        if (newProduct.images.length > 0) {
            const uploading = newProduct.images.filter(item => item.status !== 'done');
            if (uploading.length > 0) {
                notification.error({
                    message: 'Error',
                    description: 'Product images are uploading. Please wait ...',
                    duration: 10
                });
                return;
            }
        } else {
            notification.error({
                message: 'Error',
                description: 'Product images are not chosen. Please choose the product images before saving',
                duration: 10
            });
            return;
        }
    
        // Xóa các thuộc tính null hoặc undefined trước khi gửi
        const sanitizedProduct = {
            ...newProduct,
            image: newProduct.image ? {
                ...newProduct.image,
                filename: newProduct.image.filename || null,
            } : null,
            images: newProduct.images.map(img => ({
                ...img,
                filename: img?.filename || null,
            })),
        };
    
        const { navigate } = this.props.router;
        this.setState({ product: {}, productImages: [] });
        this.props.insertProduct(sanitizedProduct, navigate);
        this.notify();
    };
    
    
    

    
    

    componentDidMount() {
        this.loadData();
        const { id } = this.props.router.params;
        if (id) {
            this.props.getProduct(id)
    .then((response) => {
        if (response.status === 200) {
            console.log("Product data fetched:", response.data);
            this.setState({ product: response.data });
        } else {
            console.error("Error fetching product data");
        }
    }).catch(error => {
        console.error("Error fetching product:", error);
    });
        }
    }
    
    
    
    loadData = async () => {
        try {
            const categoryService = new CategoryService();
            const cateListResponse = await categoryService.getCategories();
    
            this.setState({
                categories: cateListResponse.data,
            });
        } catch (error) {
            console.log(error);
            message.error("Error: " + error.message);
        }
    };
    

  render() {
    const {navigate} = this.props.router;
    const {step,categories, productImages, product} = this.state;
    // const {product} = this.props;
    
    let title = product && product.id ? "Edit Product" : "Add Product";
    return (
      <>
        <ContentHeader 
        navigate = {navigate}
        title={title}
        lassName="site-page=header"
        >           
        </ContentHeader>     

        <Row>
            <Col md={24}>
            <Steps current={step}>
                <step 
                title="Basic Infomation"
                description="Fill basic infomation"
                >
                </step>

                <step
                title="Images"
                description="Choose the list of images"
                >
                </step>
            </Steps>
            </Col>
        </Row>  
        <Row>
            <Col md={24}>
                {step === 0 && product &&(
                    <>
                    <Divider>

                    </Divider>
                    <ProductForm 
                    product={this.state.product} // Pass product data to ProductForm
                    goNext={this.goNext} 
                    categories={categories}
                    updateProduct={this.handleUpdateProduct}
                    >
                    

                    </ProductForm>
                    </>
                )}
                {step === 1 &&(
                    <>
                    <Divider></Divider>
                    <Row>
                        <Col md={24}>
                        <UploadImage
                        onUpdateFileList={this.onUpdateFileList}
                            fileList={productImages}                
                        ></UploadImage>
                        <Divider></Divider>

                        <div>
                            <Space>
                                <Button type='primary' onClick={this.goPrevious}>
                                    Previous
                                </Button>
                                <Button type='primary' onClick={this.saveProduct}><SaveOutlined/> {product && product.id ? "Update" : "Save"}</Button>
                            </Space>
                        </div>
                        </Col>
                    </Row>
                   
                    </>
                )}
            </Col>

        </Row>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
    product: state.productReducer.product,
});

const mapDispatchToProps ={
    insertProduct,
    getProduct,
    updateProduct,
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddOrEditProduct));


