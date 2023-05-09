
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
import EditChartLegend from "./util/EditChartLegend";

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


const EditChartDrawer = (props) => {
    let calculatedCols = props.dashboardDetails.project.calculatedColumns.map(e=>{
        return{
            label: `${e.colName} (${e.dataType})`,
            value: e.colName
        }
    })
    let columnData = props.dashboardDetails.project.configData.filter(e => { return e.enabled }).map(e => {
        return {
            label: `${e.colName} (${e.dataType})`,
            value: e.colName
        }
    })
    columnData = [...columnData,...calculatedCols];

    const addChartToDashboard = () => {
        let formattedDashboardDetails = JSON.parse(JSON.stringify(props.dashboardDetails));
        let cardIndex = formattedDashboardDetails.configData.cards.findIndex(e => {
            return e.id == props.selectedCard.id
        });
        formattedDashboardDetails.configData.cards.splice(cardIndex, 1, props.selectedCard)
        props.setDashboardDetails(formattedDashboardDetails)
        closeEditChartDialog()

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
                    <Button type="primary" onClick={addChartToDashboard} htmlType="submit" form="cardForm">
                        Save
                    </Button>
                </Space>
            }
            title='Edit Chart' placement="right" open={!!props.selectedCard} onClose={closeEditChartDialog}>
            <Space direction="vertical" style={{ height: "400px", width: "100%" }}>
                <Typography.Paragraph>Configure the card properties here</Typography.Paragraph>
                <KPICard settings={props.selectedCard} isInGrid={false} mode='view'/>
                <Button form="cardForm" htmlType="submit" style={{ textAlign: "center", width: "100%" }} type="text" icon={<ReloadOutlined />}>Refresh</Button>
            </Space>
            <Form inial style={{ padding: "1rem" }} id="cardForm" onFinish={(evt) => {
                ChartDataCreator.validateChartData(evt, props.setSelectedCard, props.selectedCard)
            }}>
                <Form.Item label="Chart Title" name="chartTitle" initialValue={props.selectedCard.title} >
                    <Input />
                </Form.Item>


                {props.selectedCard.type == 'chart' ? <>
                    <Form.Item label="Select Chart Type" name="chartType" initialValue={props.selectedCard.options.chartType} >
                        <Select options={chartTypes} />
                    </Form.Item>
                    <Form.Item label="Select Dimension(s)" name="dimension" initialValue={props.selectedCard.options.config.dimension}>
                        <Select mode="multiple" options={columnData} />
                    </Form.Item>
                    <Form.Item label="Select Measure(s)" name="measure" initialValue={props.selectedCard.options.config.measure}>
                        <Select mode="multiple" options={columnData} onChange={onMeasureChange} />
                    </Form.Item>
                    {!!selectedMeasures.length ?
                        <Collapse size="small" style={{ marginBottom: "15px" }}>
                            <Panel header={`Define Column Aggregations for Measures (${selectedMeasures.length})`}>
                                <>{
                                    selectedMeasures.map(e => {
                                        return (
                                            <Form.Item name={['agg', e]} label={e} initialValue>
                                                <Select size="small" defaultActiveFirstOption options={aggregationOptions} style={{ width: "12rem" }} />
                                            </Form.Item>
                                        )
                                    })
                                }
                                </>
                            </Panel>
                        </Collapse>
                        :
                        <Collapse size="small" style={{ marginBottom: "15px" }}>
                            <Panel header={`Define Column Aggregations for Measures (${props.selectedCard.options.config.measure.length})`}>
                                <>{
                                    props.selectedCard.options.config.measure.map(e => {
                                        return (
                                            <Form.Item name={['agg', e]} label={e} initialValue={props.selectedCard.options.config.agg ? props.selectedCard.options.config.agg[e] : null}>
                                                <Select size="small" defaultActiveFirstOption options={aggregationOptions} style={{ width: "12rem" }} />
                                            </Form.Item>
                                        )
                                    })
                                }
                                </>
                            </Panel>
                        </Collapse>
                    }


                    <Form.Item label="Select Series(s)" name="series" initialValue={props.selectedCard.options.config.series}>
                        <Select mode="multiple" options={columnData} />
                    </Form.Item>

                    <Space direction="horizontal" >
                        <Form.Item label="Stacked" name="isStack" >
                            <Switch defaultChecked={props.selectedCard.options.config.isStack} />
                        </Form.Item>
                        <Form.Item label="Grouped" name="isGroup" >
                            <Switch defaultChecked={props.selectedCard.options.config.isGroup} />
                        </Form.Item>
                        <Form.Item label="Percent" name="isPercent" >
                            <Switch defaultChecked={props.selectedCard.options.config.isPercent} />
                        </Form.Item>
                    </Space>
                    <EditChartLegend selectedCard={props.selectedCard}/>

                </>
                    : null}





            </Form>
        </Drawer>
    )
}


export default EditChartDrawer