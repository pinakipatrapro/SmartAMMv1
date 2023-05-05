import { Breadcrumb, Layout, Menu, theme, Typography } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { AppstoreAddOutlined, FundOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';

import { Avatar, Space } from 'antd';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import DashboardStory from "./pages/DashboardStory";

const { Title } = Typography;
const { Header, Content, Footer } = Layout;



const AppLayout = () => {
    const pathFormatter = (path) => {
        let routePath = path.split('/')[1]
        let params = path.split('/')[2];
        let name = ''
        switch (routePath) {
            case '':
                name = "Home"
                break;
            case 'projects':
                name = "Projects"
                break;
            case 'dashboard':
                name = "Dashboard"
                break;
            case 'createProject':
                name = "Create Project"
                break;
            case 'dashboardStory':
                name = `Dashboard ${params}`
                break;
            default:
                name = ""
        }
        return name
    }
    const location = useLocation();
    const navigate = useNavigate();

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout>
            <Header>
                <div className="logo" onClick={() => { navigate("/") }} >
                    <img style={{ height: "1.5rem" }} src="/assets/t-logo.png" />
                    <img style={{ height: "2.5rem", marginTop: "5px", marginRight: "2rem" }} src="/assets/smartamm.png" />
                </div>
                <div className="right-toolbar" >
                    <Avatar size={32} style={{ backgroundColor: "#ffffff55", verticalAlign: 'middle' }} src="https://randomuser.me/api/portraits/men/41.jpg" icon={<UserOutlined />} />
                </div>
                <Menu
                    style={{ width: "auto" }}
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={[location.pathname]}
                    items={[
                        {
                            "key": "/",
                            "label": "Home",
                            "icon": <HomeOutlined />,
                            onClick: () => { navigate("/") }
                        },
                        {
                            "key": "/projects",
                            "label": "Projects",
                            "icon": <AppstoreAddOutlined />,
                            onClick: () => { navigate("/projects") }
                        },
                        {
                            "key": "/dashboard",
                            "label": "Dashboard",
                            "icon": <FundOutlined />,
                            onClick: () => { navigate("/dashboard") }
                        }
                    ]}
                />

            </Header>
            <Content style={{ padding: '0 50px', minHeight: "85vh"}}>
                <Breadcrumb style={{ margin: "10px 0 10px 0" }}
                    items={[
                        {
                            href: '/',
                            title: <HomeOutlined />,
                        },
                        {
                            title: (
                                <Typography level="h5">{pathFormatter(location.pathname).length ? pathFormatter(location.pathname) : 'Home'}</Typography>
                            )
                        }
                    ]}
                />
                <div style={{ background: colorBgContainer, height: "100%" }}>
                    <Routes>
                        <Route index element={<Home />} />
                        <Route path="projects" element={<Projects />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="createProject" element={<CreateProject />} />
                        <Route path="createProject" element={<CreateProject />} />
                        <Route path="dashboardStory/:id/:mode" element={<DashboardStory />} />
                    </Routes>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center', fontSize: ".5rem" }}>© 2023 T-Systems - All Rights Reserved.</Footer>
        </Layout>
    );
};
export default AppLayout;
