
import {
    Typography, Button, Form, Input, Upload, Select, List, Table,
    Divider, Space, Popconfirm, notification, Popover
} from 'antd';
import { UploadOutlined, FileExcelOutlined, SaveOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from "react";
import customColTypes from "../../constants/CalculatedColumns.json"
import { v4 as uuidv4 } from 'uuid';






const CalculatedColOptions = (props) => {


    const columns = [
        {
            title: 'Column Name',
            dataIndex: 'name',
            width: '15%',
            render: (id) => (<Input />)
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
                            <Select style={{ width: "10rem" }} placeholder={e.name}
                                options={props.previewData.filter(col => { return col.dataType == e.dataType }).map(options => {
                                    return {
                                        label: options.colName,
                                        value: options.colName
                                    }
                                })}
                            />
                        )
                    })}
                </Space>
            )
        },
        {
            title: '',
            dataIndex: 'name',
            width: '5%',
            render: (_,item,index) => (<Button danger icon={<DeleteOutlined />} onClick={()=>{deleteCalcCol(index)}} />)
        }
    ];

    const addCustCol = (item, i) => {
        item.id=uuidv4()
        let availableCalcCols = JSON.parse(JSON.stringify(props.calculatedColumns))
        availableCalcCols.push(JSON.parse(JSON.stringify(item)))
        props.setCalculatedColumns(availableCalcCols)
    }

    const deleteCalcCol = (index) => {
        let availableCalcCols = JSON.parse(JSON.stringify(props.calculatedColumns))
        availableCalcCols.splice(index,1)
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
            <Popover trigger="click" title="Select Column Type" content={content} >
                <Button type='primary' icon={<PlusOutlined />}  >Add Calculated Column</Button>
            </Popover>
        </div>
    )
    return (
        <Form>
            <Table columns={columns} dataSource={props.calculatedColumns} style={{margin:"1rem"}}
                bordered
                title={() => header}
                pagination={false}
            // scroll={{ y: "60vh" }}
            />

        </Form>
    )
}

export default CalculatedColOptions;
