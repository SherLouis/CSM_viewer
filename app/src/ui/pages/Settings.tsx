import { ActionIcon, Button, Container, Grid, Group, List, NumberInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { IconArrowLeft, IconPlus, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { Preferences, usePreferences } from "../context/PreferenceContext";
import { useState } from "react";

export default function SettingsPage() {
    const navigate = useNavigate();
    const { preferences, updatePreference } = usePreferences();

    const handleAddPreset = (presetPrefKey: keyof Preferences, newValue: number) => {
        console.debug(newValue);
        if (!preferences[presetPrefKey].includes(newValue)) {
            console.debug(preferences[presetPrefKey]);
            const newValues = [...preferences[presetPrefKey], newValue].sort((n1, n2) => n1 - n2)
            console.debug(newValues);
            updatePreference(presetPrefKey, newValues);
        }
    };

    const handleRemovePresetValue = (presetPrefKey: keyof Preferences, removedValue: number) => {
        updatePreference(presetPrefKey, preferences[presetPrefKey].filter((item) => item !== removedValue).sort((n1, n2) => n1 - n2));
    };

    return (
        <Container size={"100%"}>
            <Stack>
                {/** Back button */}
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
                <PresetsPreferenceRow
                    title="Amplitude presets"
                    values={preferences.amplitude_presets}
                    onAdd={(v) => handleAddPreset('amplitude_presets', v)}
                    onRemove={(v) => handleRemovePresetValue('amplitude_presets', v)} />
                <PresetsPreferenceRow
                    title="Duration presets"
                    values={preferences.duration_presets}
                    onAdd={(v) => handleAddPreset('duration_presets', v)}
                    onRemove={(v) => handleRemovePresetValue('duration_presets', v)} />
                <PresetsPreferenceRow
                    title="Frequency presets"
                    values={preferences.frequency_presets}
                    onAdd={(v) => handleAddPreset('frequency_presets', v)}
                    onRemove={(v) => handleRemovePresetValue('frequency_presets', v)} />
                <PresetsPreferenceRow
                    title="Phase length presets"
                    values={preferences.phase_length_presets}
                    onAdd={(v) => handleAddPreset('phase_length_presets', v)}
                    onRemove={(v) => handleRemovePresetValue('phase_length_presets', v)} />
            </Stack>
        </Container>
    )
}

interface PresetsPreferenceRowProps { title: string; values: number[]; onAdd: (newValue: number) => void; onRemove: (removedValue: number) => void };
const PresetsPreferenceRow = ({ title, values, onAdd, onRemove }: PresetsPreferenceRowProps) => {
    const [newPresetValue, setNewPresetValue] = useState<number>();
    return (
        <Grid>
            <Grid.Col span={2}>
                <Title order={3}>{title}</Title>
            </Grid.Col>
            <Grid.Col span={8}>
                <Group position="center">
                    {values.map((num, index) => (
                        <DeletableValueButton key={index} value={num} onDelete={() => onRemove(num)} />
                    ))}
                </Group>
            </Grid.Col>
            <Grid.Col span={2}>
                <Group position="left">
                    <NumberInput
                        value={newPresetValue}
                        onChange={v => { v !== "" ? setNewPresetValue(v) : {} }}
                        placeholder="Enter number"
                        type="number"
                        precision={2}
                        w={"8rem"}
                    />
                    <ActionIcon color="blue" onClick={() => onAdd(newPresetValue)}>
                        <IconPlus />
                    </ActionIcon>
                </Group>
            </Grid.Col>
        </Grid>
    )
}

interface DeletableValueButtonProps { value: number, onDelete: () => void };
const DeletableValueButton = ({ value, onDelete }: DeletableValueButtonProps) => {
    return (
        <Button.Group>
            <Button variant="default"
                styles={{ root: { ':active': { transform: 'none' } } }}
                style={{ cursor: 'default' }}>
                {value}
            </Button>
            <ActionIcon color="red" onClick={onDelete}>
                <IconTrash />
            </ActionIcon>
        </Button.Group>
    )
}