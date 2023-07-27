import { AppShell, Button, Header, Navbar } from '@mantine/core';
import AppHeader from '../../components/AppHeader/AppHeader'


const buttonClicked = async () => {
    const response = await window.electronAPI.getSystemInfo("test")
    console.log(response)
}

export default function CreatePage() {
    return (
        <AppShell
          padding="md"
          //navbar={<Navbar width={{ base: "20%" }} height={500} p="xs">{/* Navbar content */}</Navbar>}
          header={<AppHeader/>}
          styles={(theme) => ({
            main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
          })}
        >
            <Button onClick={buttonClicked}>Click me!</Button>
          {/* Your application here */}
        </AppShell>
      );
}



