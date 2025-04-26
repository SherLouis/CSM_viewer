import { useState, useEffect } from 'react';
import { Box, Group, Button, NativeSelect, NumberInput, Switch, Textarea, Tabs, rem, Radio, Stack, Divider, SelectItem, TextInput, Accordion, TabsValue, MultiSelect, ActionIcon } from "@mantine/core"
import { useForm } from '@mantine/form';
import { ResultDdo } from "../../models/ResultDdo";
import { IconTargetArrow, IconSettingsBolt, IconReportMedical, IconChartPie, IconSubtask, IconMathFunction, IconX } from "@tabler/icons-react";
import { ROIDdo } from "../../models/ROIDdo";
import { EffectDdo } from "../../models/EffectDdo";
import { TaskDdo } from "../../models/TaskDdo";
import { FunctionDdo } from "../../models/FunctionDdo";
import ROIOptionsTableForm from "./ROIOptionsTableForm";
import EffectOptionsTableForm from "./EffectOptionsTableForm";
import TaskOptionsTableForm from "./TaskOptionsTableForm";
import FunctionOptionsTableForm from "./FunctionOptionsTableForm";
import { usePreferences } from "../../context/PreferenceContext";
import BodyPartSelection from './BodyPartSelection';


export const CreateEditResultForm = ({ onSubmit, onCancel, edit_result, rois, effects, tasks, functions, body_parts, selected_tab, onFormValueChanged }: CreateEditResultFormProps) => {
    const { preferences } = usePreferences();

    const form = useForm<CreateEditResultFormValues>({
        initialValues: {
            roi: {
                side: edit_result && edit_result.roi.side != null ? edit_result.roi.side : "",
                lobe: edit_result && edit_result.roi.lobe != null ? edit_result.roi.lobe : "",
                region: edit_result && edit_result.roi.region != null ? edit_result.roi.region : "",
                area: edit_result && edit_result.roi.area != null ? edit_result.roi.area : "",
                from_figure: edit_result && edit_result.roi.from_figure != null ? edit_result.roi.from_figure : false,
                mni_x: edit_result && edit_result.roi.mni_x != null ? edit_result.roi.mni_x : 0,
                mni_y: edit_result && edit_result.roi.mni_y != null ? edit_result.roi.mni_y : 0,
                mni_z: edit_result && edit_result.roi.mni_z != null ? edit_result.roi.mni_z : 0,
                mni_average: edit_result && edit_result.roi.mni_average != null ? edit_result.roi.mni_average : false,
            },
            stimulation_parameters: {
                stated: edit_result && edit_result.stimulation_parameters.stated !== null ? edit_result.stimulation_parameters.stated : true,
                amplitude_ma_min: edit_result && edit_result.stimulation_parameters.amplitude_ma_min != null ? edit_result.stimulation_parameters.amplitude_ma_min : 0,
                amplitude_ma_max: edit_result && edit_result.stimulation_parameters.amplitude_ma_max != null ? edit_result.stimulation_parameters.amplitude_ma_max : 0,
                amplitude_ma_avg: edit_result && edit_result.stimulation_parameters.amplitude_ma_avg != null ? edit_result.stimulation_parameters.amplitude_ma_avg : 0,
                frequency_hz: edit_result && edit_result.stimulation_parameters.frequency_hz != null ? edit_result.stimulation_parameters.frequency_hz : 0,
                frequency_hz_max: edit_result && edit_result.stimulation_parameters.frequency_hz_max != null ? edit_result.stimulation_parameters.frequency_hz_max : 0,
                duration_s: edit_result && edit_result.stimulation_parameters.duration_s != null ? edit_result.stimulation_parameters.duration_s : 0,
                duration_s_max: edit_result && edit_result.stimulation_parameters.duration_s_max != null ? edit_result.stimulation_parameters.duration_s_max : 0,
                electrode_make: edit_result && edit_result.stimulation_parameters.electrode_make != null ? edit_result.stimulation_parameters.electrode_make : "",
                implantation_type: edit_result && edit_result.stimulation_parameters.implantation_type != null ? edit_result.stimulation_parameters.implantation_type : "",
                contact_separation: edit_result && edit_result.stimulation_parameters.contact_separation != null ? edit_result.stimulation_parameters.contact_separation : 0,
                contact_diameter: edit_result && edit_result.stimulation_parameters.contact_diameter != null ? edit_result.stimulation_parameters.contact_diameter : 0,
                contact_length: edit_result && edit_result.stimulation_parameters.contact_length != null ? edit_result.stimulation_parameters.contact_length : 0,
                phase_length: edit_result && edit_result.stimulation_parameters.phase_length != null ? edit_result.stimulation_parameters.phase_length : 0,
                phase_type: edit_result && edit_result.stimulation_parameters.phase_type != null ? edit_result.stimulation_parameters.phase_type : "",
                epi_zone: edit_result && edit_result.stimulation_parameters.epi_zone != null ? edit_result.stimulation_parameters.epi_zone : "",
                epi_zone_comments: edit_result && edit_result.stimulation_parameters.epi_zone_comments != null ? edit_result.stimulation_parameters.epi_zone_comments : "",
            },
            effect: {
                class: edit_result && edit_result.effect.class != null ? edit_result.effect.class : "",
                descriptor: edit_result && edit_result.effect.descriptor != null ? edit_result.effect.descriptor : "",
                details: edit_result && edit_result.effect.details != null ? edit_result.effect.details : "",
                post_discharge: edit_result && edit_result.effect.post_discharge != null ? edit_result.effect.post_discharge : "",
                lateralization: edit_result && edit_result.effect.lateralization != null ? edit_result.effect.lateralization : "",
                dominant: edit_result && edit_result.effect.dominant != null ? edit_result.effect.dominant : "",
                body_part: edit_result && edit_result.effect.body_part != null ? edit_result.effect.body_part : "",
                comments: edit_result && edit_result.effect.comments != null ? edit_result.effect.comments : "",
            },
            task: {
                category: edit_result && edit_result.task.category != null ? edit_result.task.category : "",
                subcategory: edit_result && edit_result.task.subcategory != null ? edit_result.task.subcategory : "",
                characteristic: edit_result && edit_result.task.characteristic != null ? edit_result.task.characteristic : "",
                comments: edit_result && edit_result.task.comments != null ? edit_result.task.comments : "",
            },
            function: {
                category: edit_result && edit_result.function.category != null ? edit_result.function.category : "",
                subcategory: edit_result && edit_result.function.subcategory != null ? edit_result.function.subcategory : "",
                characteristic: edit_result && edit_result.function.characteristic != null ? edit_result.function.characteristic : "",
                article_designed_for_function: edit_result && edit_result.function.article_designed_for_function != null ? edit_result.function.article_designed_for_function : false,
                comments: edit_result && edit_result.function.comments != null ? edit_result.function.comments : "",
            },
            occurrences: edit_result && edit_result.occurrences != null ? edit_result.occurrences : 0,
            comments: edit_result && edit_result.comments != null ? edit_result.comments : "",
            comments_2: edit_result && edit_result.comments_2 != null ? edit_result.comments_2 : "",
            precision_score: edit_result && edit_result.precision_score != null ? edit_result.precision_score : 0,
            clinical_semiology: edit_result && edit_result.clinical_semiology != null ? edit_result.clinical_semiology : "",
        } as CreateEditResultFormValues,
    });

    const handleSubmit = (values: CreateEditResultFormValues) => {
        onSubmit(values);
    }

    // Frequency
    const handleFrequencyMinChanged = (newMin: number) => {
        // If new min is > existing max, set new max
        if (newMin > form.values.stimulation_parameters.frequency_hz_max) {
            form.setFieldValue('stimulation_parameters.frequency_hz_max', newMin);
        }
        form.setFieldValue('stimulation_parameters.frequency_hz', newMin);
    }
    const handleFrequencyMaxChanged = (newMax: number) => {
        // If new max is < existing min, set new min
        if (newMax < form.values.stimulation_parameters.frequency_hz) {
            form.setFieldValue('stimulation_parameters.frequency_hz', newMax);
        }
        form.setFieldValue('stimulation_parameters.frequency_hz_max', newMax);
    }

    // Duration
    const handleDurationMinChanged = (newMin: number) => {
        // If new min is > existing max, set new max
        if (newMin > form.values.stimulation_parameters.duration_s_max) {
            form.setFieldValue('stimulation_parameters.duration_s_max', newMin);
        }
        form.setFieldValue('stimulation_parameters.duration_s', newMin);
    }
    const handleDurationMaxChanged = (newMax: number) => {
        // If new max is < existing min, set new min
        if (newMax < form.values.stimulation_parameters.duration_s) {
            form.setFieldValue('stimulation_parameters.duration_s', newMax);
        }
        form.setFieldValue('stimulation_parameters.duration_s_max', newMax);
    }


    const appendValueToCurrentFormValue = (form_path: string, value: string) => {
        const current_value = form.getInputProps(form_path).value;
        const current_values = current_value.split(';');
        if (current_value === '') {
            form.setFieldValue(form_path, value);
        }
        else {
            if (!current_values.includes(value)) {
                form.setFieldValue(form_path, current_value + ';' + value);
            }
        }
    }

    const getElectrodeOptions = (): Map<string, ElectrodeOption> => {
        const options = [
            { implantationType: "SEEG", make: "AdTech", diameter: 0.9, separation: 3, lenght: 2.3 },
            { implantationType: "SEEG", make: "AdTech", diameter: 0.9, separation: 4, lenght: 2.3 },
            { implantationType: "SEEG", make: "Dixi", diameter: 0.8, separation: 3.5, lenght: 2 },
            { implantationType: "SEEG", make: "Huake-Hengsheng", diameter: 0.8, separation: 3.5, lenght: 2 },
        ] as ElectrodeOption[];
        return new Map(options.map(opt => [opt.implantationType + '|' + opt.make + '|' + opt.diameter + '|' + opt.separation + '|' + opt.lenght, opt]));
    }
    const ElectrodeOptions = getElectrodeOptions();

    // Handling tab change from parent
    const [selectedTab, setSelectedTab] = useState<string>(selected_tab ? selected_tab : "parameters");
    const handleTabChange = (value: TabsValue) => setSelectedTab(value);
    useEffect(() => {
        if (selected_tab !== undefined) {
            setSelectedTab(selected_tab);
        }
    }, [selected_tab]);

    // Call onFormValueChanged if specified when form value changes
    useEffect(() => {
        if (onFormValueChanged !== undefined) {
            onFormValueChanged(form.values);
        }
    }, [form.values])

    const iconStyle = { width: rem(12), height: rem(12) };
    return (
        <Box>
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <Tabs value={selectedTab} onTabChange={handleTabChange} >
                    <Group position="apart" align='start' w={"100%"} spacing={"md"} noWrap>
                        <Tabs.List grow w={"85%"}>
                            <Tabs.Tab value="parameters" icon={<IconSettingsBolt style={iconStyle} />}>
                                Parameters
                            </Tabs.Tab>
                            <Tabs.Tab value="task" icon={<IconSubtask style={iconStyle} />}>
                                Task
                            </Tabs.Tab>
                            <Tabs.Tab value="function" icon={<IconMathFunction style={iconStyle} />}>
                                Function
                            </Tabs.Tab>
                            <Tabs.Tab value="roi" icon={<IconTargetArrow style={iconStyle} />}>
                                ROI
                            </Tabs.Tab>
                            <Tabs.Tab value="effect" icon={<IconReportMedical style={iconStyle} />}>
                                Effect
                            </Tabs.Tab>
                            <Tabs.Tab value="details" icon={<IconChartPie style={iconStyle} />}>
                                Details
                            </Tabs.Tab>
                        </Tabs.List>
                        <Group position="right">
                            {onCancel != undefined && <Button type="reset" variant="light" onClick={() => { form.reset(); onCancel(); }}>Cancel</Button>}
                            <Button type="submit">Save</Button>
                        </Group>
                    </Group>

                    <Tabs.Panel value="parameters" mx={"sm"}>
                        <Divider label="Stimulation" />
                        <Switch
                            size="lg"
                            label="Parameters stated ?"
                            labelPosition="left"
                            onLabel="Stated"
                            offLabel="Not stated"
                            {...form.getInputProps('stimulation_parameters.stated', { type: 'checkbox' })}
                        />
                        <Group align="flex-end">
                            <NumberInput
                                label="Amplitude Min (mA)"
                                precision={2}
                                {...form.getInputProps('stimulation_parameters.amplitude_ma_min')}
                                disabled={!form.values.stimulation_parameters.stated}
                            />
                            <NumberInput
                                label="Amplitude Avg (mA)"
                                precision={2}
                                {...form.getInputProps('stimulation_parameters.amplitude_ma_avg')}
                                disabled={!form.values.stimulation_parameters.stated}
                            />
                            <Button.Group>
                                {preferences.amplitude_presets.map((v, i) =>
                                    <Button
                                        key={"amp_" + i}
                                        variant={form.values.stimulation_parameters.amplitude_ma_avg === v ? "filled" : "default"}
                                        onClick={() => form.setFieldValue('stimulation_parameters.amplitude_ma_avg', v)}
                                        disabled={!form.values.stimulation_parameters.stated}
                                    >
                                        {v}
                                    </Button>
                                )}
                            </Button.Group>
                            <NumberInput
                                label="Amplitude Max (mA)"
                                precision={2}
                                {...form.getInputProps('stimulation_parameters.amplitude_ma_max')}
                                disabled={!form.values.stimulation_parameters.stated}
                            />

                        </Group>

                        <Group position="apart">
                            <Group align="flex-end">
                                <NumberInput
                                    label="Frequency (Hz)"
                                    {...form.getInputProps('stimulation_parameters.frequency_hz')}
                                    onChange={(value) => handleFrequencyMinChanged(value === "" ? 0 : value)}
                                    disabled={!form.values.stimulation_parameters.stated}
                                />
                                <Button.Group>
                                    {preferences.frequency_presets.map((v, i) =>
                                        <Button
                                            key={"freq_" + i}
                                            variant={form.values.stimulation_parameters.frequency_hz === v ? "filled" : "default"}
                                            onClick={() => handleFrequencyMinChanged(v)}
                                            disabled={!form.values.stimulation_parameters.stated}>
                                            {v}
                                        </Button>
                                    )}
                                </Button.Group>
                                <NumberInput
                                    label="Frequency Max (Hz)"
                                    {...form.getInputProps('stimulation_parameters.frequency_hz_max')}
                                    onChange={(value) => handleFrequencyMaxChanged(value === "" ? 0 : value)}
                                    disabled={!form.values.stimulation_parameters.stated}
                                />
                            </Group>
                            <Group align="flex-end">
                                <NumberInput
                                    label="Duration (s)"
                                    {...form.getInputProps('stimulation_parameters.duration_s')}
                                    onChange={(value) => handleDurationMinChanged(value === "" ? 0 : value)}
                                    disabled={!form.values.stimulation_parameters.stated}
                                />
                                <Button.Group>
                                    {preferences.duration_presets.map((v, i) =>
                                        <Button
                                            key={"dur_" + i}
                                            variant={form.getInputProps('stimulation_parameters.duration_s').value === v ? "filled" : "default"}
                                            onClick={() => handleDurationMinChanged(v)}
                                            disabled={!form.values.stimulation_parameters.stated}>
                                            {v}
                                        </Button>
                                    )}
                                </Button.Group>
                                <NumberInput
                                    label="Duration Max (s)"
                                    {...form.getInputProps('stimulation_parameters.duration_s_max')}
                                    onChange={(value) => handleDurationMaxChanged(value === "" ? 0 : value)}
                                    disabled={!form.values.stimulation_parameters.stated}
                                />
                            </Group>
                        </Group>

                        <Group position="left">
                            <Group align="flex-end">
                                <NumberInput
                                    label="Phase Length"
                                    precision={1}
                                    {...form.getInputProps('stimulation_parameters.phase_length')}
                                    disabled={!form.values.stimulation_parameters.stated}
                                />
                                <Button.Group>
                                    {preferences.phase_length_presets.map((v, i) =>
                                        <Button
                                            key={"pl_" + i}
                                            variant={form.getInputProps('stimulation_parameters.phase_length').value === v ? "filled" : "default"}
                                            onClick={() => form.setFieldValue('stimulation_parameters.phase_length', v)}
                                            disabled={!form.values.stimulation_parameters.stated}>
                                            {v}
                                        </Button>
                                    )}
                                </Button.Group>
                            </Group>
                            <Radio.Group
                                label="Phase type"
                                {...form.getInputProps('stimulation_parameters.phase_type')}
                            >
                                <Group mt="xs">
                                    <Radio value="Monophasic" label="Monophasic" disabled={!form.values.stimulation_parameters.stated} />
                                    <Radio value="Biphasic" label="Biphasic" disabled={!form.values.stimulation_parameters.stated} />
                                    <Radio value="" label="N/A" disabled={!form.values.stimulation_parameters.stated} />
                                </Group>
                            </Radio.Group>
                        </Group>
                        <Group position="left">
                            <Radio.Group
                                label="In épileptogenic zone ?"
                                {...form.getInputProps('stimulation_parameters.epi_zone')}
                            >
                                <Group mt="xs">
                                    <Radio value="yes" label="Yes" disabled={!form.values.stimulation_parameters.stated} />
                                    <Radio value="no" label="No" disabled={!form.values.stimulation_parameters.stated} />
                                    <Radio value="unknown" label="Unknown" disabled={!form.values.stimulation_parameters.stated} />
                                    <Radio value="" label="Not stated" disabled={!form.values.stimulation_parameters.stated} />
                                </Group>
                            </Radio.Group>
                            <TextInput
                                label="Comments"
                                {...form.getInputProps('stimulation_parameters.epi_zone_comments')}
                            />
                        </Group>
                        <Divider label="Electrodes" />
                        <Stack>
                            <NativeSelect
                                label="Configuration"
                                data={[{ value: '', label: 'Pick One' }, ...ElectrodeOptions.keys()]}
                                onChange={(event) => {
                                    if (ElectrodeOptions.has(event.target.value)) {
                                        var option = ElectrodeOptions.get(event.target.value);
                                        form.setFieldValue('stimulation_parameters.implantation_type', option.implantationType);
                                        form.setFieldValue('stimulation_parameters.electrode_make', option.make);
                                        form.setFieldValue('stimulation_parameters.contact_diameter', option.diameter);
                                        form.setFieldValue('stimulation_parameters.contact_separation', option.separation);
                                        form.setFieldValue('stimulation_parameters.contact_length', option.lenght);
                                    }
                                }}
                            />
                            <Group position="apart" spacing={"sm"}>
                                <Radio.Group
                                    label="Implentation type"
                                    {...form.getInputProps('stimulation_parameters.implantation_type')}
                                >
                                    <Group mt="xs">
                                        <Radio value="SEEG" label="SEEG" />
                                        <Radio value="Grids" label="Grids" />
                                        <Radio value="" label="N/A" />
                                    </Group>
                                </Radio.Group>
                                <TextInput
                                    label="Electrode make"
                                    {...form.getInputProps('stimulation_parameters.electrode_make')}
                                />
                                <NumberInput
                                    label="Contact diameter (mm)"
                                    precision={1}
                                    {...form.getInputProps('stimulation_parameters.contact_diameter')}
                                />
                                <NumberInput
                                    label="Contact separation (mm)"
                                    precision={1}
                                    {...form.getInputProps('stimulation_parameters.contact_separation')}
                                />
                                <NumberInput
                                    label="Contact length (mm)"
                                    precision={1}
                                    {...form.getInputProps('stimulation_parameters.contact_length')}
                                />
                            </Group>
                        </Stack>

                    </Tabs.Panel>

                    <Tabs.Panel value="task" mx={"sm"}>
                        <Radio.Group
                            {...form.getInputProps('task.category')}>
                            <Group mt="xs">
                                <Radio value="" label="Not stated" />
                                <Radio value="No task used" label="No task used" />
                                <Radio value="Task used but not described" label="Task used but not described" />
                            </Group>
                        </Radio.Group>
                        <TaskOptionsTableForm
                            form={form}
                            onSelect={(path, v) => appendValueToCurrentFormValue(path, v)}
                            tasks={tasks}
                        />
                        <Divider />
                        <Textarea
                            label="Comments"
                            placeholder="Write your comments here"
                            {...form.getInputProps('task.comments')}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="function" mx={"sm"}>
                        <Switch
                            label="Article designed to assess specific function ?"
                            labelPosition="left"
                            {...form.getInputProps('function.article_designed_for_function', { type: 'checkbox' })}
                        />
                        <FunctionOptionsTableForm
                            form={form}
                            onSelect={(path, v) => appendValueToCurrentFormValue(path, v)}
                            functions={functions}
                        />
                        <Divider />
                        <Textarea
                            label="Comments"
                            placeholder="Write your comments here"
                            {...form.getInputProps('function.comments')}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="roi" mx={"sm"}>
                        <Radio.Group
                            label="Side"
                            {...form.getInputProps('roi.side')}
                        >
                            <Group mt="xs">
                                <Radio value="left" label="Left" />
                                <Radio value="right" label="Right" />
                                <Radio value="" label="Not stated" />
                            </Group>
                        </Radio.Group>
                        <Accordion defaultValue="VEP" variant="contained">
                            <Accordion.Item value="VEP">
                                <Accordion.Control>{"VEP Lobe/Region/Area"}</Accordion.Control>
                                <Accordion.Panel>
                                    <ROIOptionsTableForm
                                        form={form}
                                        onSelect={(path, v) => appendValueToCurrentFormValue(path, v)}
                                        rois={rois}
                                    />
                                </Accordion.Panel>
                            </Accordion.Item>
                            <Accordion.Item value="MNI">
                                <Accordion.Control>{"MNI coordinates"}</Accordion.Control>
                                <Accordion.Panel>
                                    <Group position="apart">
                                        <NumberInput
                                            label="X"
                                            precision={2}
                                            {...form.getInputProps('roi.mni_x')}
                                        />
                                        <NumberInput
                                            label="Y"
                                            precision={2}
                                            {...form.getInputProps('roi.mni_y')}
                                        />
                                        <NumberInput
                                            label="Z"
                                            precision={2}
                                            {...form.getInputProps('roi.mni_z')}
                                        />
                                        <Switch
                                            label="Average?"
                                            labelPosition="left"
                                            {...form.getInputProps('roi.mni_average', { type: 'checkbox' })}
                                        />
                                    </Group>
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>

                    </Tabs.Panel>

                    <Tabs.Panel value="effect" mx={"sm"}>
                        <EffectOptionsTableForm
                            form={form}
                            onSelect={(path, v) => appendValueToCurrentFormValue(path, v)}
                            effects={effects}
                        />
                        <Divider />
                        <Radio.Group
                            label="Post discharge ?"
                            {...form.getInputProps('effect.post_discharge')}
                        >
                            <Group mt="xs">
                                <Radio value="yes" label="Yes" />
                                <Radio value="no" label="No" />
                                <Radio value="" label="Not stated" />
                            </Group>
                        </Radio.Group>
                        <Radio.Group
                            label="Lateralization"
                            {...form.getInputProps('effect.lateralization')}
                        >
                            <Group mt="xs">
                                <Radio value="ipsilateral" label="Ipsilateral" />
                                <Radio value="non-lateralizable" label="Non-lateralizable" />
                                <Radio value="contralateral" label="Contralateral" />
                                <Radio value="" label="Not stated" />
                            </Group>
                        </Radio.Group>
                        <Radio.Group
                            label="Dominance"
                            {...form.getInputProps('effect.dominant')}
                        >
                            <Group mt="xs">
                                <Radio value="dominant" label="Dominant" />
                                <Radio value="non-dominant" label="Non-dominant" />
                                <Radio value="" label="Not stated" />
                            </Group>
                        </Radio.Group>

                        <BodyPartSelection
                            bodyPartsOptions={body_parts}
                            form={form}
                        />

                        <Divider />
                        <Textarea
                            label="Comments"
                            placeholder="Write your comments here"
                            {...form.getInputProps('effect.comments')}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="details" mx={"sm"}>
                        <NumberInput
                            label="Occurrences"
                            autoFocus
                            {...form.getInputProps('occurrences')}
                        />
                        <Textarea
                            label="Comments"
                            placeholder="Write your comments here"
                            {...form.getInputProps('comments')}
                        />
                        <Textarea
                            label="Comments 2"
                            placeholder="Write your comments here"
                            {...form.getInputProps('comments_2')}
                        />
                        <NumberInput
                            label="Precision score"
                            precision={2}
                            {...form.getInputProps('precision_score')}
                        />
                        <Textarea
                            label="Clinical Semiology"
                            placeholder="Write here"
                            {...form.getInputProps('clinical_semiology')}
                        />
                    </Tabs.Panel>
                </Tabs>


            </form>
        </Box>
    )
}

