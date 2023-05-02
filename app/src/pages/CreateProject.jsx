
import {
    Typography, Button, Form, Input, Upload, Select,
    Divider, Space, Popconfirm
} from 'antd';
import { Col, Row } from 'antd';
import { UploadOutlined, FileExcelOutlined, SaveOutlined } from '@ant-design/icons';
import * as xlsx from "xlsx";
import React, { useState, useEffect } from "react";
import ColumnCards from '../components/createProject/ColumnCards'
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const { Dragger } = Upload;

const onFinish = (values) => {
    console.log('Success:', values);
};


const CreateProject = () => {
    const navigate = useNavigate();

    const [workbook, setWorkbook] = React.useState([]);
    const [data, setData] = React.useState([]);
    const [previewData, setPreviewData] = React.useState([]);


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
            raw: false
        })
        setData(sheetData)
        createDatPreview(sheetData);
    }

    return (
        <>
            <Typography.Title level={3} style={{ padding: "1rem" }}>Create New Project</Typography.Title>

            <Form>
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
            </Form>
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
                <Form style={{ padding: "1rem" }} onFinish={onFinish}
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                    layout="horizontal">
                    <Divider >Upload data and create project</Divider>
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
                </Form>

                : null}


        </>
    )
}

export default CreateProject;
