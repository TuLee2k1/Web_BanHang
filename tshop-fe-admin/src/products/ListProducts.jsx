import React, { Component } from 'react';
import ContentHeader from '../components/common/ContentHeader';
import { Button, Col, Input, Row, Form, Pagination, Modal } from 'antd';
import ProductList from './ProductList';
import withRouter from '../helpers/withRouter';
import { connect } from 'react-redux';
import { getProducts, clearProductState, deleteProduct, updateProduct, getProduct } from '../redux/actions/productAction';
import { ArrowLeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

class ListProducts extends Component {
    constructor() {
        super();
        this.state = {
            currentPage: 1,
            pageSize: 5,
            searchQuery: '', // Added state to hold search query
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.product !== this.props.product) {
            console.log("Product updated:", this.props.product);
        }
    }

    componentDidMount() {
        this.loadProducts();
    }

    componentWillUnmount() {
        this.props.clearProductState();
        console.log("Component will unmount");
    }

    loadProducts = (page = this.state.currentPage - 1, size = this.state.pageSize, query = this.state.searchQuery) => {
        this.props.getProducts(page, size, "id,desc", query);
    };

    handlePageChange = (page, pageSize) => {
        this.setState({ currentPage: page });
        this.loadProducts(page - 1, pageSize);
    };

    handleSearch = (values) => {
        console.log('Search query:', values.query);
        this.setState({ searchQuery: values.query, currentPage: 1 }, () => {
            this.loadProducts(0, this.state.pageSize, values.query);
        });
    };

    editProduct = (product) => {
        console.log("Edit: ", product);
        const { navigate } = this.props.router;
        navigate("/products/update/" + product.id, { state: { product } });
    };

    deleteProduct = (product) => {
        console.log("Deleting product ID:", product.id);
        if (product.id) {
            this.props.deleteProduct(product.id);
        }
    };

    openDeleteConfirmModal = (product) => {
        this.setState({ product });
        const message = 'Do you want to delete the product ' + product.name + "?";
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: message,
            onOk: () => this.deleteProduct(product),
            okText: "Delete",
            cancelText: "Cancel",
        });
    };

    render() {
        const { navigate } = this.props.router;
        const { products, totalElements } = this.props;
        return (
            <>
                <ContentHeader
                    navigate={navigate}
                    title="List products"
                    className="site-page-header"
                />
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    style={{ marginRight: 16 }}
                />
                <Row style={{ marginBottom: 8 }}>
                    <Col md={18}>
                        <Form layout="inline" name="searchForm" onFinish={this.handleSearch}>
                            <Form.Item name="query" style={{ marginRight: 8 }}>
                                <Input placeholder="Search by name" />
                            </Form.Item>
                            <Button type='primary' htmlType='submit'>
                                Search
                            </Button>
                        </Form>
                    </Col>
                    <Col md={6}>
                        <Button type='primary' onClick={() => navigate("/products/add")}>
                            New Product
                        </Button>
                    </Col>
                </Row>
                <ProductList products={products} />
                <Pagination
                    current={this.state.currentPage}
                    pageSize={this.state.pageSize}
                    total={totalElements}
                    onChange={this.handlePageChange}
                    style={{ marginTop: 16 }}
                />
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    totalElements: state.productReducer.products ? state.productReducer.products.totalElements : 0,
    products: state.productReducer.products ? state.productReducer.products.content : []
});

const mapDispatchToProps = {
    getProducts,
    clearProductState,
    deleteProduct,
    updateProduct,
    getProduct,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListProducts));
