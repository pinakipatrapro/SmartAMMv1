import { Breadcrumb, Layout, Menu, theme, Tooltip, Typography, Button } from 'antd';
import { AppstoreOutlined, PoweroffOutlined, SettingOutlined } from '@ant-design/icons';
import { AppstoreAddOutlined, FundOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from "react";

import { Avatar, Space } from 'antd';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import DashboardStory from "./pages/DashboardStory";

import ProjectEdit from './pages/ProjectsEdit';
import { useKeycloak } from '@react-keycloak/web'


const { Title } = Typography;
const { Header, Content, Footer } = Layout;




const AppLayout = () => {


    const { keycloak, initialized } = useKeycloak()
    const [profile, setProfile] = React.useState([]);
    useEffect(() => {
        setTimeout(e => {
            keycloak.loadUserInfo()
                .then(e => {
                    setProfile(e)
                    localStorage.setItem('userInfo', JSON.stringify(e))
                })
        }, 3000)
    }, [])

    const userLogout = () => {
        keycloak.logout()
    }

    
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
                name = `Dashboard`
                break;
            case 'projectEdit':
                name = `Projects`
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

    if(!initialized){
        return null
    }

    return (
        <Layout>
            <Header style={{
                position: 'sticky',
                top: 0,
                zIndex:99,
                width: '100%',
            }}>
                <div className="logo" onClick={() => { navigate("/") }} >
                    <img style={{ height: "1.5rem" }} src="/assets/t-logo.png" />
                    <img style={{ height: "2.5rem", marginTop: "5px", marginRight: "2rem" }} src="/assets/smartamm.png" />
                </div>
                <div className="right-toolbar" >
                    <Tooltip title={`Logout ${profile.name}`} onClick={userLogout} >
                        <Button type="text" danger icon={<PoweroffOutlined />}  ></Button>
                    </Tooltip>
                </div>
                <Menu
                    style={{ width: "auto" }}
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={[location.pathname]}
                    selectedKeys={[location.pathname]}
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
            <Content style={{ padding: '0 50px', minHeight: "85vh" }}>
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
                <div style={{ background: colorBgContainer, height: "auto",paddingBottom:"1rem" }}>
                    <Routes>
                        <Route index element={<Home />} />
                        <Route path="projects" element={<Projects />} />
                        <Route path="projectEdit/:id" element={<ProjectEdit />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="createProject" element={<CreateProject />} />
                        <Route path="createProject" element={<CreateProject />} />
                        <Route path="dashboardStory/:id/:mode" element={<DashboardStory />} />
                    </Routes>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center', fontSize: ".75rem" }}>© 2023 T-Systems - All Rights Reserved.</Footer>
        </Layout>
    );
};
export default AppLayout;
