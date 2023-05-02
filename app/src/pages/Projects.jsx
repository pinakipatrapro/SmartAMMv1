
import React from 'react';
import { Typography,Button,Divider,Input,Statistic    } from 'antd';
import { PlusOutlined,EditOutlined,DeleteOutlined,LineChartOutlined    } from '@ant-design/icons';
import { Table } from 'antd';
import constant from "../constants/MockData.json"
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import millify from "millify";

const { Search } = Input;
const { Title } = Typography;




const Projects = () => {
    const navigate = useNavigate();
    const header = (
        <>
            <span>Available Projects ({constant.projectTable.length})</span>
            <Button shape="round" type="primary" icon={<PlusOutlined />} style={{float:"right"}}
                onClick={() => { navigate("/createProject") }} 
            >Create Project</Button>
            <Search placeholder="Search by Project Name or Description" style={{float:"right", width:"30rem",marginRight:"2rem"}}   />
            
            
        </>
    )
    const columns = [
        {
            title: 'Name',
            dataIndex: 'Name',
        },
        {
            title: 'Description',
            dataIndex: 'Description'
        },
        {
            title: 'Modified At',
            dataIndex: 'ModifiedAt'
        },
        {
            title: 'Updated By',
            dataIndex: 'ModifiedBy'
        },
        {
            title: 'Records',
            dataIndex: 'Records',
            align:"center",
            render: (text)=>  millify(text)
        },{
            title: 'Action',
            render: () => (
                <>
                    <Button type="text" icon={<EditOutlined />}/>
                    <Divider type="vertical" />
                    <Button type="text" icon={<LineChartOutlined />}/>
                    <Divider type="vertical" />
                    <Button danger type="text" icon={<DeleteOutlined  />}/>
                </>
            ),
          },
    ];

    return (
        <>
            <Table columns={columns} dataSource={constant.projectTable}  
                bordered 
                title={() => header}
                pagination={false}
                scroll={{y:"60vh"}}
            />
            
        </>
    )
}

export default Projects;