interface ElectrodeOption { implantationType: "SEEG" | "Grids", make: string, diameter: number, separation: number, lenght: number }

export interface CreateEditResultFormValues {
    roi: {
        side: string,
        lobe: string,
        region: string,
        area: string,
        from_figure: boolean,
        mni_x: number,
        mni_y: number,
        mni_z: number,
        mni_average: boolean,
    },
    stimulation_parameters: {
        stated: boolean,
        amplitude_ma_min: number,
        amplitude_ma_max: number,
        amplitude_ma_avg: number,
        frequency_hz: number,
        frequency_hz_max: number,
        duration_s: number,
        duration_s_max: number,
        implantation_type: string,
        electrode_make: string,
        contact_separation: number,
        contact_diameter: number,
        contact_length: number,
        phase_length: number,
        phase_type: string,
        epi_zone: string,
        epi_zone_comments: string,
    }
    effect: {
        class: string,
        descriptor: string,
        details: string,
        post_discharge: string,
        lateralization: string,
        dominant: string,
        body_part: string,
        comments: string,
    },
    task: {
        category: string,
        subcategory: string,
        characteristic: string,
        comments: string,
    },
    function: {
        category: string,
        subcategory: string,
        characteristic: string,
        article_designed_for_function: boolean,
        comments: string,
    },
    occurrences: number,
    comments?: string,
    comments_2?: string,
    precision_score: number,
    clinical_semiology: string,
}

interface CreateEditResultFormProps {
    onSubmit: (values: CreateEditResultFormValues) => void;
    onCancel?: () => void;
    edit_result?: ResultDdo;
    rois: ROIDdo[];
    effects: EffectDdo[];
    tasks: TaskDdo[];
    functions: FunctionDdo[];
    body_parts: string[];
    selected_tab?: "parameters" | "roi" | "effect" | "task" | "function" | "details";
    onFormValueChanged?: (newValue: CreateEditResultFormValues) => void;
}
