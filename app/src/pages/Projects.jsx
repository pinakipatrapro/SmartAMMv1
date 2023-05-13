
import React, { useState, useEffect } from "react";
import { Typography, Button, Divider, Input, Statistic, Popconfirm, notification } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LineChartOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import constant from "../constants/MockData.json"
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import millify from "millify";
import axios from "axios"

const { Search } = Input;
const { Title } = Typography;




const Projects = () => {

    const [projectData, setProjectData] = React.useState([])

    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, text, description) => {
        api[type]({
            message: text,
            description: description,
        });
    };

    const fetchProjects = async () => {
        axios
            .get("/api/getProjects")
            .then((res) => {
                setProjectData(res.data)
            })
    }
    const deleteProject = async (id) => {
        ;
        axios
            .get(`/api/deleteProject/${id}`)
            .then((res) => {
                openNotificationWithIcon('success', "Operation Successful", "Project deleted successfully")
                fetchProjects()
            })
    }

    useEffect(() => {
        fetchProjects()
    }, [])



    const navigate = useNavigate();
    const header = (
        <>
            <span>Available Projects ({constant.projectTable.length})</span>
            <Button shape="round" type="primary" icon={<PlusOutlined />} style={{ float: "right" }}
                onClick={() => { navigate("/createProject") }}
            >Create Project</Button>
            <Search placeholder="Search by Project Name or Description" style={{ float: "right", width: "30rem", marginRight: "2rem" }} />


        </>
    )
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description'
        },
        {
            title: 'Modified At',
            dataIndex: 'modifiedAt'
        },
        {
            title: 'Updated By',
            dataIndex: 'modifiedBy'
        },
        {
            title: 'Records',
            dataIndex: 'rowsAnalysed',
            align: "center",
            render: (text) => millify(text)
        }, {
            title: 'Action',
            dataIndex: 'id',
            render: (id) => (
                <>
                    <Button type="text" icon={<EditOutlined />} onClick={()=>{navigate('/projectEdit/'+id)}} />
                    <Divider type="vertical" />
                    {/* <Button type="text" icon={<LineChartOutlined />} /> */}
                    {/* <Divider type="vertical" /> */}
                    <Popconfirm
                        title="Are you Sure?"
                        description="Are you sure to delete the project. All data and analytics will be lost"
                        onConfirm={() => { deleteProject(id) }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger type="text" icon={<DeleteOutlined />} />
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <>
            {contextHolder}

            <Table columns={columns} dataSource={projectData}
                bordered
                title={() => header}
                pagination={false}
            // scroll={{ y: "60vh" }}
            />

        </>
    )
}

export default Projects;
