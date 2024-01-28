import { ActionIcon, Button, Flex, Group, Stack, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { IconSquareRoundedPlusFilled } from "@tabler/icons-react";

const ColumnButtonSelect = ({ data, onChange, onSelect }: ColumnButtonSelectProps) => {

    const [currentValue, setValue] = useState<string>();

    const handleClick = (newValue: string) => {
        setValue(newValue);
        onChange(newValue);
    }

    return (
        <Stack spacing={"xs"} justify="flex-start">
            {data.map((value, index) =>
                <Group key={index} spacing={"xs"}>
                    <Button w={"85%"} m={0} p={0}
                        variant={currentValue === value ? "filled" : "default"}
                        onClick={() => handleClick(value)}>{value}</Button>
                    <ActionIcon m={0} p={0}
                        onClick={() => onSelect(value)}>
                        <IconSquareRoundedPlusFilled/>
                    </ActionIcon>
                </Group>
            )}
        </Stack>
    )
}

interface ColumnButtonSelectProps {
    data: string[];
    onChange: (newValue: string) => void;
    onSelect: (newValue: string) => void;
};

export default ColumnButtonSelect;