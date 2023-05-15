
import React, { useState, useEffect } from "react";
import {
    List, Button, Divider, Input, Statistic, Typography,
    Radio, Select, Space, Drawer, Form, Switch, Collapse
} from 'antd';

import csvDownload from 'json-to-csv-export'
import { toPng } from 'html-to-image';

import {
    CheckOutlined, CloseOutlined, PropertySafetyFilled, FontSizeOutlined,
    AreaChartOutlined, FieldTimeOutlined, ReloadOutlined
} from '@ant-design/icons';

const { Panel } = Collapse;




const CardOptions = (props) => {


    return (
        <>
            <Button style={{ width: "100%" }} type="text" onClick={() => {
                if (props.reference.current === null) {
                    return
                }
                toPng(props.reference.current, { cacheBust: true, quality:1})
                    .then((dataUrl) => {
                        const link = document.createElement('a')
                        link.download = `${props.config.title}.png`
                        link.href = dataUrl
                        link.click()
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }} >Download as Image</Button>
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