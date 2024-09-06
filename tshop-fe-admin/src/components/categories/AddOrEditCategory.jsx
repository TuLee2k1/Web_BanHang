import React, { Component} from 'react';
import { Button, Divider,Form, Row,Col,Select,Input, Modal} from 'antd';
import { ArrowLeftOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import withRouter from '../../helpers/withRouter';
import {ContentHeader} from '../common/ContentHeader';
import { connect } from 'react-redux';
import { clearCategory, getCategory, insertCategory, updateCategory } from '../../redux/actions/categoryAction';
import { toast } from 'react-toastify'



class AddOrEditCategory extends Component {
    formRef = React.createRef();
constructor(props) {
  super(props)
  

  this.state = {
     category: {id: '', name: '', status: 'Visible'}
  }
}
componentDidMount = () => {
  const {id} = this.props.router.params;
  if(id){
    this.props.getCategory(id);
  }else{
    this.props.clearCategory();
  }
}

static getDerivedStateFromProps(nextProps, prevState){
  if(nextProps.category && prevState.category.id !== nextProps.category.id){
    return{
      ...prevState, category: nextProps.category
    }
  }else if(!nextProps.category){
    return{
      ...prevState,
      category: {id: '', name: '', status: 'Visible'}
    }
  }
  return null;
}

  notify = () => {
    const {id} =this.state.category
    if(!id){
      toast.success("Thêm thành công !!",);
    }else{
      toast.success("Update thành công !!",);
    }
    
  }
  openUpdateConfirmModal = (category) => {
    this.setState({...this.state, category: category});

    console.log(category);

    const message = 'Do you want to Update the category?';

    Modal.confirm({
        title:'Confirm',
        icon: <ExclamationCircleOutlined/>,
        content: message,
        onOk: this.formRef.current.submit,
        okText: "Update",
        cancelText: "cancel",
    });
};
    confirmUpdate = () => {
      console.log("Update category");
      this.formRef.current.submit();
    }  
    onSubmitForm = (values) => {
        console.log(values);

        const {id} =this.state.category
        const {navigate} = this.props.router;
        if(!id){
          this.props.insertCategory(values, navigate);
        }else{
          this.props.updateCategory(id,values, navigate);
        }
        
      this.notify()
    };

  render() {
    const { navigate } = this.props.router;
    const {category} = this.state;
    
    return (
      <div>
        <ContentHeader navigate={navigate} title="Add New Category"><div className="custom-page-header" style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginRight: 16 }}
        />
      </div></ContentHeader>

        <Form layout="vertical" className="form" onFinish={this.onSubmitForm} key={category.id} ref={this.formRef}>
            <Row>
                <Col md={12}>
                <Form.Item label="Category ID" name="categoryId" initialValue={category.id} hidden={category.id ? false : true}>
                    <Input readOnly></Input>
                </Form.Item>

                <Form.Item label="Name" name="name" initialValue={category.name} rules={[{required: true, min: 2}]}>
                    <Input></Input>
                </Form.Item>

                <Form.Item label="Status" name="status" initialValue={category.status === "Visible" ? "0" : "1"}>
                    <Select>
                    <Select.Option value="0"> Visible</Select.Option>
                    <Select.Option value="1"> In-Visible</Select.Option>
                    </Select>
                </Form.Item>

                <Divider>

                </Divider>
                
                {!category.id && (<Button htmlType="submit" type="primary" style={{float:'right'}}>Save</Button>)}
                {category.id && (
 
  
                    <Button  type="primary" style={{float:'right'}} onClick={() => this.openUpdateConfirmModal(category)}>Update</Button>

                  )}
                  
                </Col>
            </Row>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  category: state.categoryReducer.category,
});

const mapDispatchToProps = {
  insertCategory,
  getCategory,
  clearCategory,
  updateCategory,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddOrEditCategory))


