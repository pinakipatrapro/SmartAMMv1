
import React, { useState, useEffect } from "react";
import { Typography, Button, Divider, Input, Statistic, Space, Card, notification, Form, Col, Row } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LineChartOutlined, SaveOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import constant from "../constants/MockData.json"
import { BrowserRouter, Routes, Route, useParams, useNavigate } from "react-router-dom";
import millify from "millify";
import axios from "axios"
import ColumnCardsViewOnly from '../components/createProject/ColumnCardsViewOnly'
import CalculatedColOptionsEdit from "../components/createProject/CalculatedColOptionsEdit";

const { Search } = Input;
const { Title } = Typography;




const ProjectEdit = (props) => {
    const route = useParams()
    const [projectDetails, setProjectDetails] = useState(null)
    const setCalculatedColumns = (e) => {
        let projectData = JSON.parse(JSON.stringify(projectDetails));
        projectData.calculatedColumns = e;
        setProjectDetails(projectData)

    }

    const saveCalculatedColumns = (values) => {
        let projectData = JSON.parse(JSON.stringify(projectDetails));
        let calculatedCols = projectData.calculatedColumns;

        calculatedCols.forEach(col => {
            col.colName = values[col.id].columnName;
            col.prompts.forEach(prompt => {
                prompt.value = values[col.id][prompt.id].value
            })
        })
        axios
            .post("/api/editCalculatedColumns/" + route.id,calculatedCols)
            .then((res) => {
                props.openNotification('success', "Operation Successful", `Project updated successfully.`);
        })
    }
    const fetchProjectDetails = async () => {
        axios
            .get("/api/getProjectDetails/" + route.id)
            .then((res) => {
                setProjectDetails(res.data)
            })
    }

    useEffect(() => {
        fetchProjectDetails()
    }, [])

    if (!projectDetails) {
        return null
    }

    return (
        <>
            <Card title={projectDetails.name}
                extra={
                    <Space>Total Records : <Statistic value={projectDetails.rowsAnalysed} />

                    </Space>
                }
            >
                <Typography.Paragraph>Description : {projectDetails.description}</Typography.Paragraph>
            </Card>




            <Divider style={{ padding: "0rem 1rem 0 1rem" }}> Define Calculated Columns</Divider>
            <Form id="calculatedColumn" onFinish={saveCalculatedColumns}>

                <CalculatedColOptionsEdit setCalculatedColumns={setCalculatedColumns} calculatedColumns={projectDetails.calculatedColumns}
                    previewData={projectDetails.configData}
                />
            </Form>





            <Divider>Columns ({projectDetails.configData.length})</Divider>
            <Typography.Paragraph style={{ textAlign: "center" }} type="secondary">Editing columns in edit mode is not currently available. Please create a new project to re-define the columns</Typography.Paragraph>
            <Row gutter={[8, 8]} style={{ margin: "1rem" }}>
                {projectDetails.configData.map((e, i) => {
                    return (
                        <Col sm={24} md={3} lg={4} xl={6} >
                            <ColumnCardsViewOnly info={e} changeColumnEnabled={null} index={i} />
                        </Col>
                    )
                })}
            </Row>

        </>
    )
}

export default ProjectEdit;
