import React, { useState } from 'react';
import { Button, Popover } from 'antd';

const UserMenu = () => {
    const [open, setOpen] = useState(false);
    const hide = () => {
        setOpen(false);
    };
    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };
    return (
        <Popover
            content={<a onClick={hide}>Close</a>}
            title="Title"
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
        >
            <Button type="primary">Click me</Button>
        </Popover>
    );
}







export default UserMenu;
