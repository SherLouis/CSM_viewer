import { useMantineColorScheme, ActionIcon, Header, Title, Flex, Group } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";

export default function AppHeader(props: HeaderProps) {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
  
    return (
      <Header height={60} p="xs">
        <Group position={"apart"}>
          <Title>{props.title}</Title>
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