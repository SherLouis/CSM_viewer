import { Box, TextInput, Group, Button, Accordion, NativeSelect, NumberInput, Autocomplete, MultiSelect, Switch, Space, Textarea, Checkbox, Tabs, rem } from "@mantine/core"
import { useForm } from '@mantine/form';
import { ResultDdo } from "../../models/ResultDdo";
import { IconTargetArrow, IconSettingsBolt, IconReportMedical, IconChartPie } from "@tabler/icons-react";
import { ROIDdo } from "../../models/ROIDdo";
import { EffectDdo } from "../../models/EffectDdo";

export const CreateEditResultForm = ({ onSubmit, edit_result, rois, effects }: CreateEditResultFormProps) => {
    // TODO: Ajouter validations
    const form = useForm<CreateEditResultFormValues>({
        initialValues: {
            roi: {
                lobe: edit_result && edit_result.roi.lobe != null ? edit_result.roi.lobe : "",
                gyrus: edit_result && edit_result.roi.gyrus != null ? edit_result.roi.gyrus : "",
                sub: edit_result && edit_result.roi.sub != null ? edit_result.roi.sub : "",
                precision: edit_result && edit_result.roi.precision != null ? edit_result.roi.precision : ""
            },
            stimulation_parameters: {
                amplitude_ma: edit_result && edit_result.stimulation_parameters.amplitude_ma != null ? edit_result.stimulation_parameters.amplitude_ma : 0,
                frequency_hz: edit_result && edit_result.stimulation_parameters.frequency_hz != null ? edit_result.stimulation_parameters.frequency_hz : 0,
                electrode_separation_mm: edit_result && edit_result.stimulation_parameters.electrode_separation_mm != null ? edit_result.stimulation_parameters.electrode_separation_mm : 0,
                duration_s: edit_result && edit_result.stimulation_parameters.duration_s != null ? edit_result.stimulation_parameters.duration_s : 0
            },
            effect: {
                category: edit_result && edit_result.effect.category != null ? edit_result.effect.category : "",
                semiology: edit_result && edit_result.effect.semiology != null ? edit_result.effect.semiology : "",
                characteristic: edit_result && edit_result.effect.characteristic != null ? edit_result.effect.characteristic : "",
                precision: edit_result && edit_result.effect.precision != null ? edit_result.effect.precision : "",
                post_discharge: edit_result && edit_result.effect.post_discharge != null ? edit_result.effect.post_discharge : false
            },
            occurrences: edit_result && edit_result.occurrences != null ? edit_result.occurrences : 0,
            comments: edit_result && edit_result.comments != null ? edit_result.comments : ""
        } as CreateEditResultFormValues,
    });

    const handleSubmit = (values: CreateEditResultFormValues) => {
        // TODO: form.validate();
        onSubmit(values);
    }

    const getRoiOptions = (level: 'lobe' | 'gyrus' | 'sub' | 'precision') => {
        switch (level) {
            case 'lobe':
                return rois.filter((roi) => roi.level == level).map((roi) => roi.lobe);
            case 'gyrus':
                return rois.filter((roi) => roi.level == level
                    && roi.lobe == form.getInputProps('roi.lobe').value).map((roi) => roi.gyrus);
            case 'sub':
                return rois.filter((roi) => roi.level == level
                    && roi.lobe == form.getInputProps('roi.lobe').value
                    && roi.gyrus == form.getInputProps('roi.gyrus').value).map((roi) => roi.sub);
            case 'precision':
                return rois.filter((roi) => roi.level == level
                    && roi.lobe == form.getInputProps('roi.lobe').value
                    && roi.gyrus == form.getInputProps('roi.gyrus').value
                    && roi.sub == form.getInputProps('roi.sub').value).map((roi) => roi.precision);
        }
    }

    const getEffectOptions = (level: 'category' | 'semiology' | 'characteristic' | 'precision') => {
        switch (level) {
            case 'category':
                return effects.filter((effect) => effect.level == level).map((effect) => effect.category);
            case 'semiology':
                return effects.filter((effect) => effect.level == level
                    && effect.category == form.getInputProps('effect.category').value).map((effect) => effect.semiology);
            case 'characteristic':
                return effects.filter((effect) => effect.level == level
                    && effect.category == form.getInputProps('effect.category').value
                    && effect.semiology == form.getInputProps('effect.semiology').value).map((effect) => effect.characteristic);
            case 'precision':
                return effects.filter((effect) => effect.level == level
                    && effect.category == form.getInputProps('effect.category').value
                    && effect.semiology == form.getInputProps('effect.semiology').value
                    && effect.characteristic == form.getInputProps('effect.characteristic').value).map((effect) => effect.precision);
        }
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
                        <NativeSelect
                            required
                            label="Lobe"
                            data={[{ value: '', label: 'Pick One' }, ...getRoiOptions('lobe')]}
                            onChange={(event) => {
                                form.setFieldValue('roi.gyrus', '');
                                form.setFieldValue('roi.sub', '');
                                form.setFieldValue('roi.precision', '');
                                form.getInputProps('roi.lobe').onChange(event)
                            }}
                            {...form.getInputProps('roi.lobe')}
                        />
                        {getRoiOptions('gyrus').length > 0 &&
                            <NativeSelect
                                label="Gyrus"
                                data={[{ value: '', label: 'Pick One' }, ...getRoiOptions('gyrus')]}
                                onChange={(event) => {
                                    form.setFieldValue('roi.sub', '');
                                    form.setFieldValue('roi.precision', '');
                                    form.getInputProps('roi.gyrus').onChange(event)
                                }}
                                {...form.getInputProps('roi.gyrus')}
                            />
                        }
                        {getRoiOptions('sub').length > 0 &&
                            <NativeSelect
                                label="Subregion"
                                data={[{ value: '', label: 'Pick One' }, ...getRoiOptions('sub')]}
                                onChange={(event) => {
                                    form.setFieldValue('roi.precision', '');
                                    form.getInputProps('roi.sub').onChange(event)
                                }}
                                {...form.getInputProps('roi.sub')}
                            />
                        }
                        {getRoiOptions('precision').length > 0 &&
                            <NativeSelect
                                label="Precision"
                                data={[{ value: '', label: 'Pick One' }, ...getRoiOptions('precision')]}
                                {...form.getInputProps('roi.precision')}
                            />
                        }
                    </Tabs.Panel>
                    <Tabs.Panel value="stimulation">
                        <NumberInput
                            label="Amplitude (mA)"
                            {...form.getInputProps('stimulation_parameters.amplitude_ma')}
                        />
                        <NumberInput
                            label="Frequency (Hz)"
                            {...form.getInputProps('stimulation_parameters.frequency_hz')}
                        />
                        <NumberInput
                            label="Electrode separation (mm)"
                            {...form.getInputProps('stimulation_parameters.electrode_separation_mm')}
                        />
                        <NumberInput
                            label="Duration (s)"
                            {...form.getInputProps('stimulation_parameters.duration_s')}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel value="effect">
                        <NativeSelect
                            label="Category"
                            data={[{ value: '', label: 'Pick One' }, ...getEffectOptions('category')]}
                            placeholder="Pick one"
                            {...form.getInputProps('effect.category')}
                            onChange={(event) => {
                                form.setFieldValue('effect.semiology', '');
                                form.setFieldValue('effect.characteristic', '');
                                form.setFieldValue('effect.precision', '');
                                form.getInputProps('effect.category').onChange(event);
                            }}
                        />
                        {getEffectOptions('semiology').length > 0 &&
                            <NativeSelect
                                label="Semiology"
                                data={[{ value: '', label: 'Pick One' }, ...getEffectOptions('semiology')]}
                                {...form.getInputProps('effect.semiology')}
                                onChange={(event) => {
                                    form.setFieldValue('effect.characteristic', '');
                                    form.setFieldValue('effect.precision', '');
                                    form.getInputProps('effect.semiology').onChange(event);
                                }}
                            />
                        }
                        {getEffectOptions('characteristic').length > 0 &&
                            <NativeSelect
                                label="characteristic"
                                data={[{ value: '', label: 'Pick One' }, ...getEffectOptions('characteristic')]}
                                {...form.getInputProps('effect.characteristic')}
                                onChange={(event) => {
                                    form.setFieldValue('effect.precision', '');
                                    form.getInputProps('effect.characteristic').onChange(event);
                                }}
                            />
                        }
                        {getEffectOptions('precision').length > 0 &&
                            <NativeSelect
                                label="precision"
                                data={[{ value: '', label: 'Pick One' }, ...getEffectOptions('precision')]}
                                {...form.getInputProps('effect.precision')}
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
    rois: ROIDdo[];
    effects: EffectDdo[];
    //TODO: on_add_roi
    //TODO: on_add_effect
}
