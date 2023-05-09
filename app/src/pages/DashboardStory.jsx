

import React, { useState, useEffect } from "react";
import { List, Button, Divider, Input, Statistic, Typography, Avatar, Tag, Space, Drawer } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LineChartOutlined, createFromIconfontCN, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"
import { Responsive, WidthProvider } from "react-grid-layout";
import { v4 as uuidv4 } from 'uuid';
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import KPICard from "../components/dashboard/KPICard";
import AddChart from "../components/dashboard/EditChartDrawer"


const ResponsiveGridLayout = WidthProvider(Responsive);


const Dashboard = () => {

    const route = useParams()
    const navigate = useNavigate();

    const [dashboardDetails, setDashboardDetails] = useState(null)
    const [tempLayout, setTempLayout] = useState(null)
    const [selectedCard, setSelectedCard] = useState(null)

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
        formattedDashboardDetails.configData.layout = tempLayout.map(e => {
            e.id = e.i
            delete e.i;
            return e
        })
        let payload = {
            layout: formattedDashboardDetails.configData.layout,
            cards: formattedDashboardDetails.configData.cards
        }
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


    const onDeleteCard = (cardID) => {
        let formattedDashboardDetails = JSON.parse(JSON.stringify(dashboardDetails))

        formattedDashboardDetails.configData.layout.splice(
            formattedDashboardDetails.configData.layout.findIndex(e => { return e.id == cardID })
            , 1)

        formattedDashboardDetails.configData.cards.splice(
            formattedDashboardDetails.configData.cards.findIndex(e => { return e.id == cardID })
            , 1)

        setDashboardDetails(formattedDashboardDetails)
    }

    const editChart = (cardID) => {
        let formattedDashboardDetails = JSON.parse(JSON.stringify(dashboardDetails))
        setSelectedCard(formattedDashboardDetails.configData.cards.find(e => { return e.id == cardID }))
        // let selectedCard = { ...cards[cardIndex] }
        // setChartSettings(selectedCard)
        // setChartEditMode(true)
        // setNewChart(true)
    }

    const addCard = (bool) => {
        let cardID = uuidv4()
        let formattedDashboardDetails = JSON.parse(JSON.stringify(dashboardDetails))
        let maxYPosition = formattedDashboardDetails.configData.layout.sort((a, b) => {
            return (b.y + b.h) - (a.y + a.h)
        })[0]
        if (formattedDashboardDetails.configData.layout.length) {
            formattedDashboardDetails.configData.layout.push({
                id: cardID,
                x: 0,
                y: maxYPosition.y + maxYPosition.h,
                h: 3,
                w: 3
            })
        } else {
            formattedDashboardDetails.configData.layout.push({
                id: cardID,
                x: 0,
                y: 0,
                h: 3,
                w: 3
            })
        }
        formattedDashboardDetails.configData.cards.push({
            title: "My New Chart " + (formattedDashboardDetails.configData.cards.length + 1),
            type: "chart",
            id: cardID,
            options: {
                metrics: [],
                chartType: null,
                config: {
                    projectID: dashboardDetails.project.id,
                    measure: [],
                    dimension: [],
                    series: []
                }
            }
        })
        setDashboardDetails(formattedDashboardDetails)
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
                    {route.mode == 'edit' ? <Button type="primary" shape="round" icon={<PlusOutlined />} onClick={() => { addCard(true) }} >Add Chart</Button> : null}
                    {route.mode == 'edit' ? <Button type="default" shape="round" icon={<SaveOutlined />} onClick={saveDashboardConfig} >Save </Button> : null}
                    {route.mode == 'edit' ? <Button type="default" shape="circle" icon={<CloseOutlined />} onClick={() => editStory(false)} ></Button> : null}
                </Space>
            </div>

            <ResponsiveGridLayout
                className="layout"
                rowHeight={50}
                onLayoutChange={(layout) => {
                    setTempLayout(layout)
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
                                        onDeleteCard(e.id)
                                    }}
                                    onEdit={() => {
                                        editChart(e.id)
                                    }}
                                />
                            </div>
                        )
                    })
                }
            </ResponsiveGridLayout>
            {dashboardDetails ?
                <AddChart
                    selectedCard={selectedCard}
                    setSelectedCard={setSelectedCard}
                    dashboardDetails={dashboardDetails}
                    setDashboardDetails={setDashboardDetails}
                // newChart={newChart}
                // openAddChart={openAddChart}
                // // addChart={addChart}
                // dashboardDetails={dashboardDetails}
                // setDashboardDetails={setDashboardDetails}
                // positions={positions}
                // setPositions={setPositions}
                // cards={cards}
                // setCards={setCards}
                // settings={chartSettings}
                // setSettings={setChartSettings}
                // isEditMode={chartEditMode}
                />
                : null}
        </div>
    )
}

export default Dashboard;
