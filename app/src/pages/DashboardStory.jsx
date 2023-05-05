

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
        debugger;
        axios
            .get("/api/getDashboardDetails/" + route.id)
            .then((res) => {

                setPositions(res.data.configData.layout)
                setCards(res.data.configData.charts)
                setDashboardDetails(res.data)
            })
    }

    const saveDashboardConfig = async () => {
        cards.forEach(e => {
            e.options.config.projectID = dashboardDetails.project.id
            try { delete e.options.config.data } catch (e) { }
        });
        let payload = {
            layout: dashboardEditLayout,
            cards: cards
        }
        axios
            .post("/api/updateDashboardConfig/" + route.id, payload)
            .then((res) => {

            })
    }

    useEffect(() => {
        fetchDashboard()
    }, [])

    const [positions, setPositions] = useState([]);
    const [cards, setCards] = useState([])


    const editStory = (bool) => {
        window.location.href = `/dashboardStory/${route.id}/${bool ? 'edit' : 'view'}`;
    }


    const onDeleteCard = (cardIndex) => {
        alert(cardIndex)
        let availablePositions = [...positions];
        let availableCards = [...cards];
        availablePositions.splice(cardIndex, 1)
        availableCards.splice(cardIndex, 1)
        setPositions(availablePositions)
        setCards(availableCards)
    }

    const editChart = (cardIndex) => {
        let selectedCard = { ...cards[cardIndex] }
        setChartSettings(selectedCard)
        setChartEditMode(true)
        setNewChart(true)
    }
 
    const openAddChart = (bool) => {
        setChartEditMode(false)
        setChartSettings({
            title: "My New Chart",
            type: "chart",
            options: {
                metrics: [],
                chartType: null,
                config: {
                    projectID: dashboardDetails.project.id
                }
            }
        })
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
                    {route.mode == 'edit' ? <Button type="primary" shape="circle" icon={<SaveOutlined />} onClick={saveDashboardConfig} ></Button> : null}
                    {route.mode == 'edit' ? <Button type="default" shape="circle" icon={<CloseOutlined />} onClick={() => editStory(false)} ></Button> : null}
                    <Button danger shape="circle" icon={<DeleteOutlined />}></Button>
                </Space>
            </div>

            <ResponsiveGridLayout
                className="layout"
                layout={positions}
                rowHeight={50}
                onLayoutChange={(layout) => {
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
                                    onEdit={() => {
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
