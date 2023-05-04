
import React, { useState, useEffect } from "react";
import { List, Button, Divider, Input, Statistic, Typography, Radio, Select, Space, Drawer, Form } from 'antd';

import KPICard from "./KPICard";
import {
    CheckOutlined, CloseOutlined, PropertySafetyFilled, FontSizeOutlined,
    AreaChartOutlined, FieldTimeOutlined
} from '@ant-design/icons';

import ChartDataCreator from "./ChartDataCreator";
console.log(ChartDataCreator)

const configSettings = [{ "colName": "__EMPTY", "enabled": true, "dataType": "Number", "previewValues": ["0", "1", "2", "3", "4"] }, { "colName": "Number", "enabled": true, "dataType": "Text", "previewValues": ["INC0685001", "INC0685445", "INC0685451", "INC0685469", "INC0685485"] }, { "colName": "Business service(u_business_service)", "enabled": true, "dataType": "Text", "previewValues": ["MyProvi (AWS) - MyCollections", "FOCUS", "Baena-Comissions", "FOCUS", "FOCUS"] }, { "colName": "Category(u_category)", "enabled": true, "dataType": "Text", "previewValues": ["Clip Download", "White/Green screen", "Baena-Comissions", "Customer", "Account"] }, { "colName": "Subcategory(u_subcategory)", "enabled": true, "dataType": "Text", "previewValues": ["Clip Data issue", "Application", "Tech Support", "incorrect status", "Password reset"] }, { "colName": "Caller", "enabled": true, "dataType": "Text", "previewValues": ["Carlos Alberto Mendez Ibarra", "Leon 3", "San Luis 2", "Queretaro 1", "Animas Branch"] }, { "colName": "Subject", "enabled": true, "dataType": "Text", "previewValues": ["No descarga Clip", "Sin Acceso a Focus", "Problemas para comisionar en BAENA", "El cliente 527794 Maria de los Angeles Guerrero Padilla, esta liquidado, pero aparece con estatus ACTUAL", "Cuenta de focus bloqueada"] }, { "colName": "Subject_translated", "enabled": true, "dataType": "Text", "previewValues": ["Not download Clip", "Without Access to Focus", "Problems to commission in BAENA", "The customer 527794 Married of los Angeles Guerrero Padilla, this liquidated, goal appears with CURRENT status", "Account of blocked focus"] }, { "colName": "Created", "enabled": true, "dataType": "Date-Time", "previewValues": ["2021-01-02 13:00:11", "2021-01-04 09:32:43", "2021-01-04 09:45:37", "2021-01-04 10:22:10", "2021-01-04 11:03:13"] }, { "colName": "State", "enabled": true, "dataType": "Text", "previewValues": ["Closed", "Resolved", "Closed", "Closed", "Closed"] }, { "colName": "Priority", "enabled": true, "dataType": "Text", "previewValues": ["3 - Moderate", "2 - High", "4 - Low", "3 - Moderate", "4 - Low"] }, { "colName": "Resolver Group", "enabled": true, "dataType": "Text", "previewValues": ["MX HO Aplicaciones", "MX Definity", "MX HO Aplicaciones", "MASTEK FOCUS Support", "MX HO FOCUS"] }, { "colName": "Resolution notes", "enabled": true, "dataType": "Text", "previewValues": ["Los clips no fueron generados en focus. Se solicitó a sucursal la generación del clip y ya pudieron ser descargados por los usuarios.", "El proceso de backup en Nerworker estaba en ejecución. En estos momentos la operación se encuentra estable.\r\n\r\nOutage: 40 Minutos,\r\nTipo: Full\r\nSucursales afectadas\r\nLN2050 Leon3\r\nLN2041 GDLSur\"\r\n", "Se ejecutan los queries semanales de carga de información. Baena ya muestra la información de la semana reciente. Se anexa evidencia", "Se corrige el estatus a liquidado", "Se resetea  la contraseña y se valida el acceso"] }, { "colName": "Assignment group", "enabled": true, "dataType": "Text", "previewValues": ["MX HO Aplicaciones", "MX HO FOCUS", "MX HO Aplicaciones", "MX HO FOCUS", "MX HO FOCUS"] }, { "colName": "Has breached", "enabled": true, "dataType": "Text", "previewValues": ["FALSE", "TRUE", "TRUE", "FALSE", "FALSE"] }, { "colName": "Year_Created", "enabled": true, "dataType": "Number", "previewValues": ["2021", "2021", "2021", "2021", "2021"] }, { "colName": "Month_Created", "enabled": true, "dataType": "Date-Time", "previewValues": ["January - 2021", "January - 2021", "January - 2021", "January - 2021", "January - 2021"] }, { "colName": "Date_Created", "enabled": true, "dataType": "Number", "previewValues": ["2", "4", "4", "4", "4"] }, { "colName": "Day_Created", "enabled": true, "dataType": "Text", "previewValues": ["Saturday", "Monday", "Monday", "Monday", "Monday"] }, { "colName": "Hour_Created", "enabled": true, "dataType": "Number", "previewValues": ["13", "9", "9", "10", "11"] }]

let columnData = configSettings.filter(e => { return e.enabled }).map(e => {
    return {
        label: `${e.colName} (${e.dataType})`,
        value: e.colName
    }
})

const chartTypes = [
    { value: 'Column', label: 'Column Chart' },
    { value: 'Area', label: 'Area Chart' },
    { value: 'Bar', label: 'Bar Chart' },
    { value: 'Line', label: 'Line Chart' },
    { value: 'DualAxes', label: 'DualAxes Chart' },

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

    const [settings, setSettings] = useState({
        title: "My New Chart",
        type: "chart",
        options: {
            metrics: [],
            chartType: "Column",
            config: {
                data: [data, data],
                xField: ['Country'],
                height: "100%",
                yField: ['Sales', 'Profit']
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
                    <Button type="primary" form="cardForm" htmlType="submit" onClick={() => {
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
            </Space>
            <Form style={{ padding: "1rem" }} id="cardForm" onFinish={ChartDataCreator.validateChartData}>
                <Form.Item label="Chart Title" name="chartTitle">
                    <Input defaultValue={settings.title} onChange={(evt) => {
                        setValue({ 'title': evt.target.value })
                    }} />
                </Form.Item>
                <Form.Item label="Card Type" name="cardType">
                    <Radio.Group value={settings.type} buttonStyle="solid" onChange={(evt) => {
                        setValue({
                            'type': evt.target.value
                        })
                    }}>
                        <Radio.Button value="kpi"><FontSizeOutlined />  KPI</Radio.Button>
                        <Radio.Button value="chart"><AreaChartOutlined /> Chart</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                {settings.type == 'chart' ? <>
                <Form.Item label="Select Chart Type" name="chartType">
                    <Select
                        options={chartTypes}
                        onChange={(evt) => {
                            setValue({
                                'options.chartType': evt
                            })
                        }} />
                </Form.Item>
                    <Form.Item label="Select Dimension(s)" name="dimension">
                        <Select mode="multiple" options={columnData} />
                    </Form.Item>
                    <Form.Item label="Select Measure(s)" name="measure">
                        <Select mode="multiple" options={columnData} />
                    </Form.Item>
                    <Form.Item label="Select Series(s)" name="series">
                        <Select mode="multiple" options={columnData} />
                    </Form.Item>
                </>
                    : null}



            </Form>
        </Drawer>
    )
}


export default AddChart