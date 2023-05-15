
import React, { useState, useEffect } from "react";
import {
    List, Button, Divider, Input, Statistic, Typography,
    Radio, Select, Space, Drawer, Form, Switch, Collapse
} from 'antd';

import {
    CheckOutlined, CloseOutlined, PropertySafetyFilled, FontSizeOutlined,
    AreaChartOutlined, FieldTimeOutlined, ReloadOutlined
} from '@ant-design/icons';

const { Panel } = Collapse;




const EditChartLegend = (props) => {


    return (
        <Collapse size="small" style={{ marginBottom: "15px" }}>
            <Panel header="Legend Options">
                
            </Panel>
        </Collapse>
    )
}


export default EditChartLegend