import React, { useState, useEffect } from "react";
import { List, Button, Col, Divider, Row, Card, Statistic, Typography, Avatar, Tag, Space, Drawer, Tooltip } from 'antd';
import {
    PlusOutlined, FundViewOutlined, DeleteOutlined, LineChartOutlined,
    createFromIconfontCN, AppstoreAddOutlined, DashboardOutlined, WindowsFilled
} from '@ant-design/icons';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"


const { Meta } = Card;




const Home = () => {
    const [data, setData] = React.useState([])

    const navigate = useNavigate();
    const navToDashboard = () => {
        navigate('/dashboard')
    }
    const navToProject = (e) => {
        e.stopPropagation()
        navigate('/projects')
    }
    const navToCreateProject = (e) => {
        e.stopPropagation()
        navigate('/createProject')
    }

    const fetchData = async (config) => {
        axios
            .get("/api/home")
            .then((res) => {
                setData(res.data)
            })
    }

    useEffect(() => {
        fetchData()
    }, [])



    return (
        <>

            <Row  style={{ padding: "1rem", height: "80vh" }} gutter={[24, 12]}>
                <Col  md={12} sm={12} lg={6}>
                    <Card
                        hoverable
                        onClick={navToProject}
                        style={{ width: '100%' }}
                        cover={<img
                            style={{ objectFit: "cover", height: "3rem" }}
                            alt="example" src="https://img.freepik.com/premium-vector/modern-abstract-purple-circle-banner-background-vector-abstract-graphic-design-banner-pattern-background-template_181182-18208.jpg?w=360" />}
                        actions={[
                            <Tooltip title="Create New Project">
                                <Button icon={<AppstoreAddOutlined/>} type="ghost" onClick={navToCreateProject} >Create Project</Button>
                                </Tooltip>,
                            <Tooltip title="View Projects">
                                <Button icon={<FundViewOutlined/>} type="ghost" onClick={navToProject} >View Projects</Button>
                            </Tooltip>,
                        ]}
                    >
                        <Meta
                            title="Projects"
                            description="Upload data, manage calculated columns, create and manage data analysis projects"
                        />


                        <Space style={{ width: "100%", padding: "1rem", justifyContent: "space-around" }} direction="horizontal" align="end">
                            <Space direction="vertical" align="center">
                                <Statistic value={data.projectCount} />
                                <Typography.Paragraph type="secondary">Total Projects</Typography.Paragraph>
                            </Space>
                            <Space direction="vertical" align="center">
                                <Statistic value={data.recordsCount} />
                                <Typography.Paragraph type="secondary">Total Records</Typography.Paragraph>
                            </Space>
                        </Space>
                    </Card>
                </Col>
                <Col md={12} sm={12} lg={6}>
                    <Card
                        hoverable
                        onClick={navToDashboard}
                        style={{ width: '100%' }}
                        cover={<img
                            style={{ objectFit: "cover", height: "3rem" }}
                            alt="example" src="https://t4.ftcdn.net/jpg/04/71/08/25/360_F_471082528_kXEi4G1F5F1q0o7vQDg5jkEr1QSEgjPq.webp" />}
                        actions={[
                            <Tooltip title="View Dasbhboard(s)">
                                <Button icon={<DashboardOutlined/>} type="ghost" onClick={navToDashboard} >View Dashboards</Button>
                            </Tooltip>,
                        ]}
                    >
                        <Meta
                            title="Dashboards"
                            description="Create dashboard using project data and Drag and Drop Utility"
                        />


                        <Space style={{ width: "100%", padding: "1rem" }} direction="vertical" align="center">
                            <Statistic value={data.dashboardCount} />
                            <Typography.Paragraph type="secondary">Total Dashboards</Typography.Paragraph>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default Home;
