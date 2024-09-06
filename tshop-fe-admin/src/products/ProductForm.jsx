// src/components/ProductForm.jsx
import React, { Component } from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Upload, Button, message, Row, Col, Divider, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ProductService from '../service/productService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import moment from 'moment';

export class ProductForm extends Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            descriptionCkData: '',
            fileList: [],
            uploadedUrl: '',
        };
    }

    

    componentDidUpdate(prevProps) {
        if (prevProps.product !== this.props.product) {
            if (this.props.product) {
                const imageFile = this.props.product.image;
                let fileList = [];
    
                if (imageFile) {
                    fileList = [{
                        uid: imageFile.id || `${Date.now()}`,
                        name: imageFile.name || 'Unnamed',
                        status: 'done',
                        url: ProductService.getProductImageUrl(imageFile.filename),
                        fileName: imageFile.filename,
                    }];
                }
    
                // Ensure fileList is an array
                if (!Array.isArray(fileList)) {
                    fileList = []; // Reset to empty array if not an array
                }
    
                this.setState({
                    descriptionCkData: this.props.product.description || '',
                    fileList,
                });
    
                if (this.formRef.current) {
                    this.formRef.current.setFieldsValue({
                        ...this.props.product,
                        manufactureDate: this.props.product.manufactureDate
                            ? moment(this.props.product.manufactureDate)
                            : null,
                        image: fileList,
                    });
                }
            }
        }
    }
    
    

    handleFinish = (values) => {
        console.log('Form values:', values);
    
        // Kiểm tra giá trị cụ thể của các trường
        console.log('Manufacture Date:', values.manufactureDate);
        console.log('Image:', values.image);
    
        // Xử lý ngày sản xuất
        const manufactureDate = values.manufactureDate ? values.manufactureDate.format('YYYY-MM-DD') : null;
    
        // Xử lý ảnh
        const image = values.image && values.image[0] ? {
            filename: values.image[0].fileName || null,
            uri: values.image[0].url || null,
            name: values.image[0].name || null,
        } : null;
    
        // Tạo đối tượng dữ liệu mới
        const newValues = {
            ...values,
            productId: values.productId || this.props.product.id,
            description: this.state.descriptionCkData,
            manufactureDate,
            image,
        };
    
        console.log('Form values before submission:', newValues);
    
        // Gọi hàm updateProduct nếu có id sản phẩm, nếu không thì gọi goNext
        if (this.props.product.id) {
            if (this.props.updateProduct) {
                this.props.updateProduct(newValues)
                    .then(response => {
                        message.success('Product updated successfully.');
                    })
                    .catch(error => {
                        message.error('Failed to update product.');
                    });
            } else {
                console.error('updateProduct is not defined.');
            }
        } else {
            if (this.props.goNext) {
                this.props.goNext(newValues)
                    .then(response => {
                        message.success('Product added successfully.');
                    })
                    .catch(error => {
                        message.error('Failed to add product.');
                    });
            } else {
                console.error('goNext is not defined.');
            }
        }
    };
    
    
    // handleUpdateProduct = (product) => {
    //     console.log('Updating product:', product);

    //     // Ví dụ gọi API để cập nhật sản phẩm
    //     ProductService.updateProduct(product)
    //         .then(response => {
    //             console.log('Product updated successfully:', response);
    //             // Xử lý kết quả, ví dụ cập nhật state hoặc thông báo thành công
    //         })
    //         .catch(error => {
    //             console.error('Error updating product:', error);
    //             // Xử lý lỗi, ví dụ thông báo lỗi
    //         });
    // };

    

    handleFileChange = (info) => {
        if (info.file.status === 'done') {
            this.setState({ uploadedUrl: info.file.response.url });
        }
    };
    

    goNext = () => {
        this.formRef.current
            .validateFields()
            .then((values) => {
                // this.handleFinish(values);
                const newValues = {
                    ...values,
                    productId: values.productId || this.props.product.id,
                    description: this.state.descriptionCkData,
                    manufactureDate: values.manufactureDate ? moment(values.manufactureDate).format('YYYY-MM-DD') : null,
                    image: values.image && values.image[0] ? {
                        filename: values.image[0].fileName || null,
                        uri: values.image[0].url || null,
                        name: values.image[0].name || null,
                    } : null,
                };
    
             
                    this.props.goNext(newValues);
                
            })
            .catch((info) => {
                console.error('Validation Errors:', info);
                message.error("Data validation Error. Please check your input fields");
            });
    };
    

    handleChange = (info) => {
        if (info.file.status === 'done') {
            const response = info.file.response || {};
            const { filename, url } = response;

        const fileList = (info.fileList || []).map(file => ({
            uid: file.uid || `${Date.now()}`,
            name: file.name,
            status: file.status,
            url: file.response?.url || url,
            fileName: filename || file.name || null,
        }));
        console.log('FileList after upload:', fileList); 

            this.setState({ fileList, uploadedUrl: url });

            if (this.formRef.current) {
            this.formRef.current.setFieldsValue({ image: fileList });
        }
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };
    
    
    
    
    
    

    handleImageRemoved = (file) => {
        if (file.response && file.response.fileName) {
            ProductService.deleteProductImage(file.response.fileName);
        }
        message.info(`${file.name} file removed.`);
    };

    normFile = (e) => {
        console.log('NormFile input:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && Array.isArray(e.fileList) ? e.fileList : []; // Đảm bảo trả về mảng
    };
    
    
    
    

    render() {
        const { product, categories } = this.props;
        // const { uploadedUrl } = this.state;

        if (!product) {
            return <div>Loading...</div>; // Handle the case when product is undefined
        }

        return (
            <>
                <Form
                    initialValues={{
                        ...product,
                        manufactureDate: product.manufactureDate ? moment(product.manufactureDate) : null,
                    }}
                    onFinish={this.handleFinish}
                    layout="vertical"
                    className="form"
                    size="middle"
                    ref={this.formRef}
                >
                    {/* Form Fields */}
                    <Row>
                        <Col md={12}>
                            <Form.Item
                                label="Product Id"
                                name="id"
                                initialValue={product.id}
                                hidden={!product.id}
                            >
                                <Input readOnly />
                            </Form.Item>
                            <Form.Item
                                label="Name"
                                name="name"
                                initialValue={product.name}
                                rules={[{ required: true }]}
                                hasFeedback
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Quantity"
                                name="quantity"
                                rules={[{ required: true }]}
                                hasFeedback
                                initialValue={product.quantity}
                            >
                                <InputNumber
                                    min={0}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    parser={value => value.replace(/$\s?|(,*)/g, "")}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Price"
                                name="price"
                                rules={[{ required: true }]}
                                hasFeedback
                                initialValue={product.price}
                            >
                                <InputNumber
                                    min={0}
                                    addonBefore={"$"}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    parser={value => value.replace(/$\s?|(,*)/g, "")}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Discount"
                                name="discount"
                                rules={[{ required: true }]}
                                hasFeedback
                                initialValue={product.discount}
                            >
                                <InputNumber
                                    min={0}
                                    max={100}
                                    addonAfter={"%"}
                                    formatter={value => `${value}`}
                                    parser={value => value.replace('%', "")}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                            <Row>
                                <Col md={12}>
                                    <Form.Item
                                        label="Featured"
                                        name="isFeatured"
                                        hasFeedback
                                        initialValue={product.isFeatured}
                                        valuePropName="checked"
                                    >
                                        <Checkbox />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={1}>
                            <Divider type="vertical" style={{ height: "100%" }} />
                        </Col>
                        <Col md={11}>
                            <Form.Item
                                label="Status"
                                name="status"
                                rules={[{ required: true }]}
                                hasFeedback
                                initialValue={product.status}
                            >
                                <Select placeholder="Select Product Status">
                                    <Select.Option value="InStock">In Stock</Select.Option>
                                    <Select.Option value="OutOfStock">Out Of Stock</Select.Option>
                                    <Select.Option value="Discountinued">Discountinued</Select.Option>
                                    <Select.Option value="OnBackOrder">On Back Order</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Category"
                                name="categoryId"
                                rules={[{ required: true }]}
                                hasFeedback
                                initialValue={product.categoryId}
                            >
                                <Select placeholder="Select Category">
                                    {categories && categories.map(item => (
                                        <Select.Option value={item.id} key={"cate" + item.id}>{item.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Manufacture Date"
                                name="manufactureDate"
                                rules={[{ required: true }]}
                                hasFeedback
                                initialValue={product.manufactureDate ? moment(product.manufactureDate) : null}

                            >
                                <DatePicker />
                            </Form.Item>

                            <Form.Item
    label="Main Image"
    name="image"
    rules={[{ required: true, message: 'Please upload an image!' }]}
    hasFeedback
    valuePropName="fileList"
    getValueFromEvent={this.normFile}
>
<Upload
    listType="picture"
    accept=".jpg,.png,.gif"
    maxCount={1}
    onRemove={this.handleImageRemoved}
    action={ProductService.getProductImageUploadUrl()}
    onChange={this.handleChange}
    showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
    fileList={Array.isArray(this.state.fileList) ? this.state.fileList : []} // Đảm bảo fileList là mảng
>
    <Button icon={<UploadOutlined />} />
</Upload>

</Form.Item>






                        </Col>
                    </Row>
                    <Row>
                        <Col md={24}>
                            <Form.Item
                                label="Brief"
                                name="brief"
                                rules={[{ required: true }]}
                                hasFeedback
                                initialValue={product.brief}
                            >
                                <ReactQuill theme="snow" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={24}>
                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[{ required: true }]}
                                hasFeedback
                                initialValue={product.description}
                            >
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={this.state.descriptionCkData || ''}
                                    onReady={editor => {
                                        editor.editing.view.change(writer => {
                                            writer.setStyle(
                                                "height",
                                                "200px",
                                                editor.editing.view.document.getRoot()
                                            );
                                        });
                                    }}
                                    onChange={(_event, editor) => {
                                        const data = editor.getData();
                                        this.setState({ descriptionCkData: data });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={24}>
                            <Divider />
                            <Button type="primary" onClick={this.goNext} style={{ float: "right" }}>Next</Button>
                        </Col>
                    </Row>
                </Form>
            </>
        );
    }
}

export default ProductForm;
