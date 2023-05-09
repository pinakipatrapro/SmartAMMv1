
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


const AddChart = (props) => {
    let columnData = props.dashboardDetails.project.configData.filter(e => { return e.enabled }).map(e => {
        return {
            label: `${e.colName} (${e.dataType})`,
            value: e.colName
        }
    })

    const addChartToDashboard = () => {
        let formattedDashboardDetails = JSON.parse(JSON.stringify(props.dashboardDetails));
        let cardIndex = formattedDashboardDetails.configData.cards.findIndex(e => {
            return e.id == props.selectedCard.id
        });
        formattedDashboardDetails.configData.cards.splice(cardIndex, 1, props.selectedCard)
        props.setDashboardDetails(formattedDashboardDetails)
    }


    const [selectedMeasures, setSelectedMeasures] = useState([])




    const onMeasureChange = (values, evt) => {
        setSelectedMeasures(values);
    }

    let setValue = (value, path) => {
        let selectedCardData = JSON.parse(JSON.stringify(props.selectedCard))
        selectedCardData = updateJSON(selectedCardData, value)
        props.setSelectedCard(selectedCardData)
    }

    let closeEditChartDialog = () => {
        props.setSelectedCard(null)
    }

    if (!props.selectedCard) {
        return null
    }

    
    return (
        <Drawer
            width={600}
            extra={
                <Space>
                    <Button type="primary" onClick={addChartToDashboard}>
                        Save
                    </Button>
                </Space>
            }
            title='Edit Chart' placement="right" open={!!props.selectedCard} onClose={closeEditChartDialog}>
            <Space direction="vertical" style={{ height: "400px", width: "100%" }}>
                <Typography.Paragraph>Configure the card properties here</Typography.Paragraph>
                <KPICard settings={props.selectedCard} isInGrid={false} />
                <Button form="cardForm" htmlType="submit" style={{ textAlign: "center", width: "100%" }} type="text" icon={<ReloadOutlined />}>Refresh</Button>
            </Space>
            <Form style={{ padding: "1rem" }} id="cardForm" onFinish={(evt) => {
                debugger
                ChartDataCreator.validateChartData(evt, props.setSelectedCard, props.selectedCard)
            }}>
                <Form.Item label="Chart Title" name="chartTitle">
                    <Input defaultValue={props.selectedCard.title} />
                </Form.Item>


                {props.selectedCard.type == 'chart' ? <>
                    <Form.Item label="Select Chart Type" name="chartType" >
                        <Select options={chartTypes} defaultValue={props.selectedCard.options.chartType} />
                    </Form.Item>
                    <Form.Item label="Select Dimension(s)" name="dimension">
                        <Select mode="multiple" options={columnData} value={props.selectedCard.options.config.dimension} />
                    </Form.Item>
                    <Form.Item label="Select Measure(s)" name="measure">
                        <Select mode="multiple" options={columnData} onChange={onMeasureChange} value={props.selectedCard.options.config.measure} />
                    </Form.Item>
                    <Collapse size="small" style={{ marginBottom: "15px" }}>
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

                    {/* <Form.Item label="Select Series(s)" name="series">
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
                    </Space> */}

                </>
                    : null}





            </Form>
        </Drawer>
    )
}


export default AddChart