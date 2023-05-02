import { Card, Divider, Space, Switch, Tooltip, Typography, Form, Radio, Tag } from 'antd';
import {
    CheckOutlined, CloseOutlined, PropertySafetyFilled, FontSizeOutlined,
    AreaChartOutlined, FieldTimeOutlined
} from '@ant-design/icons';




const ColumnCards = (props) => {
    return (
        <Card
            size="small"
            title={props.info.colName}
            extra={
                <Tooltip title="Include or exclude columns from analysis project">
                    <Switch
                        defaultChecked={props.info.enabled}
                        onClick={(checked,evt) => {
                            props.changeColumnEnabled(checked, props.index)
                        }}
                    />
                </Tooltip>
            }
            style={{
                width: 'auto',
                border: "1px #00000022 solid"
            }}
        >
            <Form.Item label="Data Type" name="layout">
                <Tooltip title={`System determined type : ${props.info.dataType}`}>
                    <Radio.Group value={props.info.dataType} buttonStyle="solid">
                        <Radio.Button value="Text"><FontSizeOutlined />  Text</Radio.Button>
                        <Radio.Button value="Number"><AreaChartOutlined /> Number</Radio.Button>
                        <Radio.Button value="Date-Time"> <FieldTimeOutlined /> Date-Time</Radio.Button>
                    </Radio.Group>
                </Tooltip>
            </Form.Item>
            <Divider   style={{ fontSize: ".75rem" }}>Sample Values</Divider>
            <Typography.Paragraph ellipsis={{
                rows: 2,
                expandable: true,
                symbol: 'more'
            }}>{props.info.previewValues.map(e => {
                return (
                    <Tooltip title={e}>
                        <Tag style={{ maxWidth: "50%", textOverflow: "ellipsis", overflow: "hidden" }}>
                            {e}
                        </Tag>
                    </Tooltip>)
            })}</Typography.Paragraph>
        </Card >
    )
}

export default ColumnCards;
