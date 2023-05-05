

import React, { useState, useEffect } from "react";
import { List, Button, Divider, Input, Statistic, Typography, Avatar, Tag, Space, Drawer } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LineChartOutlined, createFromIconfontCN, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import constant from "../constants/MockData.json"
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"



import { Responsive, WidthProvider } from "react-grid-layout";

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import KPICard from "../components/dashboard/KPICard";
import AddChart from "../components/dashboard/AddChart"


const ResponsiveGridLayout = WidthProvider(Responsive);
const { Search } = Input;

const Dashboard = () => {

    const route = useParams()
    const navigate = useNavigate();
    const [chartSettings, setChartSettings] = useState(false)
    const [chartEditMode, setChartEditMode] = useState(false)

    const [dashboardEditLayout, setDashboardEditLayout] = useState(false)


    const [newChart, setNewChart] = useState(false)
    const [dashboardDetails, setDashboardDetails] = React.useState(null)

    const fetchDashboard = async () => {
        axios
            .get("/api/getDashboardDetails/" + route.id)
            .then((res) => {
                setDashboardDetails(res.data)
            })
    }

    useEffect(() => {
        fetchDashboard()
    }, [])

    const [positions, setPositions] = useState([
        {
            i: "1",
            x: 0,
            y: 0,
            h: 2,
            w: 3
        },
        {
            i: "2",
            x: 0,
            y: 2,
            h: 2,
            w: 3
        },
        {
            i: "3",
            x: 3,
            y: 0,
            h: 4,
            w: 9
        },
        {
            i: "4",
            x: 0,
            y: 4,
            h: 6,
            w: 12
        }
    ]);
    const [cards, setCards] = useState([
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
                    }, {
                        "Country": "India",
                        "Sales": 123,
                        "Profit": 52
                    }],
                    xField: 'Country',
                    height: "100%",
                    yField: 'Sales'
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
                    data: [{
                        "Category": "Thoughtbeat",
                        "Sub-Category": "Human Resources",
                        "Tickets": 434
                    }, {
                        "Category": "Browsezoom",
                        "Sub-Category": "Research and Development",
                        "Tickets": 964
                    }, {
                        "Category": "Kazu",
                        "Sub-Category": "Product Management",
                        "Tickets": 799
                    }, {
                        "Category": "Gabtype",
                        "Sub-Category": "Legal",
                        "Tickets": 813
                    }, {
                        "Category": "Tazzy",
                        "Sub-Category": "Human Resources",
                        "Tickets": 836
                    }, {
                        "Category": "Brainlounge",
                        "Sub-Category": "Sales",
                        "Tickets": 605
                    }],
                    xField: 'Category',
                    height: "100%",
                    yField: 'Tickets',
                    seriesField: "Sub-Category"
                }
            },
            title: "Tickets Count by Categories",
            id: "4"
        }
    ])



    const editStory = (bool) => {
        window.location.href = `/dashboardStory/${route.id}/${bool ? 'edit' : 'view'}`;
    }


    const onDeleteCard = (cardIndex) => {
        alert(cardIndex)
        let availablePositions = [...positions];
        let availableCards = [...cards];
        availablePositions.splice(cardIndex,1)
        availableCards.splice(cardIndex,1)
        setPositions(availablePositions)
        setCards(availableCards)
    }

    const editChart = (cardIndex) => {
        let selectedCard = {...cards[cardIndex]}
        setChartSettings(selectedCard)
        setChartEditMode(true)
        setNewChart(true)
    }
    let createSettings = {
        title: "My New Chart",
        type: "chart",
        options: {
            metrics: [],
            chartType: null,
            config: {

            }
        }
    }
    const openAddChart = (bool) => {
        setChartEditMode(false)
        setChartSettings(createSettings)
        setNewChart(bool)
    }

    if (!dashboardDetails) {
        return null
    }

    return (
        <div>
            <div className="dashboardStoryHeader">
                <Typography.Title level={5} style={{ display: "inline" }}>{dashboardDetails.name}</Typography.Title>
                <Tag color="magenta" style={{ marginLeft: "2rem" }}>Project : {dashboardDetails.project.name}</Tag>
                <Space style={{ float: 'right' }}>
                    {route.mode == 'edit' ? <Button type="primary" icon={<LineChartOutlined />} onClick={() => { openAddChart(true) }} >Add Chart</Button> : null}
                    {route.mode == 'view' ? <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => editStory(true)}  ></Button> : null}
                    {route.mode == 'edit' ? <Button type="primary" shape="circle" icon={<SaveOutlined />} onClick={() => editStory(false)} ></Button> : null}
                    {route.mode == 'edit' ? <Button type="default" shape="circle" icon={<CloseOutlined />} onClick={() => editStory(false)} ></Button> : null}
                    <Button danger shape="circle" icon={<DeleteOutlined />}></Button>
                </Space>
            </div>

            <ResponsiveGridLayout
                className="layout"
                layout={positions}
                rowHeight={50}
                onLayoutChange={(layout)=>{
                    setDashboardEditLayout(layout)
                }}
                isDraggable={route.mode == 'edit'}
                isResizable={route.mode == 'edit'}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            >
                {
                    positions.map((e, i) => {
                        return (
                            <div key={e.i} data-grid={{ x: e.x, y: e.y, w: e.w, h: e.h }}  >

                                <KPICard settings={cards.find(f => { return f.id == e.i })}
                                    mode={route.mode} isInGrid={true}
                                    onDelete={() => {
                                        onDeleteCard(i)
                                    }}
                                    onEdit={()=>{
                                        editChart(i)
                                    }}
                                />
                            </div>
                        )
                    })
                }
            </ResponsiveGridLayout>
            {dashboardDetails ?
                <AddChart newChart={newChart}
                    openAddChart={openAddChart}
                    // addChart={addChart}
                    dashboardDetails={dashboardDetails}
                    setDashboardDetails={setDashboardDetails}
                    positions={positions}
                    setPositions={setPositions}
                    cards={cards}
                    setCards={setCards}
                    settings={chartSettings}
                    setSettings={setChartSettings}
                    isEditMode={chartEditMode}
                />
                : null}
        </div>
    )
}

export default Dashboard;
