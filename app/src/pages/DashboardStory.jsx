

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
            id: "1",
            x: 0,
            y: 0,
            h: 2,
            w: 3
        },
        {
            id: "2",
            x: 0,
            y: 2,
            h: 2,
            w: 3
        },
        {
            id: "3",
            x: 3,
            y: 0,
            h: 4,
            w: 9
        },
        {
            id: "4",
            x: 0,
            y: 4,
            h: 6,
            w: 12
        }
    ]);

    const addChart = () => {
        let availablePositions = [...positions];
        let availableCards = [...cards];
        let cardID = new Date() + ""
        let lowestCard = availablePositions.sort((a, b) => {
            return b.y - a.y
        })[0]
        availablePositions.push(
            {
                id: cardID,
                x: 0,
                y: lowestCard.y + lowestCard.h,
                h: 2,
                w: 2
            }
        )
        availableCards.push(
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
                id: cardID
            }
        )


        setPositions(availablePositions)
        setCards(availableCards)
    }

    const editStory = (bool) => {
        window.location.href = `/dashboardStory/${route.id}/${bool ? 'edit' : 'view'}`;
    }

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
                    },{
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
                        "Category": "Thoughtmix",
                        "Sub-Category": "Accounting",
                        "Tickets": 750
                      }, {
                        "Category": "Kaymbo",
                        "Sub-Category": "Services",
                        "Tickets": 900
                      }, {
                        "Category": "Mymm",
                        "Sub-Category": "Support",
                        "Tickets": 846
                      }, {
                        "Category": "Myworks",
                        "Sub-Category": "Human Resources",
                        "Tickets": 837
                      }, {
                        "Category": "Dablist",
                        "Sub-Category": "Legal",
                        "Tickets": 294
                      }, {
                        "Category": "Yamia",
                        "Sub-Category": "Support",
                        "Tickets": 359
                      }, {
                        "Category": "Trunyx",
                        "Sub-Category": "Services",
                        "Tickets": 570
                      }, {
                        "Category": "Photospace",
                        "Sub-Category": "Product Management",
                        "Tickets": 488
                      }, {
                        "Category": "Jabbersphere",
                        "Sub-Category": "Sales",
                        "Tickets": 321
                      }, {
                        "Category": "Skivee",
                        "Sub-Category": "Training",
                        "Tickets": 462
                      }, {
                        "Category": "Wordify",
                        "Sub-Category": "Business Development",
                        "Tickets": 469
                      }, {
                        "Category": "Trilith",
                        "Sub-Category": "Business Development",
                        "Tickets": 485
                      }, {
                        "Category": "Gigashots",
                        "Sub-Category": "Human Resources",
                        "Tickets": 212
                      }, {
                        "Category": "Blogspan",
                        "Sub-Category": "Marketing",
                        "Tickets": 883
                      }, {
                        "Category": "Zoovu",
                        "Sub-Category": "Human Resources",
                        "Tickets": 989
                      }, {
                        "Category": "Oyondu",
                        "Sub-Category": "Human Resources",
                        "Tickets": 256
                      }, {
                        "Category": "Abata",
                        "Sub-Category": "Business Development",
                        "Tickets": 442
                      }, {
                        "Category": "Devify",
                        "Sub-Category": "Accounting",
                        "Tickets": 999
                      }, {
                        "Category": "Mita",
                        "Sub-Category": "Sales",
                        "Tickets": 759
                      }, {
                        "Category": "Janyx",
                        "Sub-Category": "Sales",
                        "Tickets": 539
                      }, {
                        "Category": "Twitterwire",
                        "Sub-Category": "Business Development",
                        "Tickets": 144
                      }, {
                        "Category": "Yambee",
                        "Sub-Category": "Product Management",
                        "Tickets": 642
                      }, {
                        "Category": "Yakitri",
                        "Sub-Category": "Product Management",
                        "Tickets": 733
                      }, {
                        "Category": "Dabjam",
                        "Sub-Category": "Human Resources",
                        "Tickets": 268
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
                    seriesField:"Sub-Category"
                }
            },
            title: "Tickets Count by Categories",
            id: "4"
        }
    ])

    const openAddChart = (bool) => {
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
                isDraggable={route.mode == 'edit'}
                isResizable={route.mode == 'edit'}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            >
                {
                    positions.map(e => {
                        return (
                            <div key={e.id} data-grid={{ x: e.x, y: e.y, w: e.w, h: e.h }}  >

                                <KPICard settings={cards.find(f => { return f.id == e.id })} mode={route.mode} isInGrid={true} />
                            </div>
                        )
                    })
                }
            </ResponsiveGridLayout>
            {dashboardDetails ?
                <AddChart newChart={newChart} openAddChart={openAddChart} addChart={addChart} dashboardDetails={dashboardDetails} setDashboardDetails={setDashboardDetails} />
                : null}
        </div>
    )
}

export default Dashboard;
