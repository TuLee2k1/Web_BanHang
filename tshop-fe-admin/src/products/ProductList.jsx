import { Button, Space, Table, Image, Tooltip, Modal } from 'antd';
import Column from 'antd/es/table/Column';
import React, { Component } from 'react'
import ProductService from '../service/productService';
import { MdPreview, } from 'react-icons/md';
import withRouter from '../helpers/withRouter';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, } from "@ant-design/icons";
import { deleteProduct, getProduct, getProducts } from '../redux/actions/productAction';
import { connect } from 'react-redux';
import { toast } from 'react-toastify'

 class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            pageSize: 5,
            product: null,
        };
        
    }
componentDidMount() {
    console.log("ComponentDidMount called");
    const { router } = this.props;
    if (router) {
        const { id } = router.params;
        console.log("ID: ", id);
        if (id) {
            console.log("Calling getProduct with ID:", id);
            this.props.getProduct(id)
                .then(() => {
                    console.log("getProduct action dispatched");
                })
                .catch((error) => {
                    console.error("Error calling getProduct:", error);
                });
        }
        console.log("Loading products");
        this.loadProducts();
    } else {
        console.error("Router props not found");
    }
}

    
    componentDidUpdate(prevProps) {
        if (prevProps.product !== this.props.product) {
            console.log("Product updated:", this.props.product);
        }
    }
    
    

    loadProducts = () => {
        const { currentPage, pageSize } = this.state;
        console.log("Loading products with page:", currentPage, "pageSize:", pageSize);
        this.props.getProducts(currentPage - 1, pageSize)
            .catch(error => {
                console.error("Failed to load products:", error);
            });
    };
    

    editProduct = (product) => {
        console.log("Edit: ",product);
        const {navigate} = this.props.router

        navigate( "/products/update/" + product.id, { state: { product } });
    };

    notify = () => {
        const {id} =this.state.product
        if(id){
          toast.success("Xoá thành công !!",);
        }else{
          toast.success("Xoá không thành công !!",);
        }
        
      }

    handleDeleteProduct = (productId) => {
        if(productId){
        this.props.deleteProduct(productId)
        
        
            .then(() => {
                this.notify();
                // Handle successful delete, e.g., reloading the product list
                this.loadProducts(this.state.currentPage - 1, this.state.pageSize);
                
            })
            
            .catch((error) => {
                // Handle error
                console.error("Failed to delete product:", error);
            });
        }
    };

    openDeleteConfirmModal = (product) => {
        this.setState({...this.state, product: product});

        const message = 'Do you want to delete the product ' + product.name +"?";

        Modal.confirm({
            title:'Confirm',
            icon: <ExclamationCircleOutlined/>,
            content: message,
            onOk: () => this.handleDeleteProduct(product.id),
            okText: "Delete",
            cancelText: "cancel",
        });
    };

    onSubmitForm = (values) => {
        console.log(values);

        const {id} =this.state.product
        const {navigate} = this.props.router;
        if(!id){
          this.props.insertProduct(values, navigate);
        }else{
          this.props.updateProduct(id,values, navigate);
        }
        
      this.notify()
    };

  render() {
    const {products} = this.props ;
    if (!Array.isArray(products)) {
        console.error("Expected products to be an array, but got", typeof products);
        return null;
    }else{
        console.log("Products: ", products);
    }
    const {navigate} = this.props.router;
    return (
      <Table  dataSource={products} size="small" rowKey="id" pagination={false}>
        <Column 
        title="Image"
        key="imageFileName"
        dataIndex="imageFileName"

        width={90}
        align='center'
        render={(_,record) => (
            <Space size="middle">
                <Image
                width="100%"
                src={ProductService.getProductImageUrl(record.imageFileName)}
                ></Image>
            </Space>
        )}
        ></Column>
        
        <Column title="Name" key="name" dataIndex="name"></Column>
        <Column title="Quantity" key="quantity" dataIndex="quantity" width={60}></Column>
        <Column title="Price" key="price" dataIndex="price" width={60}></Column>
        <Column title="Discount" key="discount" dataIndex="discount" width={60}></Column>
        <Column title="Is Featured" key="isFeatured" dataIndex="isFeatured" width={100} render={(_,record) => (
            <h4>{record.isFeatured ? 'Yes' : 'No'}</h4>
        )}
        ></Column>
        <Column title="Status" key="status" dataIndex="status" width={100} render={(_,record) => (<h4>{record.status}</h4>)}></Column>
  

        <Column
        title="Action"
        key="action"
        width={150}
        align='center'
        render={(_, record) => (
            <Space size="middle">
                <Tooltip
                placement='top'
                title="View Product Detail"
                color='green'
                >
                <Button
                key={record.key}
                type="link"
                size='small'
                onClick={() => navigate('/products/view/' + record.id)}
                >
                    <MdPreview  color='green' size={24}/>
                </Button>
                </Tooltip>
                <Tooltip
                placement='top'
                title="Edit Product"
                color='blue'
                >
                <Button 
                key={record.key}
                type="link"
                size='small'
                onClick={() => this.editProduct(record)}
                >
                    <EditOutlined  color='blue' size={24} /> 
                </Button>
                </Tooltip>
                <Tooltip
                placement='top'
                title="Delete Product"
                color='red'
                >
                <Button
                key={record.key}
                type='link'
                danger
                size='small'
                onClick={() => this.openDeleteConfirmModal(record)}
                >
                    <DeleteOutlined color='red' size={24} />
                </Button>
                </Tooltip>
            </Space>
        )}
        >
        </Column>
      </Table>
    )
  }
}

const mapDispatchToProps = {
    deleteProduct,
    getProduct,
    getProducts,
};

export default withRouter(connect(null, mapDispatchToProps )(ProductList));