

import React, { useState, useEffect } from "react";
import { List, Button, Divider, Input, Statistic, Typography, Avatar, Tag, Space, Drawer } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LineChartOutlined, createFromIconfontCN, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"
import { Responsive, WidthProvider } from "react-grid-layout";

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import KPICard from "../components/dashboard/KPICard";
import AddChart from "../components/dashboard/AddChart"


const ResponsiveGridLayout = WidthProvider(Responsive);


const Dashboard = () => {

    const route = useParams()
    const navigate = useNavigate();

    const [dashboardDetails, setDashboardDetails] = useState(null)

    const fetchDashboard = async () => {
        axios
            .get("/api/getDashboardDetails/" + route.id)
            .then((res) => {
                setDashboardDetails(res.data)
            })
    }

    const saveDashboardConfig = async () => {
        let formattedDashboardDetails = JSON.parse(JSON.stringify(dashboardDetails))
        formattedDashboardDetails.configData.cards.forEach(e => {
            e.options.config.projectID = dashboardDetails.project.id
            try { delete e.options.config.data } catch (e) { }
        });

        let payload = {
            layout: formattedDashboardDetails.configData.layout,
            cards: formattedDashboardDetails.configData.cards
        }
        debugger
        axios
            .post("/api/updateDashboardConfig/" + route.id, payload)
            .then((res) => {

            })
    }

    useEffect(() => {
        fetchDashboard()
    }, [])


    const editStory = (bool) => {
        window.location.href = `/dashboardStory/${route.id}/${bool ? 'edit' : 'view'}`;
    }


    const onDeleteCard = (cardIndex) => {
        // alert(cardIndex)
        // let availablePositions = [...positions];
        // let availableCards = [...cards];
        // availablePositions.splice(cardIndex, 1)
        // availableCards.splice(cardIndex, 1)
        // setPositions(availablePositions)
        // setCards(availableCards)
    }

    const editChart = (cardIndex) => {
        // let selectedCard = { ...cards[cardIndex] }
        // setChartSettings(selectedCard)
        // setChartEditMode(true)
        // setNewChart(true)
    }

    const openAddChart = (bool) => {
        // setChartEditMode(false)
        // setChartSettings({
        //     title: "My New Chart",
        //     type: "chart",
        //     options: {
        //         metrics: [],
        //         chartType: null,
        //         config: {
        //             projectID: dashboardDetails.project.id
        //         }
        //     }
        // })
        // setNewChart(bool)
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
                    {route.mode == 'view' ? <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => editStory(true)}  ></Button> : null}
                    {/* {route.mode == 'edit' ? <Button type="primary"  icon={<LineChartOutlined />} onClick={() => { openAddChart(true) }} >Add Chart</Button> : null} */}
                    {route.mode == 'edit' ? <Button type="primary" shape="circle" icon={<SaveOutlined />} onClick={saveDashboardConfig} ></Button> : null}
                    {route.mode == 'edit' ? <Button type="default" shape="circle" icon={<CloseOutlined />} onClick={() => editStory(false)} ></Button> : null}
                </Space>
            </div>

            <ResponsiveGridLayout
                className="layout"
                rowHeight={50}
                onLayoutChange={(layout) => {
                    let tempDashboardDetails = JSON.parse(JSON.stringify(dashboardDetails))
                    layout.forEach(e => {
                        e.id = e.i;
                        delete e.i;
                    })
                    tempDashboardDetails.configData.layout = layout
                    setDashboardDetails(tempDashboardDetails)
                }}
                isDraggable={route.mode == 'edit'}
                isResizable={route.mode == 'edit'}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            >
                {
                    dashboardDetails.configData.layout.map((e, i) => {
                        return (
                            <div key={e.id} data-grid={{ x: e.x, y: e.y, w: e.w, h: e.h }}  >

                                <KPICard settings={dashboardDetails.configData.cards.find(f => { return f.id == e.id })}
                                    mode={route.mode} isInGrid={true}
                                    onDelete={() => {
                                        // onDeleteCard(i)
                                    }}
                                    onEdit={() => {
                                        // editChart(i)
                                    }}
                                />
                            </div>
                        )
                    })
                }
            </ResponsiveGridLayout>
            {/* {dashboardDetails ?
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
                : null} */}
        </div>
    )
}

export default Dashboard;
