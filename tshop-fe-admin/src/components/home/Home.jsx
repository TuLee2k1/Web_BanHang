import React, { Component } from 'react';
import { Button, Space, Table, Image, Tooltip, Modal, Input, Form, Row, Col } from 'antd';
import Column from 'antd/es/table/Column';
import ProductService from '../../service/productService';
import { MdPreview } from 'react-icons/md';
import withRouter from '../../helpers/withRouter';
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { deleteProduct, getProduct, getProducts } from '../../redux/actions/productAction';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { AiFillShopping } from "react-icons/ai";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            pageSize: 5,
            product: null,
            searchQuery: '',
            minPrice: '', // Added state for minimum price
            maxPrice: '', // Added state for maximum price
        };
    }

    componentDidMount() {
        const { router } = this.props;
        if (router) {
            const { id } = router.params;
            if (id) {
                this.props.getProduct(id)
                    .catch((error) => {
                        console.error("Error calling getProduct:", error);
                    });
            }
            this.loadProducts(1); // Load products for the first page
        } else {
            console.error("Router props not found");
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.products !== this.props.products) {
            console.log("Products updated:", this.props.products);
        }
    }

    loadProducts = (page, query = '', minPrice = '', maxPrice = '') => {
        const { pageSize } = this.state;
        this.props.getProducts(page - 1, pageSize, 'id,desc', query, minPrice, maxPrice)
            .catch(error => {
                console.error("Failed to load products:", error);
            });
    };

    handlePageChange = (page) => {
        this.setState({ currentPage: page });
        this.loadProducts(page, this.state.searchQuery, this.state.minPrice, this.state.maxPrice); // Pass search query and price range
    };

    handleSearch = (values) => {
        console.log('Search query:', values.query);
        this.setState({
            searchQuery: values.query,
            minPrice: values.minPrice, // Update minPrice state
            maxPrice: values.maxPrice, // Update maxPrice state
            currentPage: 1
        }, () => {
            this.loadProducts(1, values.query, values.minPrice, values.maxPrice); // Load first page with new search query and price range
        });
    };

    editProduct = (product) => {
        const { navigate } = this.props.router;
        navigate("/products/update/" + product.id, { state: { product } });
    };

    notify = () => {
        const { id } = this.state.product;
        if (id) {
            toast.success("Xoá thành công !!");
        } else {
            toast.error("Xoá không thành công !!");
        }
    }

    handleDeleteProduct = (productId) => {
        if (productId) {
            this.props.deleteProduct(productId)
                .then(() => {
                    this.notify();
                    this.loadProducts(this.state.currentPage, this.state.searchQuery, this.state.minPrice, this.state.maxPrice); // Reload products after deletion
                })
                .catch((error) => {
                    console.error("Failed to delete product:", error);
                });
        }
    };

    openDeleteConfirmModal = (product) => {
        this.setState({ product: product });

        const message = 'Do you want to delete the product ' + product.name + "?";

        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: message,
            onOk: () => this.handleDeleteProduct(product.id),
            okText: "Delete",
            cancelText: "Cancel",
        });
    };

    addToCart = (product) => {
        // Implement your add to cart logic here
        console.log("Added to cart:", product);
    };

    render() {
        const { products } = this.props;

        // Extract products list from `content`
        const productList = products?.content || [];
        const totalProducts = products?.totalElements || 0;

        if (!Array.isArray(productList)) {
            console.error("Expected productList to be an array, but got", typeof productList);
            return null;
        }

        const { navigate } = this.props.router;

        return (
            <>
                <Row style={{ marginBottom: 16 }}>
                    <Col span={24}>
                        <Form layout="inline" onFinish={this.handleSearch}>
                            <Form.Item name="query" style={{ marginRight: 8 }}>
                                <Input placeholder="Search by name" />
                            </Form.Item>
                            <Form.Item name="minPrice" style={{ marginRight: 8 }}>
                                <Input type="number" placeholder="Min Price" />
                            </Form.Item>
                            <Form.Item name="maxPrice" style={{ marginRight: 8 }}>
                                <Input type="number" placeholder="Max Price" />
                            </Form.Item>
                            <Button type='primary' htmlType='submit'>
                                Search
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Table
                    dataSource={productList}
                    size="small"
                    rowKey="id"
                    pagination={{
                        pageSize: this.state.pageSize,
                        current: this.state.currentPage,
                        total: totalProducts,
                        onChange: this.handlePageChange,
                    }}
                >
                    <Column
                        title="Image"
                        key="imageFileName"
                        dataIndex="imageFileName"
                        width={150}
                        align='center'
                        render={(_, record) => (
                            <Space size="middle">
                                <Image
                                    width="100%"
                                    src={ProductService.getProductImageUrl(record.imageFileName)}
                                />
                            </Space>
                        )}
                    />
                    <Column title="Name" key="name" dataIndex="name" />
                    <Column title="Quantity" key="quantity" dataIndex="quantity" width={60} />
                    <Column title="Price" key="price" dataIndex="price" width={60} />
                    <Column title="Discount" key="discount" dataIndex="discount" width={60} />
                    <Column title="Is Featured" key="isFeatured" dataIndex="isFeatured" width={100}
                        render={(_, record) => <h4>{record.isFeatured ? 'Yes' : 'No'}</h4>}
                    />
                    <Column title="Status" key="status" dataIndex="status" width={100} render={(_, record) => (<h4>{record.status}</h4>)} />
                    <Column
                        title="Action"
                        key="action"
                        width={150}
                        align='center'
                        render={(_, record) => (
                            <Space size="middle">
                                <Tooltip placement='top' title="View Product Detail" color='green'>
                                    <Button
                                        type="link"
                                        size='small'
                                        onClick={() => navigate('/products/view/' + record.id)}
                                    >
                                        <MdPreview color='green' size={24} />
                                    </Button>
                                </Tooltip>
                                <Tooltip placement='top' title="Add to Cart" color='blue'>
                                    <Button
                                        type="link"
                                        size='small'
                                        onClick={() => this.addToCart(record)}
                                    >
                                        <AiFillShopping color='red' size={30} />
                                    </Button>
                                </Tooltip>
                            </Space>
                        )}
                    />
                </Table>
            </>
        );
    }
}

const mapStateToProps = state => ({
    products: state.productReducer.products,
});

const mapDispatchToProps = {
    deleteProduct,
    getProduct,
    getProducts,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
