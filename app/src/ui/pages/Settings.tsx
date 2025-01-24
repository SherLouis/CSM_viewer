import { ActionIcon, Button, Container, Group, List, NumberInput, Stack, Text, TextInput } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { usePreferences } from "../context/PreferenceContext";
import { useState } from "react";

export default function SettingsPage() {
    const navigate = useNavigate();
    const { preferences, updatePreference } = usePreferences();

    const [newAmpPreset, setNewAmpPreset] = useState<number>();

    console.debug(preferences);

    const handleAddAmplitudePreset = () => {
        updatePreference('amplitude_presets', [...preferences.amplitude_presets, newAmpPreset])
    };

    const handleRemoveAmplitudePreset = (num: number) => {
        updatePreference('amplitude_presets', preferences.amplitude_presets.filter((item) => item !== num));
    };

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
                {/** TODO: Save and get in context (localStorage) */}

                <Group position="apart" style={{ marginBottom: '1rem' }}>
                    <NumberInput
                        label="Add a number"
                        value={newAmpPreset}
                        onChange={v => { v !== "" ? setNewAmpPreset(v) : {} }}
                        placeholder="Enter number"
                        type="number"
                        precision={1}
                    />
                    <Button onClick={handleAddAmplitudePreset} disabled={!newAmpPreset}>Add</Button>
                </Group>

                <List>
                    {preferences.amplitude_presets.map((num, index) => (
                        <List.Item key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{num}</span>
                            <Button color="red" size="xs" onClick={() => handleRemoveAmplitudePreset(num)}>Remove</Button>
                        </List.Item>
                    ))}
                </List>

            </Stack>
        </Container>
    )
}