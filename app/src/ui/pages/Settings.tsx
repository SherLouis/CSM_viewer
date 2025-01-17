import { ActionIcon, Container, Group, Stack, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
    const navigate = useNavigate();
    return (
        <Container size={"100%"}>
            <Stack>
                <Group>
                    <ActionIcon
                        variant="filled"
                        onClick={() => navigate(-1)}
                        title="Back"
                    >
                        <IconArrowLeft />
                    </ActionIcon>
                    <Text>{"Back"}</Text>
                </Group>

                {/** TODO: Define preferences here (Amplitude, Frequence, Duration, Phase length preset buttons) */}
                {/** TODO: Save and get in context (localStorage) */}

            </Stack>
        </Container>
    )
}