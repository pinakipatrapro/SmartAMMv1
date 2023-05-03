

import React, { useState, useEffect } from "react";
import { Card, Divider, Button, Statistic, Space,Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LineChartOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import millify from "millify";
import { Column, Area } from '@ant-design/charts';

const chartsMap = { Column, Area };



const KPICard = (props) => {
  
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
            const ChartType = chartsMap[props.settings.options.chartType]
            return (
                <ChartType  {...props.settings.options.config} />
            )
        }

    }

    return (
        <Card  className={props.isInGrid?"cardFill":"chartCardHeight"} size="small"
            title={props.settings.title}
            extra= {props.mode=='edit'?<Button type="text" icon={<EditOutlined/>} />:null}
            
        >
            <div className="fullFill">
                {getCardContent()}
            </div>
        </Card>

    )
}

export default KPICard;
