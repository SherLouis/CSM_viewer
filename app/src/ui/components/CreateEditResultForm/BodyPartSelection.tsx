import { UseFormReturnType } from "@mantine/form";
import { CreateEditResultFormValues } from "./CreateEditResultForm";
import { Button, SimpleGrid, Stack } from "@mantine/core";
import { useState } from "react";

const BodyPartSelection = ({ bodyPartsOptions, form }: BodyPartSelectionProps) => {
    const getValuesFromForm = (): string[] => {
        return form.values.effect.body_part.split(';');
    }

    const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>(getValuesFromForm());

    const handleOptionClick = (value: string) => {
        let newBodyParts: string[];
        if (selectedBodyParts.includes(value)) {
            newBodyParts = selectedBodyParts.filter(v => v !== value);
        }
        else {
            newBodyParts = [...selectedBodyParts, value];
        }
        setSelectedBodyParts(newBodyParts);
        form.setFieldValue("effect.body_part", newBodyParts.join(";"));
    }

    return (
        <Stack>
            <label>{"Body part(s)"}</label>
            <SimpleGrid cols={6}>
                {bodyPartsOptions.map(bodyPart =>
                    <Button
                        key={"btn_body_part_" + bodyPart}
                        variant={selectedBodyParts.includes(bodyPart) ? "filled" : "default"}
                        onClick={() => handleOptionClick(bodyPart)}
                    >
                        {bodyPart}
                    </Button>
                )
                }
            </SimpleGrid>
        </Stack>
    );
};

interface BodyPartSelectionProps {
    bodyPartsOptions: string[];
    form: UseFormReturnType<CreateEditResultFormValues>;
};

export default BodyPartSelection;