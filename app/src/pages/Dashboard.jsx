

import React, { useState, useEffect } from "react";
import { List, Button, Divider, Input, Statistic, Typography, Avatar, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LineChartOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import constant from "../constants/MockData.json"
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import axios from "axios"


const { Search } = Input;

const Dashboard = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = React.useState([])


    const fetchDashboard = async () => {
        axios
            .get("/api/getDashboards")
            .then((res) => {
                setDashboardData(res.data)
            })
    }


    useEffect(() => {
        fetchDashboard()
    }, [])

    const header = (
        <>
            <span>Available Dashboards ({constant.dashboardData.length})</span>
            {/* <Button shape="round" type="primary" icon={<PlusOutlined />} style={{ float: "right" }}
                onClick={() => { navigate("/createProject") }}
            >Create Dashboard</Button> */}
            <Search placeholder="Search by Dashboard Name or Description" style={{ float: "right", width: "30rem", marginRight: "2rem" }} />


        </>
    )
    return (
        <List
            split
            header={header}
            // footer={<div>Footer</div>}
            bordered
            dataSource={dashboardData}
            renderItem={(item) => (
                <List.Item
                    style={{margin:"10px"}}
                    actions={[
                        <Button icon={<LineChartOutlined />} type='link' onClick={() => { navigate(`/dashboardStory/${item.id}/view` )}} >View Dashboard</Button>,
                        <Button type="text" icon={<EditOutlined />} onClick={() => { navigate(`/dashboardStory/${item.id}/edit` )}} />,
                    ]}
                >
                    <List.Item.Meta
                        title={<>{item.name} </>}
                        description={item.description}
                    />
                    <div>
                        <Typography.Paragraph style={{ margin: "5px", color: "#00000051" }}>
                            Updated by {item.modifiedBy},{item.modifiedAt}
                        </Typography.Paragraph>

                    </div>
                </List.Item>
            )}
        />
    )
}

export default Dashboard;
