import { AppShell, Button, Header, Navbar } from '@mantine/core';
import AppHeader from '../../components/AppHeader/AppHeader'
import { PropsWithChildren } from 'react'

export default function BasePage(props: PropsWithChildren<BasePageProps>) {
    return (
        <AppShell
          padding="md"
          header={<AppHeader title={props.title}/>}
          styles={(theme) => ({
            main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
          })}
        >
            {props.children}
        </AppShell>
      );
}

type BasePageProps = {
    title: string
}
