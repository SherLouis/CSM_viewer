import { Box, TextInput, Group, Button, Accordion, NativeSelect, NumberInput, Autocomplete, MultiSelect, Switch, Space, Textarea, Checkbox } from "@mantine/core"
import { useForm } from '@mantine/form';
import { ResultDdo, effectCategorisationMap } from "../../models/ResultDdo";

export const CreateEditResultForm = ({ onSubmit, mode, edit_result }: CreateEditResultFormProps) => {
    // TODO: Ajouter validations
    // TODO: post_discharge switch value
    const form = useForm<CreateEditResultFormValues>({
        initialValues: {
            location: {
                side: edit_result != null ? edit_result.location.side : "",
                lobe: edit_result != null ? edit_result.location.lobe : "",
                gyrus: edit_result != null ? edit_result.location.gyrus : "",
                broadmann: edit_result != null ? edit_result.location.broadmann : [],
            },
            effect: {
                category: edit_result != null ? edit_result.effect.category : "",
                semiology: edit_result != null ? edit_result.effect.semiology : "",
                characteristic: edit_result != null ? edit_result.effect.characteristic : "",
                post_discharge: edit_result != null ? edit_result.effect.post_discharge : false,
            },
            comments: edit_result != null ? edit_result.comments : ""
        } as CreateEditResultFormValues,
    });

    const handleSubmit = (values: CreateEditResultFormValues) => {
        form.validate();
        console.debug(values);
        onSubmit(values);
    }

    const GYRUS_LIST = [
        "Superior frontal gyrus",
        "Middle frontal gyrus",
        "Inferior frontal gyrus",
        "Superior temporal gyrus",
        "Middle temporal gyrus",
        "Inferior temporal gyrus",
        "Fusiform gyrus",
        "Parahippocampal gyrus",
    ]

    const BROADMANN_LIST = Array.from({ length: 47 }, (v, k) => String(k + 1));

    const getSemiologyOptions = () => {
        let category = form.getInputProps('effect.category').value;
        if (Object.keys(effectCategorisationMap).includes(category)) {
            return Object.keys(effectCategorisationMap[category]);
        }
        return [];
    }

    const getCharacteristicOptions = () => {
        let category = form.getInputProps('effect.category').value;
        let semiology = form.getInputProps('effect.semiology').value;
        if (Object.keys(effectCategorisationMap).includes(category) &&
            Object.keys(effectCategorisationMap[category]).includes(semiology)) {
            return effectCategorisationMap[category][semiology];
        }
        return [];
    }

    const shouldShowCharacteristic = (): boolean => {
        let category = form.getInputProps('effect.category').value;
        let semiology = form.getInputProps('effect.semiology').value;
        return (
            Object.keys(effectCategorisationMap).includes(category) &&
            Object.keys(effectCategorisationMap[category]).includes(semiology) &&
            effectCategorisationMap[category][semiology].length > 0)
    }

    return (
        <Box>
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <Accordion defaultValue="location">
                    <Accordion.Item value="location">
                        <Accordion.Control>Location</Accordion.Control>
                        <Accordion.Panel>
                            <NativeSelect
                                required
                                disabled={mode === "view"}
                                label="Side"
                                data={[{ value: '', label: 'Pick One', disabled: true }, { value: 'left', label: 'Left' }, { value: 'right', label: 'Rigth' }]}
                                placeholder="Pick one"
                                {...form.getInputProps('location.side')}
                            />
                            <Autocomplete
                                required
                                disabled={mode === "view"}
                                label="Lobe"
                                data={[
                                    { value: 'frontal', label: 'Frontal' },
                                    { value: 'parietal', label: 'Parietal' },
                                    { value: 'occipital', label: 'Occipital' },
                                    { value: 'temporal', label: 'Temporal' },
                                    { value: 'limbic', label: 'Limbic' },
                                    { value: 'insular', label: 'Insular' },
                                ]}
                                placeholder="Pick one"
                                {...form.getInputProps('location.lobe')}
                            />
                            <Autocomplete
                                required
                                disabled={mode === "view"}
                                label="Gyrus"
                                data={GYRUS_LIST}
                                {...form.getInputProps('location.gyrus')}
                            />
                            <MultiSelect
                                required={false}
                                disabled={mode === "view"}
                                label="Broadmann"
                                data={BROADMANN_LIST}
                                {...form.getInputProps('location.broadmann')}
                            />
                        </Accordion.Panel>
                    </Accordion.Item>

                    <Accordion.Item value="effect">
                        <Accordion.Control>Effect</Accordion.Control>
                        <Accordion.Panel>
                            <NativeSelect
                                required
                                disabled={mode === "view"}
                                label="Category"
                                data={[{ value: '', label: 'Pick One' }, ...Object.keys(effectCategorisationMap)]}
                                placeholder="Pick one"
                                {...form.getInputProps('effect.category')}
                            />
                            <NativeSelect
                                required
                                disabled={mode === "view"}
                                label="Semiology"
                                data={[{ value: '', label: 'Pick One' }, ...getSemiologyOptions()]}
                                {...form.getInputProps('effect.semiology')}
                            />
                            {shouldShowCharacteristic() &&
                                <NativeSelect
                                    required={shouldShowCharacteristic()}
                                    disabled={mode === "view"}
                                    label="characteristic"
                                    data={[{ value: '', label: 'Pick One' }, ...getCharacteristicOptions()]}
                                    {...form.getInputProps('effect.characteristic')}
                                />
                            }
                            <Space />
                            <Switch
                                required
                                disabled={mode === "view"}
                                label="Post discharge ?"
                                labelPosition="left"
                                {...form.getInputProps('effect.post_discharge', {type: 'checkbox'})}
                            />
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value="comments">
                        <Accordion.Control>Comments</Accordion.Control>
                        <Accordion.Panel>
                            <Textarea
                                label="Comments"
                                disabled={mode === "view"}
                                placeholder="Write your comments here"
                                {...form.getInputProps('comments')}
                            />
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>

                <Group position="right" mt="md">
                    <Button type="submit">{mode === "create" ? "Create" : mode === "edit" ? "Save" : "OK"}</Button>
                </Group>
            </form>
        </Box>
    )
}

export interface CreateEditResultFormValues {
    location: {
        side: "left" | "right" | "",
        lobe: string,
        gyrus: string,
        broadmann: string[]
    },
    effect: {
        category: string,
        semiology: string,
        characteristic: string,
        post_discharge: boolean
    }
    comments?: string
}

interface CreateEditResultFormProps {
    onSubmit: (values: CreateEditResultFormValues) => void;
    mode: "edit" | "create" | "view";
    edit_result?: ResultDdo;
}
