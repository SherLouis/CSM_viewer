import { useMantineColorScheme, ActionIcon, Header, Title, Group, Alert } from "@mantine/core";
import { IconSun, IconMoonStars, IconAlertCircle } from "@tabler/icons-react";
import { useAppState } from "../../context/AppContext";

export default function AppHeader(props: HeaderProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const appState = useAppState();

  // TODO: Add menu https://mantine.dev/core/menu/
  return (
    <Header height={"5rem"} p="xs">
      <Group position={"apart"}>
        <Title>{props.title}</Title>

        {appState.isInMemoryDb &&
          <Alert icon={<IconAlertCircle size="1rem" />} title="Warning!" color="red">
            {"Database is not saved to file. All data will be lost on app closing. "}
            <strong>{"Open an existing database (File->Open) or Create a new database (File->New) before inserting data."}</strong>
          </Alert>}
        {appState.dbLocation.split('\\').pop().split('/').pop()}

        <Group position="right">
          <ActionIcon
            variant="outline"
            color={dark ? 'yellow' : 'blue'}
            onClick={() => toggleColorScheme()}
            title="Toggle color scheme"
          >
            {dark ? <IconSun size="1rem" /> : <IconMoonStars size="1rem" />}
          </ActionIcon>
        </Group>
      </Group>
    </Header>
  );
}

type HeaderProps = {
  title: string
}