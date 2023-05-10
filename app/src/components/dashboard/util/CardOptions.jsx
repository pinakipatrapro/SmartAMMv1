
import React, { useState, useEffect } from "react";
import {
    List, Button, Divider, Input, Statistic, Typography,
    Radio, Select, Space, Drawer, Form, Switch, Collapse
} from 'antd';

import csvDownload from 'json-to-csv-export'

import {
    CheckOutlined, CloseOutlined, PropertySafetyFilled, FontSizeOutlined,
    AreaChartOutlined, FieldTimeOutlined, ReloadOutlined
} from '@ant-design/icons';

const { Panel } = Collapse;




const CardOptions = (props) => {


    return (
        <>
            <Button style={{ width: "100%" }} type="text">Download as Image</Button>
            <Button
                style={{ width: "100%" }} type="text"
                onClick={() => {
                    csvDownload({
                        data: props.data,
                        filename: props.config.title,
                        delimiter: ','
                    })
                }}>Download Chart Data</Button>

        </>
    )
}


export default CardOptions