

import React from 'react';
import { List, Button, Divider, Input, Statistic, Typography, Avatar, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LineChartOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import constant from "../constants/MockData.json"
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";


const { Search } = Input;

const Dashboard = () => {
    const navigate = useNavigate();
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
            dataSource={constant.dashboardData}
            renderItem={(item) => (
                <List.Item
                    style={{margin:"10px"}}
                    actions={[
                        <Button icon={<LineChartOutlined />} type='link' onClick={() => { navigate(`/dashboardStory/${item.id}/view` )}} >View Dashboard</Button>,
                        <Button type="text" icon={<EditOutlined />} />,
                        <Button danger type="text" icon={<DeleteOutlined />} />
                    ]}
                >
                    <List.Item.Meta
                        title={<>{item.name}   <Tag color="magenta">Project : {item.project}</Tag></>}
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
