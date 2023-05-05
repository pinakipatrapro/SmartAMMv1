

import React, { useState, useEffect } from "react";
import { Card, Divider, Button, Statistic, Space, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import millify from "millify";
import { Column, Area, Line, Bar, DualAxes, Pie, WordCloud } from '@ant-design/charts';
import axios from "axios"
const chartsMap = { Column, Area, Line, Bar, DualAxes, WordCloud, Pie };





const KPICard = (props) => {
    const [data, setData] = React.useState([])

    let getCardContent = () => {
        if (props.settings.type == "kpi") {
            return (
                <Space direction="horizontal" style={{ width: "100%", justifyContent: "center" }}>
                    {props.settings.options.metrics.map((e, i) => {
                        return (
                            <>
                                <Statistic style={{ textAlign: "center" }}
                                    title={e.name}
                                    value={millify(e.value)}
                                    precision={0}
                                />
                                {
                                    i < props.settings.options.metrics.length - 1 ? <Divider type="vertical" /> : null
                                }
                            </>
                        )
                    })}
                </Space>
            )
        }
        if (props.settings.type == "chart") {
            if (!props.settings.options.chartType) {
                return null
            }
            const ChartType = chartsMap[props.settings.options.chartType]
            props.settings.options.config.data = data;
            return (
                <ChartType  {...props.settings.options.config} />
            )
        }

    }

    const fetchData = async (config) => {
        axios
            .post("/api/getChartData",props.settings)
            .then((res) => {
                setData(res.data)
            })
    }

    useEffect(() => {
        fetchData(props.settings)
    }, [])

    if(!data){
        return (<>Loading Data ...</>)
    }
    return (
        <Card className={props.isInGrid ? "cardFill" : "chartCardHeight"} size="small"
            title={props.settings.title}
            extra={props.mode == 'edit' ? <>
                <Button type="text" icon={<EditOutlined />} onClick={props.onEdit} />
                <Button type="text" danger icon={<DeleteOutlined />} onClick={props.onDelete} />
            </>
                :
                <>
                    <Button type="text" icon={<MoreOutlined />} />
                </>}

        >
            <div className="fullFill">
                {getCardContent()}
            </div>
        </Card>

    )
}

export default KPICard;
