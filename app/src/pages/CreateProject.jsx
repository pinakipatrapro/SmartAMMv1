
import {
    Typography, Button, Form, Input, Upload, Select,
    Divider, Space, Popconfirm, notification
} from 'antd';
import { Col, Row } from 'antd';
import { UploadOutlined, FileExcelOutlined, SaveOutlined, PlusOutlined } from '@ant-design/icons';
import * as xlsx from "xlsx";
import React, { useState, useEffect } from "react";
import ColumnCards from '../components/createProject/ColumnCards'
import { useNavigate } from "react-router-dom";
import axios from "axios"
import customColTypes from "../constants/CalculatedColumns.json"
import CalulatedColOptions from "../components/createProject/CalculatedColOptions";

const { Option } = Select;

const { Dragger } = Upload;


const CreateProject = () => {
    const navigate = useNavigate();


    const [workbook, setWorkbook] = React.useState([]);
    const [data, setData] = React.useState([]);
    const [previewData, setPreviewData] = React.useState([]);
    const [calculatedColumns, setCalculatedColumns] = React.useState([]);


    //TODO Putin a seperate function
    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type, text, description) => {
        api[type]({
            message: text,
            description: description,
        });
    };

    const onFileSelected = (uploader) => {
        setWorkbook([]);
        setData([]);
        setPreviewData([])

        if (uploader.fileList.length) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                setWorkbook(xlsx.read(data, { type: "array" }));
            };
            reader.readAsArrayBuffer(uploader.file.originFileObj);
        }
    }

    const changeColumnEnabled = (checked, index) => {
        let previewDataCopy = JSON.parse(JSON.stringify(previewData));
        previewDataCopy[index].enabled = checked;
        setPreviewData(previewDataCopy)
    }

    const createDatPreview = (sheetData) => {
        if (!sheetData.length) {
            return
        }
        let previewData = [];
        let counter = sheetData.length > 5 ? 5 : sheetData.length;
        let dataSubset = sheetData.splice(0, counter)


        Object.keys(dataSubset[0]).forEach((e, i) => {
            let sampleValues = dataSubset.map(f => { return f[e] })
            let dataType = null;
            let valueTypes = sampleValues.map(e => {
                if (parseFloat(e) == e) {
                    return 'number'
                } else if (new Date(e) == 'Invalid Date') {
                    return typeof (e)
                } else {
                    return 'datetime'
                }
            })
            console.log(e, valueTypes)
            if (valueTypes.indexOf('string') > -1 || valueTypes.indexOf('undefined') > -1) {
                dataType = 'Text'
            } else if (valueTypes.indexOf('number') > -1) {
                dataType = 'Number'
            } else if (valueTypes.indexOf('datetime') > -1) {
                dataType = 'Date-Time'
            } else {
                dataType = 'Text'
            }
            console.log(dataType)
            previewData.push({
                colName: e,
                previewValues: Array.from(sampleValues, item => item || '<blank>'),
                enabled: true,
                dataType: dataType
            })
            console.log(dataType)
        });
        setPreviewData(previewData)

    }
    const onSheetSelection = (sheetName) => {
        let sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
            raw: false,
            defval: null
        })
        setData(sheetData)
        createDatPreview(sheetData);
    }

    const onFinish = (values) => {
        console.log('Success:', values);

        let formattedData = [...data]
        //Format Data
        let messages = []
        previewData.forEach(e => {
            if (e.dataType == 'Number') {
                formattedData.forEach((f, j) => {
                    try {
                        f[e.colName] = parseFloat(f[e.colName])
                    } catch (e) {
                        messages.push({
                            row: j,
                            value: formattedData[j],
                            errorType: "Number",
                            column: e.colName,
                            message: `Error parsing ${f[e.colName]} as a number`
                        })
                    }
                })
            } else if (e.dataType == 'Date-Time') {
                formattedData.forEach((f, j) => {
                    try {
                        if (!!f[e.colName] && !isNaN(Date.parse(f[e.colName]))) {
                            f[e.colName] = new Date(f[e.colName]).toISOString()
                        } else if (!!f[e.colName]) {
                            let dateParts = f[e.colName].split(/\s*[-./]\s*/)
                            f[e.colName] = new Date([dateParts[1], dateParts[0], dateParts[2]].join('-'))
                        }
                    } catch (err) {
                        debugger
                        messages.push({
                            row: j,
                            value: formattedData[j],
                            errorType: "Date-Time",
                            column: e.colName,
                            message: `Error parsing ${f[e.colName]} as a date-time`
                        })
                    }
                })
            }
        })
        //Chack Calculated Columns
        let calculatedCols = JSON.parse(JSON.stringify(calculatedColumns));
        calculatedCols.forEach(col=>{
            col.colName = values[col.id].columnName;
            col.prompts.forEach(prompt=>{
                prompt.value = values[col.id][prompt.id].value
            })
        })
        debugger;

        debugger;
        let payload = {
            name: values.name,
            description: values.description,
            modifiedBy: "Admin",
            configData: previewData,
            data: formattedData,
            calculatedCols : calculatedCols
        }
        axios
            .post("/api/createProject", payload)
            .then((res) => {
                openNotificationWithIcon('success', "Operation Successful", "Project created successfully");
                navigate("/projects")
            }).catch(e => {
                openNotificationWithIcon('erro', "Error", "Error creating project" + JSON.stringify(e))
            })
    };

    return (
        <>
            {contextHolder}
            <Typography.Title level={3} style={{ padding: "1rem" }}>Create New Project</Typography.Title>

            <Form onFinish={onFinish}>
                <Dragger customRequest={() => { }} showUploadList={false} maxCount={1} accept=".xlsx" onChange={onFileSelected} >
                    <p className="ant-upload-drag-icon">
                        <FileExcelOutlined />
                    </p>
                    <p className="ant-upload-text">Upload File for creating a project</p>
                    <p className="ant-upload-hint">
                        Click or drag file to this area to upload. Only single files are allowed with type xlsx.
                    </p>
                </Dragger>
                {!!workbook.SheetNames ?
                    <Select style={{ width: "100%", marginTop: "1rem" }}
                        placeholder="Select Sheet"
                        onSelect={onSheetSelection}
                    >{workbook.SheetNames.map(e => {
                        return (
                            <Option value={e}>{e}</Option>
                        )
                    })}
                    </Select> : null}

                {!!data.length ? <Row gutter={[8, 8]} style={{ margin: "1rem" }}>
                    <Divider >Select Columns  ( {data.length} Rows, {Object.keys(data[0]).length} Columns )</Divider>
                    {previewData.map((e, i) => {
                        return (
                            <Col sm={24} md={3} lg={4} xl={6} >
                                <ColumnCards info={e} changeColumnEnabled={changeColumnEnabled} index={i} />
                            </Col>
                        )
                    })}
                </Row> : null}
                {!!data.length ?
                    < >
                        <Divider style={{ padding: "0rem 1rem 0 1rem" }}> Define Calculated Columns</Divider>
                        <CalulatedColOptions setCalculatedColumns={setCalculatedColumns} calculatedColumns={calculatedColumns}
                            previewData={previewData}
                        />

                        <Divider >Upload data and create project</Divider>
                        <div style={{margin:"1rem"}}>
                            <Form.Item
                                label="Project Name"
                                name="name"
                                rules={[{ required: true, message: 'Please input Project Name' }]}

                            >
                                <Input placeholder="My Anaysis Project" />
                            </Form.Item>

                            <Form.Item
                                label="Project Description"
                                name="description"
                            >
                                <Input placeholder="Anaysis Description" />
                            </Form.Item>
                            <Button size="large" shape="round" htmlType="submit" type="primary" icon={<SaveOutlined />} >Create Project</Button>
                            <Popconfirm
                                title="Cancel Project Creation"
                                description="Are you sure to cancel the creation of project. All data will be lost?"
                                onConfirm={() => { navigate("/projects") }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button size="large" shape="round" danger style={{ margin: "1rem" }}>Cancel</Button>
                            </Popconfirm>
                        </div>
                    </> : null}

            </Form>



        </>
    )
}

export default CreateProject;
