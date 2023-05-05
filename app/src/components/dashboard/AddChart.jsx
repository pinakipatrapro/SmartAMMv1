
import React, { useState, useEffect } from "react";
import {
    List, Button, Divider, Input, Statistic, Typography,
    Radio, Select, Space, Drawer, Form, Switch, Collapse
} from 'antd';

import KPICard from "./KPICard";
import {
    CheckOutlined, CloseOutlined, PropertySafetyFilled, FontSizeOutlined,
    AreaChartOutlined, FieldTimeOutlined, ReloadOutlined
} from '@ant-design/icons';

import ChartDataCreator from "./util/ChartDataCreator";
const { Panel } = Collapse;





const aggregationOptions = [
    { value: 'count', label: 'Count' },
    { value: 'max', label: 'Maximum' },
    { value: 'min', label: 'Minimum' },
    { value: 'sum', label: 'Sum' },
    { value: 'avg', label: 'Average' },
]


const chartTypes = [
    { value: 'Column', label: 'Column Chart' },
    { value: 'Area', label: 'Area Chart' },
    { value: 'Bar', label: 'Bar Chart' },
    { value: 'Line', label: 'Line Chart' },
    { value: 'Pie', label: 'Pie/Donught Chart' },
    { value: 'DualAxes', label: 'DualAxes Chart' },
    { value: 'WordCloud', label: 'Word Cloud Chart' },

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

const data = [{
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
}]
const AddChart = (props) => {
    let columnData = props.dashboardDetails.project.configData.filter(e => { return e.enabled }).map(e => {
        return {
            label: `${e.colName} (${e.dataType})`,
            value: e.colName
        }
    })

    const [settings, setSettings] = useState({
        title: "My New Chart",
        type: "chart",
        options: {
            metrics: [],
            chartType: null,
            config: {

            }
        }
    })

    const [selectedMeasures, setSelectedMeasures] = useState([])

    const onMeasureChange = (values, evt) => {
        setSelectedMeasures(values);
    }

    let setValue = (value, path) => {
        let settingsData = JSON.parse(JSON.stringify(settings))
        settingsData = updateJSON(settingsData, value)
        setSettings(settingsData)
    }



    return (
        <Drawer
            width={600}
            extra={
                <Space>
                    <Button type="primary" onClick={() => {
                        // props.addChart()
                        // props.openAddChart(false)
                    }}>
                        Add
                    </Button>
                </Space>
            }
            title="Add New Chart" placement="right" open={props.newChart} onClose={() => { props.openAddChart(false) }}>
            <Space direction="vertical" style={{ height: "400px" }}>
                <Typography.Paragraph>Configure the chart properties here. The chart can be positioned and alined after adding to dashboard</Typography.Paragraph>
                <KPICard settings={settings} isInGrid={false} />
                <Button form="cardForm" htmlType="submit" style={{ textAlign: "center", width: "100%" }} type="text" icon={<ReloadOutlined />}>Refresh</Button>
            </Space>
            <Form style={{ padding: "1rem" }} id="cardForm" onFinish={(evt) => ChartDataCreator.validateChartData(evt, setSettings)}>
                <Form.Item label="Chart Title" name="chartTitle">
                    <Input defaultValue={settings.title} onChange={(evt) => {
                        setValue({ 'title': evt.target.value })
                    }} />
                </Form.Item>


                {settings.type == 'chart' ? <>
                    <Form.Item label="Select Chart Type" name="chartType">
                        <Select options={chartTypes} />
                    </Form.Item>
                    <Form.Item label="Select Dimension(s)" name="dimension">
                        <Select mode="multiple" options={columnData} />
                    </Form.Item>
                    <Form.Item label="Select Measure(s)" name="measure">
                        <Select mode="multiple" options={columnData} onChange={onMeasureChange} />
                    </Form.Item>
                    <Collapse size="small" style={{ marginBottom: "15px"}}>
                        <Panel header={`Define Column Aggregations for Measures (${selectedMeasures.length})`}>
                            <>{
                                selectedMeasures.map(e => {
                                    return (
                                        <Form.Item name={['agg', e]} label={e}>
                                            <Select size="small" defaultActiveFirstOption options={aggregationOptions} style={{ width: "12rem" }} />
                                        </Form.Item>
                                    )
                                })
                            }
                            </>
                        </Panel>
                    </Collapse>

                    <Form.Item label="Select Series(s)" name="series">
                        <Select mode="multiple" options={columnData} />
                    </Form.Item>

                    <Space direction="horizontal">
                        <Form.Item label="Stacked" name="isStacked">
                            <Switch />
                        </Form.Item>
                        <Form.Item label="Grouped" name="isGroup">
                            <Switch />
                        </Form.Item>
                        <Form.Item label="Percent" name="isPercent">
                            <Switch />
                        </Form.Item>
                    </Space>

                </>
                    : null}





            </Form>
        </Drawer>
    )
}


export default AddChart