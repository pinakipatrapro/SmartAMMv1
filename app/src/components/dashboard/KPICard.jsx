

import React, { useState,useRef, useEffect } from "react";
import { Card, Divider, Button, Statistic, Space, Popover } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import millify from "millify";
import { Column, Area, Line, Bar, DualAxes, Pie, WordCloud,Box } from '@ant-design/charts';
import axios from "axios"
import CardOptions from "./util/CardOptions"


const chartsMap = { Column, Area, Line, Bar, DualAxes, WordCloud, Pie,Box };





const KPICard = (props) => {
    const [data, setData] = React.useState([])
    const ref = useRef(null)


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

            props.settings.options.config.theme = {
                // styleSheet: {
                //     paletteQualitative10: [
                //         '#f02688',
                //         '#626681',
                //         '#FFC100',
                //         '#9FB40F',
                //         '#76523B',
                //         '#DAD5B5',
                //         '#0E8E89',
                //         '#E19348',
                //         '#F383A2',
                //         '#247FEA',
                //     ]
                // }
            }
            return (
                <ChartType  {...props.settings.options.config} />
            )
        }

    }

    const fetchData = async (config) => {
        axios
            .post("/api/getChartData", props.settings)
            .then((res) => {
                setData(res.data)
            })
    }

    useEffect(() => {
        fetchData(props.settings)
    }, [props.settings])

    if (!data) {
        return (<>Loading Data ...</>)
    }
    return (
        <Card className={props.isInGrid ? "cardFill" : "chartCardHeight"} size="small"
            title={props.settings.title}  ref={ref} id={`${props.settings.id}--chart`}
            extra={props.mode == 'edit' ? <>
                <Button type="text" icon={<EditOutlined />} onClick={props.onEdit} />
                <Button type="text" danger icon={<DeleteOutlined />} onClick={props.onDelete} />
            </>
                :
                <>
                    <Popover trigger="click" content={<CardOptions data={data} config={props.settings} reference={ref}/>} >
                        <Button type="text" icon={<MoreOutlined />} />
                    </Popover>

                </>}

        >
            <div className="fullFill">
                {getCardContent()}
            </div>
        </Card>

    )
}

export default KPICard;
