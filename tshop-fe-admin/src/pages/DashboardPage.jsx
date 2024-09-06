import React, {  useState} from 'react';
import { Breadcrumb, Layout, Menu,  theme} from 'antd';
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { HomeOutlined, DesktopOutlined, AppstoreAddOutlined, UnorderedListOutlined, ProductOutlined, ShoppingOutlined, ContainerOutlined, FileOutlined, UserAddOutlined, UsergroupDeleteOutlined, LogoutOutlined } from '@ant-design/icons';
import Home from '../components/home/Home'; 
import AddOrEditCategory from '../components/categories/AddOrEditCategory';
import ListCategory from '../components/categories/ListCategory';
import UploadImage from '../products/UploadImage';
import AddOrEditProduct from '../products/AddOrEditProduct';
import ListProducts from '../products/ListProducts';



const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children, onClick) {
  return {
    label,
    key,
    icon,
    children,
    onClick,
  };
}

function DashboardPage() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);


  const items = [
    getItem('Home', '1', <HomeOutlined />, null, () => navigate("/")), 
    getItem('Category', '2', <DesktopOutlined />, [
      getItem('Add category', 'sub1', <AppstoreAddOutlined />, null, () => navigate("/categories/add")),
      getItem('List category', 'sub2', <UnorderedListOutlined />, null, () => navigate("/categories/list")),
    ]),
    getItem('Products', '5', <ProductOutlined />, [
      getItem('Upload Images', '5-1', <AppstoreAddOutlined />, null, () => navigate("/products/upload")),
      getItem('Add Products', '5-2', <UnorderedListOutlined />, null, () => navigate("/products/add")),
      getItem('List Products', '5-3', <UnorderedListOutlined />, null, () => navigate("/products/list")),
    ]),
    getItem('Orders', '6', <ShoppingOutlined />, null, () => console.log('Orders clicked')),
    getItem('Invoices', '7', <ContainerOutlined />, null, () => console.log('Invoices clicked')),
    getItem('Statistics', '8', <FileOutlined />, null, () => console.log('Statistics clicked')),
    getItem('Profiles', '9', <UserAddOutlined />, null, () => console.log('Profiles clicked')),
    getItem('Accounts', '10', <UsergroupDeleteOutlined />, null, () => console.log('Accounts clicked')),
    getItem('Logout', '11', <LogoutOutlined />, null, () => console.log('Logout clicked')),
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const breadcrumbItems = [
    { title: 'Dashboard' }
  ];

  return (
    <>
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        className='navbar' 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <h1 className='logo'>TShop</h1>
        <Menu 
          theme="dark" 
          defaultSelectedKeys={['1']} 
          mode="inline" 
          className='menu-navbar' 
          onClick={(e) => {
            const item = items.find((item) => item.key === e.key);
            if (item && item.onClick) {
              item.onClick();
            }
          }} 
          items={items.map(item => ({
            ...item,
            key: item.key || item.label
          }))} 
        />
      </Sider>
      <Layout className="site-layout">
        <Header 
          style={{ 
            padding: 0, 
            background: colorBgContainer
          }} 
        />
        <Content style={{ margin: '0 16px'}}>
          <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems}>
            {/* <Breadcrumb.Item>Dashboard</Breadcrumb.Item> */}
          </Breadcrumb>
          <div 
            style={{ 
              padding: 24, 
              minHeight: 760, 
              background: colorBgContainer, 
              borderRadius: borderRadiusLG 
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>TShop ©2024 Created by Tú Lê</Footer>
      </Layout>
    </Layout>
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />}>
        <Route index element={<Home />} />
        <Route path="categories/add" element={<AddOrEditCategory key='a'/>} />
        <Route path="categories/list" element={<ListCategory />} />
        <Route path="categories/update/:id" element={<AddOrEditCategory key='u' />} />

        <Route path="products/upload" element={<UploadImage />} />
        <Route path="products/add" element={<AddOrEditProduct/>} />
        <Route path="products/list" element={<ListProducts/>} />
        <Route path="products/update/:id" element={<AddOrEditProduct key='i'/>} />
        {/* Add other routes as needed */}
      </Route>
    </Routes>
  );
  
}

function App() {
  return (


      <AppRoutes/>


  );
}

export default App;
