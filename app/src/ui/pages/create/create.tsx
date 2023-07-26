import { Button } from '@mantine/core';

const buttonClicked = async () => {
    const response = await window.electronAPI.getSystemInfo("test")
    console.log(response)
}

export default function CreatePage() {
    return <Button onClick={buttonClicked}>Click me!</Button>;
}