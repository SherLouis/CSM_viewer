import { useMantineColorScheme, ActionIcon, Header, Title, Group, Alert } from "@mantine/core";
import { IconSun, IconMoonStars, IconAlertCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function AppHeader(props: HeaderProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const [dbLocation, setDbLocation] = useState("In memory");

  useEffect(() => {
    // Listen for the event
    window.electronAPI.dbLocationChanged((event, value) => {
      setDbLocation(value)
    })
  }, []);

  // TODO: Add menu https://mantine.dev/core/menu/
  return (
    <Header height={"5rem"} p="xs">
      <Group position={"apart"}>
        <Title>{props.title}</Title>

        {dbLocation === "In memory" &&
          <Alert icon={<IconAlertCircle size="1rem" />} title="Warning!" color="red">
            {"Database is not saved to file. All data will be lost on app closing. "}
            <strong>{"Open an existing database (File->Open) or Create a new database (File->New) before inserting data."}</strong>
          </Alert>}
        {dbLocation.split('\\').pop().split('/').pop()}

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