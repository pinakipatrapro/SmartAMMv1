
import React, { useState, useEffect } from "react";
import { Typography, Button, Divider, Input, Statistic, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LineChartOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import constant from "../constants/MockData.json"
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import millify from "millify";
import axios from "axios"

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import csvDownload from "json-to-csv-export";
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

const { Search } = Input;
const { Title } = Typography;






const Projects = (props) => {

    const [projectData, setProjectData] = React.useState([]);
    const fetchProjects = async () => {
        axios
            .get("/api/getProjects")
            .then((res) => {
                setProjectData(res.data)
            })
    }
    const deleteProject = async (id) => {
        axios
            .get(`/api/deleteProject/${id}`)
            .then((res) => {
                props.openNotification('success', "Operation Successful", "Project deleted successfully")
                fetchProjects()
            })
            .catch(e => {
                props.openNotification('error', "Error Deleting Project", "" + e)
            })
    }

    const downloadCSVData = async (id) => {
        const result = await axios.get(`/api/getTableData/${id}`);
        const jsonData =  result.data;
        csvDownload({
            data: jsonData,
            filename: id,
            delimiter: ','
        })
    }

    useEffect(() => {
        fetchProjects()
    }, [])



    const navigate = useNavigate();
    const header = (
        <>
            <span>Available Projects ({projectData.length})</span>
            <Button shape="round" type="primary" icon={<PlusOutlined />} style={{ float: "right" }}
                onClick={() => { navigate("/createProject") }}
            >Create Project</Button>
            {/* <Search placeholder="Search by Project Name or Description" style={{ float: "right", width: "30rem", marginRight: "2rem" }} /> */}


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
            dataIndex: 'modifiedAt',
            sorter: (a, b) => new Date(a.modifiedAt) - new Date(b.modifiedAt),
            sortDirections: ["descend", "ascend"],
            render: (date) => timeAgo.format(new Date(date))
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
                    <Button type="text" icon={<EditOutlined />} onClick={() => { navigate('/projectEdit/' + id) }} />
                    <Divider type="vertical" />
                    <Button type="text" icon={<CloudDownloadOutlined />} onClick={() => downloadCSVData(id)} />
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
