import { useMantineColorScheme, ActionIcon, Header, Title, Group, Alert } from "@mantine/core";
import { IconSun, IconMoonStars, IconAlertCircle, IconSettings } from "@tabler/icons-react";
import { useAppState } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function AppHeader(props: HeaderProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const navigate = useNavigate();
  const appState = useAppState();

  const navToSettingsPage = () => {
    navigate('/settings');
  }

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
          <ActionIcon
            variant='filled'
            color='teal'
            onClick={navToSettingsPage}
            title="Settings & Preferences"
          >
            <IconSettings size={"1rem"} />
          </ActionIcon>
        </Group>
      </Group>
    </Header>
  );
}

type HeaderProps = {
  title: string
}