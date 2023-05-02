

import React, { useState, useEffect } from "react";
import { List, Button, Divider, Input, Statistic, Typography, Avatar, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LineChartOutlined, createFromIconfontCN } from '@ant-design/icons';
import { Table } from 'antd';
import constant from "../constants/MockData.json"
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import Card from "../components/dashboard/KPICard";

import 'gridstack/dist/gridstack.min.css';
import { GridStack } from 'gridstack';
import KPICard from "../components/dashboard/KPICard";

const { Search } = Input;

const Dashboard = () => {

    const [storyEditable, setStoryEditable] = React.useState(false);

    const editStory = (bool) => {
        setStoryEditable(bool);
        GridStack.init({
            float: true,
            staticGrid: !storyEditable
        });
    }

    const cards = [
        {
            type: "kpi", //chart text image
            options: {
                metrics: [
                    {
                        name: "Total Records",
                        value: 23123,
                    },
                    {
                        name: "High Priority Issues",
                        value: 23123,
                    }
                ]
            },
            title: "Total Records",
            id: "1"
        },
        {
            type: "kpi", //chart text image
            options: {
                metrics: [
                    {
                        name: "Statis De Faundr",
                        value: 3211,
                    },
                    {
                        name: "High Priority Issues",
                        value: 745,
                    }
                ]
            },
            title: "Max Priority",
            id: "2"
        },
        {
            type: "chart", //chart text image
            options: {
                chartType: "Column",
                config: {
                    data: [
                        {
                            type: '家具家电',
                            sales: 38,
                        },
                        {
                            type: '粮油副食',
                            sales: 112,
                        },
                        {
                            type: '生鲜水果',
                            sales: 61,
                        }
                    ],
                    xField: 'type',
                    height: "100%",
                    seriesField: "sales",
                    yField: 'sales',
                    appendPadding: 10
                }
            },
            title: "Hi Chart",
            id: "3"
        },
        {
            type: "chart", //chart text image
            options: {
                chartType: "Area",
                config: {
                    data: [
                        {
                            type: '家具家电',
                            sales: 38,
                        },
                        {
                            type: '粮油副食',
                            sales: 112,
                        },
                        {
                            type: '生鲜水果',
                            sales: 61,
                        }
                    ],
                    xField: 'type',
                    height: "100%",
                    yField: 'sales',
                    appendPadding: 10
                }
            },
            title: "Hi Chart",
            id: "4"
        }
    ]
    const positions = [
        {
            id: "1",
            x: 0,
            y: 1,
            h: 1,
            w: 2
        },
        {
            id: "2",
            x: 2,
            y: 1,
            h: 1,
            w: 2
        },
        {
            id: "3",
            x: 4,
            y: 0,
            h: 2,
            w: 6
        },
        {
            id: "4",
            x: 0,
            y: 4,
            h: 2,
            w: 2
        }
    ]

    const navigate = useNavigate();


    useEffect(() => {
        const grid = GridStack.init({
            float: true,
            staticGrid: !storyEditable
        });
    }, [storyEditable])

    return (
        <div>
            <div className="dashboardStoryHeader">
                <Typography.Title level={4} style={{ display: "inline" }}>Smart Analysis Dashboard</Typography.Title>
                <Space style={{ float: 'right' }}>
                    <Button >Add Chart</Button>
                    {!storyEditable ? <Button onClick={() => editStory(true)} size="small">Edit</Button> : null}
                    {storyEditable ? <Button onClick={() => editStory(false)} size="small">Save</Button> : null}
                    {storyEditable ? <Button onClick={() => editStory(false)} size="small">Cancel</Button> : null}
                    <Button>Delete</Button>
                </Space>
            </div>
            <div class="grid-stack" style={{ padding: "1rem" }}>
                {positions.map(e => {
                    return (
                        <div class="grid-stack-item" gs-w={e.w} gs-x={e.x} gs-y={e.y} gs-h={e.h} id={e.id}>
                            <div class="grid-stack-item-content">
                                <KPICard settings={cards.find(f => { return f.id == e.id })} />
                            </div>
                        </div>
                    )
                })}

            </div>
        </div>
    )
}

export default Dashboard;
