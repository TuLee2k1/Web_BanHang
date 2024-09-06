import React, { Component } from 'react';
import { Button, Divider, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

export class ContentHeader extends Component {
  render() {
    const { navigate, title } = this.props;
    return (
      <>
        <div className="custom-page-header" style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ marginRight: 16 }}
          />
          <Title level={2} style={{ margin: 0 }}>{title}</Title>
        </div>
        <Divider />
      </>
    );
  }
}

export default ContentHeader;
