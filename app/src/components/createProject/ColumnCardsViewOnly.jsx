import { Card, Divider, Space, Switch, Tooltip, Typography, Form, Radio, Tag } from 'antd';
import {
    CheckOutlined, CloseOutlined, PropertySafetyFilled, FontSizeOutlined,
    AreaChartOutlined, FieldTimeOutlined
} from '@ant-design/icons';




const ColumnCardsViewOnly = (props) => {
    return (
        <Card
            size="small"
            title={props.info.colName}
            extra={
                <Tooltip title="Include or exclude columns from analysis project">
                    <Switch
                        disabled
                        defaultChecked={props.info.enabled}
                        onClick={(checked, evt) => {
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

            <Typography.Paragraph>Data Type: {props.info.dataType}</Typography.Paragraph>
            <Divider style={{ fontSize: ".75rem" }}>Sample Values</Divider>
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

export default ColumnCardsViewOnly;
