import { Button } from '@mantine/core';
import { IpcService } from '../../../app/IpcService';
import { systemInfoDto } from '../../../IPC/dtos/systemInfoDto';

const ipc = new IpcService();

const buttonClicked = async () => {
    const response = await ipc.send<systemInfoDto>('system-info');
    console.log(response)
}

export default function CreatePage() {
    return <Button onClick={buttonClicked}>Click me!</Button>;
}