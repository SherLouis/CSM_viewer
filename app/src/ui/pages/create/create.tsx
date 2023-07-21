import { Button } from '@mantine/core';

const buttonClicked = async () => {
    const response = await window.api.ping()
    console.log(response) // prints out 'pong'
}

export default function CreatePage() {
    return <Button onClick={buttonClicked}>Click me!</Button>;
}