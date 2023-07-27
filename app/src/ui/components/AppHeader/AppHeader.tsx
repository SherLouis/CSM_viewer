import { useMantineColorScheme, ActionIcon, Header } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";

export default function AppHeader() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
  
    return (
      <Header height={60} p="xs" style={{display: "flex", justifyContent:"flex-end"}}>
        <ActionIcon
          variant="outline"
          color={dark ? 'yellow' : 'blue'}
          onClick={() => toggleColorScheme()}
          title="Toggle color scheme"
        >
          {dark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
        </ActionIcon>
      </Header>
    );
  }