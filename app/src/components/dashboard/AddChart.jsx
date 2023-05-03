
import React, { useState, useEffect } from "react";
import { List, Button, Divider, Input, Statistic, Typography, Radio, Select, Space, Drawer, Form } from 'antd';

import KPICard from "./KPICard";
import {
    CheckOutlined, CloseOutlined, PropertySafetyFilled, FontSizeOutlined,
    AreaChartOutlined, FieldTimeOutlined
} from '@ant-design/icons';


const chartTypes = [
    { value: 'Column', label: 'Column Chart' },
    { value: 'Area', label: 'Area Chart' },
]

const updateJSON = (data, mods) => {
    for (var path in mods) {
        var k = data;
        var steps = path.split('.');
        var last = steps.pop();
        steps.forEach(e => (k[e] = k[e] || {}) && (k = k[e]));
        k[last] = mods[path];
    }
    return data
}

const AddChart = (props) => {

    const [settings, setSettings] = useState({
        title: "My New Chart",
        type: "kpi",
        options: {
            metrics: [],
            chartType: "Column",
            config: {
                data: [{
                    "Country": "Ukraine",
                    "Sales": 247,
                    "Profit": 81
                }, {
                    "Country": "Peru",
                    "Sales": 164,
                    "Profit": 43
                }, {
                    "Country": "Philippines",
                    "Sales": 652,
                    "Profit": 33
                }, {
                    "Country": "China",
                    "Sales": 788,
                    "Profit": 52
                }],
                xField: 'Country',
                height: "100%",
                yField: 'Sales'
            }
        }
    })

    let setValue = (value, path) => {
        let settingsData = JSON.parse(JSON.stringify(settings))
        settingsData = updateJSON(settingsData, value)
        setSettings(settingsData)
    }


    return (
        <Drawer
            width={500}
            extra={
                <Space>
                    <Button type="primary" onClick={()=>{
                        props.addChart()
                        props.openAddChart(false)
                    }}>
                        Add
                    </Button>
                </Space>
            }
            title="Add New Chart" placement="right" open={props.newChart} onClose={() => { props.openAddChart(false) }}>
            <Space direction="vertical" style={{ height: "400px" }}>
                <Typography.Paragraph>Configure the chart properties here. The chart can be positioned and alined after adding to dashboard</Typography.Paragraph>
                <KPICard settings={settings} isInGrid={false} />
            </Space>
            <Form style={{ padding: "1rem" }}>
                <Form.Item label="Chart Title">
                    <Input defaultValue={settings.title} onChange={(evt) => {
                        setValue({ 'title': evt.target.value })
                    }} />
                </Form.Item>
                <Form.Item label="Card Type">
                    <Radio.Group value={settings.type} buttonStyle="solid" onChange={(evt) => {
                        setValue({
                            'type': evt.target.value
                        })
                    }}>
                        <Radio.Button value="kpi"><FontSizeOutlined />  KPI</Radio.Button>
                        <Radio.Button value="chart"><AreaChartOutlined /> Chart</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                {settings.type == 'chart' ? <Form.Item label="Select Chart Type">
                    <Select defaultValue={settings.options.chartType}
                        options={chartTypes}
                        onChange={(evt) => {
                            setValue({
                                'options.chartType': evt
                            })
                        }} />
                </Form.Item>
                    : null}
                
                <Divider plain>Filter & Sorters</Divider>

            </Form>
        </Drawer>
    )
}


export default AddChart