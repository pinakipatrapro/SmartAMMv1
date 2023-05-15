
import {
    Typography, Button, Form, Input, Upload, Select, List, Table,
    Divider, Space, Popconfirm, notification, Popover
} from 'antd';
import { UploadOutlined, FileExcelOutlined, SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from "react";
import customColTypes from "../../constants/CalculatedColumns.json"
import { v4 as uuidv4 } from 'uuid';






const CalculatedColOptionsEdit = (props) => {



    const columns = [
        {
            title: 'Column Name',
            dataIndex: 'colName',
            width: '15%',
            render: (text, item, index) => (
                <Form.Item name={[item.id, 'columnName']} initialValue={text} 
                    rules={[{ required: true, message: 'Please input column name' }]}>
                    <Input placeholder='Calculated Column Name'
                        />
                </Form.Item>
            )
        },
        {
            title: 'Type',
            dataIndex: 'name',
            width: '15%'
        },
        {
            title: 'Input Values',
            dataIndex: 'modifiedAt',
            render: (_, item) => (
                <Space>
                    {item.prompts.map(e => {
                        return (
                            <Form.Item name={[item.id, e.id, 'value']} rules={[{ required: true, message: 'Please select column' }]} initialValue={e.value} >
                                <Select style={{ width: "10rem" }} placeholder={e.name} 
                                    options={props.previewData.filter(col => { return col.dataType == e.dataType }).map(options => {
                                        return {
                                            label: options.colName,
                                            value: options.colName
                                        }
                                    })}
                                />
                            </Form.Item>
                        )
                    })}
                </Space>
            )
        },
        {
            title: '',
            dataIndex: 'name',
            width: '5%',
            render: (_, item, index) => (<Button danger icon={<DeleteOutlined />} onClick={() => { deleteCalcCol(index) }} />)
        }
    ];

    const addCustCol = (item, i) => {
        item.id = uuidv4()
        let availableCalcCols = JSON.parse(JSON.stringify(props.calculatedColumns))
        availableCalcCols.push(JSON.parse(JSON.stringify(item)))
        props.setCalculatedColumns(availableCalcCols)
    }

    const deleteCalcCol = (index) => {
        let availableCalcCols = JSON.parse(JSON.stringify(props.calculatedColumns))
        availableCalcCols.splice(index, 1)
        props.setCalculatedColumns(availableCalcCols)
    }

    let content = (
        <>
            <List style={{ width: "30rem" }}
                dataSource={customColTypes}
                renderItem={(item, i) => (
                    <List.Item key={item.name} style={{ padding: ".5rem", cursor: "pointer" }} onClick={() => { addCustCol(item, i) }}>
                        <List.Item.Meta
                            title={item.name}
                            description={item.tags.join(",")}
                        />
                    </List.Item>
                )}
            />
        </>
    )
    let header = (
        <div style={{ justifyContent: "flex-end", display: "flex" }}>
            <Space>
                <Popover trigger="click" title="Select Column Type" content={content} >
                    <Button type='default' icon={<PlusOutlined />}  >Add Calculated Column</Button>
                </Popover>
                <Button htmlType="submit" form="calculatedColumn" type="primary" icon={<SaveOutlined />}>Save</Button>
            </Space>
        </div>
    )
    return (
        <Table columns={columns} dataSource={props.calculatedColumns} style={{ margin: "1rem" }}
            bordered
            title={() => header}
            pagination={false}
        />
    )
}

export default CalculatedColOptionsEdit;
