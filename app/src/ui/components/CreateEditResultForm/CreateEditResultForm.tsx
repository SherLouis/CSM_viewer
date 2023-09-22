import { Box, TextInput, Group, Button, Accordion, NativeSelect, NumberInput, Autocomplete, MultiSelect, Switch, Space, Textarea, Checkbox, Tabs, rem } from "@mantine/core"
import { useForm } from '@mantine/form';
import { ResultDdo, effectCategorisationMap } from "../../models/ResultDdo";
import { IconTargetArrow, IconSettingsBolt, IconReportMedical, IconChartPie } from "@tabler/icons-react";

export const CreateEditResultForm = ({ onSubmit, edit_result }: CreateEditResultFormProps) => {
    // TODO: Ajouter validations
    const form = useForm<CreateEditResultFormValues>({
        initialValues: {
            roi: {
                lobe: edit_result&&edit_result.roi.lobe != null ? edit_result.roi.lobe : "",
                gyrus: edit_result&&edit_result.roi.gyrus != null ? edit_result.roi.gyrus : "",
                sub: edit_result&&edit_result.roi.sub != null ? edit_result.roi.sub : "",
                precision: edit_result&&edit_result.roi.precision != null ? edit_result.roi.precision : ""
            },
            stimulation_parameters: {
                amplitude_ma: edit_result&&edit_result.stimulation_parameters.amplitude_ma != null ? edit_result.stimulation_parameters.amplitude_ma : 0,
                frequency_hz: edit_result&&edit_result.stimulation_parameters.frequency_hz != null ? edit_result.stimulation_parameters.frequency_hz : 0,
                electrode_separation_mm: edit_result&&edit_result.stimulation_parameters.electrode_separation_mm != null ? edit_result.stimulation_parameters.electrode_separation_mm : 0,
                duration_s: edit_result&&edit_result.stimulation_parameters.duration_s != null ? edit_result.stimulation_parameters.duration_s : 0
            },
            effect: {
                category: edit_result&&edit_result.effect.category != null ? edit_result.effect.category : "",
                semiology: edit_result&&edit_result.effect.semiology != null ? edit_result.effect.semiology : "",
                characteristic: edit_result&&edit_result.effect.characteristic != null ? edit_result.effect.characteristic : "",
                precision: edit_result&&edit_result.effect.precision != null ? edit_result.effect.precision : "",
                post_discharge: edit_result&&edit_result.effect.post_discharge != null ? edit_result.effect.post_discharge : false
            },
            occurrences: edit_result&&edit_result.occurrences != null ? edit_result.occurrences : 0,
            comments: edit_result&&edit_result.comments != null ? edit_result.comments : ""
        } as CreateEditResultFormValues,
    });

    const handleSubmit = (values: CreateEditResultFormValues) => {
        //form.validate();
        onSubmit(values);
    }

    // TODO: get the list of ROIs and Effects from the db...
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

    const iconStyle = { width: rem(12), height: rem(12) };
    return (
        <Box>
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <Tabs defaultValue="roi">
                    <Tabs.List>
                        <Tabs.Tab value="roi" icon={<IconTargetArrow style={iconStyle} />}>
                            ROI
                        </Tabs.Tab>
                        <Tabs.Tab value="stimulation" icon={<IconSettingsBolt style={iconStyle} />}>
                            Stimulation
                        </Tabs.Tab>
                        <Tabs.Tab value="effect" icon={<IconReportMedical style={iconStyle} />}>
                            Effect
                        </Tabs.Tab>
                        <Tabs.Tab value="details" icon={<IconChartPie style={iconStyle} />}>
                            Details
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="roi">
                        <Autocomplete
                            required
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
                            {...form.getInputProps('roi.lobe')}
                        />
                        <Autocomplete
                            label="Gyrus"
                            data={GYRUS_LIST}
                            {...form.getInputProps('roi.gyrus')}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel value="stimulation">
                        stimulation tab content
                    </Tabs.Panel>
                    <Tabs.Panel value="effect">
                        <NativeSelect
                            label="Category"
                            data={[{ value: '', label: 'Pick One' }, ...Object.keys(effectCategorisationMap)]}
                            placeholder="Pick one"
                            {...form.getInputProps('effect.category')}
                        />
                        <NativeSelect
                            label="Semiology"
                            data={[{ value: '', label: 'Pick One' }, ...getSemiologyOptions()]}
                            {...form.getInputProps('effect.semiology')}
                        />
                        {shouldShowCharacteristic() &&
                            <NativeSelect
                                label="characteristic"
                                data={[{ value: '', label: 'Pick One' }, ...getCharacteristicOptions()]}
                                {...form.getInputProps('effect.characteristic')}
                            />
                        }
                        <Switch
                            label="Post discharge ?"
                            labelPosition="left"
                            {...form.getInputProps('effect.post_discharge', { type: 'checkbox' })}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel value="details">
                        <NumberInput
                            label="Occurrences"
                            {...form.getInputProps('occurrences')}
                        />
                        <Textarea
                            label="Comments"
                            placeholder="Write your comments here"
                            {...form.getInputProps('comments')}
                        />
                    </Tabs.Panel>
                </Tabs>

                <Group position="right" mt="md">
                    <Button type="submit">Save</Button>
                </Group>
            </form>
        </Box>
    )
}

export interface CreateEditResultFormValues {
    roi: {
        lobe: string,
        gyrus: string,
        sub: string,
        precision: string
    }
    stimulation_parameters: {
        amplitude_ma: number,
        frequency_hz: number,
        electrode_separation_mm: number,
        duration_s: number
    }
    effect: {
        category: string,
        semiology: string,
        characteristic: string,
        precision: string,
        post_discharge: boolean
    }
    occurrences: number,
    comments?: string
}

interface CreateEditResultFormProps {
    onSubmit: (values: CreateEditResultFormValues) => void;
    edit_result?: ResultDdo;
    //TODO: roi_arborescence
    //TODO: effects_arborescence
    //TODO: on_add_roi
    //TODO: on_add_effect
}
