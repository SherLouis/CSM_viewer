import { Box, Group, Button, NativeSelect, NumberInput, Autocomplete, Switch, Textarea, Tabs, rem, Radio, Stack, Title, Divider, SelectItem, TextInput, Table, Checkbox } from "@mantine/core"
import { useForm } from '@mantine/form';
import { ResultDdo } from "../../models/ResultDdo";
import { IconTargetArrow, IconSettingsBolt, IconReportMedical, IconChartPie, IconSubtask, IconMathFunction } from "@tabler/icons-react";
import { ROIDdo } from "../../models/ROIDdo";
import { EffectDdo } from "../../models/EffectDdo";
import { TaskDdo } from "../../models/TaskDdo";
import { FunctionDdo } from "../../models/FunctionDdo";
import ColumnButtonSelect from "./ColumnButtonSelect";

export const CreateEditResultForm = ({ onSubmit, onCancel, edit_result, rois, effects, tasks, functions }: CreateEditResultFormProps) => {
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
                amplitude_ma: edit_result && edit_result.stimulation_parameters.amplitude_ma != null ? edit_result.stimulation_parameters.amplitude_ma : 0,
                amplitude_ma_max: edit_result && edit_result.stimulation_parameters.amplitude_ma_max != null ? edit_result.stimulation_parameters.amplitude_ma_max : 0,
                frequency_hz: edit_result && edit_result.stimulation_parameters.frequency_hz != null ? edit_result.stimulation_parameters.frequency_hz : 0,
                frequency_hz_max: edit_result && edit_result.stimulation_parameters.frequency_hz_max != null ? edit_result.stimulation_parameters.frequency_hz_max : 0,
                duration_s: edit_result && edit_result.stimulation_parameters.duration_s != null ? edit_result.stimulation_parameters.duration_s : 0,
                duration_s_max: edit_result && edit_result.stimulation_parameters.duration_s_max != null ? edit_result.stimulation_parameters.duration_s_max : 0,
                electrode_make: edit_result && edit_result.stimulation_parameters.electrode_make != null ? edit_result.stimulation_parameters.electrode_make : "",
                implentation_type: edit_result && edit_result.stimulation_parameters.implentation_type != null ? edit_result.stimulation_parameters.implentation_type : "",
                contact_separation: edit_result && edit_result.stimulation_parameters.contact_separation != null ? edit_result.stimulation_parameters.contact_separation : 0,
                contact_diameter: edit_result && edit_result.stimulation_parameters.contact_diameter != null ? edit_result.stimulation_parameters.contact_diameter : 0,
                contact_length: edit_result && edit_result.stimulation_parameters.contact_length != null ? edit_result.stimulation_parameters.contact_length : 0,
                phase_length: edit_result && edit_result.stimulation_parameters.phase_length != null ? edit_result.stimulation_parameters.phase_length : 0,
                phase_type: edit_result && edit_result.stimulation_parameters.phase_type != null ? edit_result.stimulation_parameters.phase_type : "",
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
        } as CreateEditResultFormValues,
    });

    const handleSubmit = (values: CreateEditResultFormValues) => {
        onSubmit(values);
    }

    const getRoiOptions = (level: 'lobe' | 'region' | 'area') => {
        switch (level) {
            case 'lobe':
                return rois.filter((roi) => roi.level == level).map((roi) => roi.lobe);
            case 'region':
                return rois.filter((roi) => roi.level == level
                    && roi.lobe == form.getInputProps('roi.lobe').value).map((roi) => roi.region);
            case 'area':
                return rois.filter((roi) => roi.level == level
                    && roi.lobe == form.getInputProps('roi.lobe').value
                    && roi.region == form.getInputProps('roi.region').value).map((roi) => roi.area);
            default:
                return [];
        }
    }

    const getEffectOptions = (level: 'class' | 'descriptor' | 'details') => {
        switch (level) {
            case 'class':
                return effects.filter((effect) => effect.level == level).map((effect) => effect.class);
            case 'descriptor':
                return effects.filter((effect) => effect.level == level
                    && effect.class == form.getInputProps('effect.class').value).map((effect) => effect.descriptor);
            case 'details':
                return effects.filter((effect) => effect.level == level
                    && effect.class == form.getInputProps('effect.class').value
                    && effect.descriptor == form.getInputProps('effect.descriptor').value).map((effect) => effect.details);
        }
    }

    const getTaskOptions = (level: 'category' | 'subcategory' | 'characteristic') => {
        switch (level) {
            case 'category':
                return tasks.filter((task) => task.level == level).map((task) => task.category);
            case 'subcategory':
                return tasks.filter((task) => task.level == level
                    && task.category == form.getInputProps('task.category').value).map((task) => task.subcategory);
            case 'characteristic':
                return tasks.filter((task) => task.level == level
                    && task.category == form.getInputProps('task.category').value
                    && task.subcategory == form.getInputProps('task.subcategory').value).map((task) => task.characteristic);
        }
    }

    const getFunctionOptions = (level: 'category' | 'subcategory' | 'characteristic') => {
        switch (level) {
            case 'category':
                return functions.filter((func) => func.level == level).map((func) => func.category);
            case 'subcategory':
                return functions.filter((func) => func.level == level
                    && func.category == form.getInputProps('function.category').value).map((func) => func.subcategory);
            case 'characteristic':
                return functions.filter((func) => func.level == level
                    && func.category == form.getInputProps('function.category').value
                    && func.subcategory == form.getInputProps('function.subcategory').value).map((func) => func.characteristic);
        }
    }

    const setAmplitudeValue = (value: number) => {
        form.setFieldValue('stimulation_parameters.amplitude_ma', value);
        form.setFieldValue('stimulation_parameters.amplitude_ma_max', value);
    }
    const setFrequencyValue = (value: number) => {
        form.setFieldValue('stimulation_parameters.frequency_hz', value);
        form.setFieldValue('stimulation_parameters.frequency_hz_max', value);
    }
    const setDurationValue = (value: number) => {
        form.setFieldValue('stimulation_parameters.duration_s', value);
        form.setFieldValue('stimulation_parameters.duration_s_max', value);
    }
    const appendValueToCurrentFormValue = (form_path: string, value: string) => {
        const current_value = form.getInputProps(form_path).value;
        if (current_value !== '') { form.setFieldValue(form_path, current_value + ';' + value); }
        else { form.setFieldValue(form_path, value); }
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

    const getBodyPartOptions = (): SelectItem[] => {
        return [
            { value: "arm", label: "Arm" },
            { value: "leg", label: "Leg" },
            { value: "chest", label: "Chest" },
        ];
    }

    const iconStyle = { width: rem(12), height: rem(12) };
    return (
        <Box>
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <Tabs defaultValue="parameters">
                    <Group position="apart" align='start'>
                        <Tabs.List>
                            <Tabs.Tab value="parameters" icon={<IconSettingsBolt style={iconStyle} />}>
                                Parameters
                            </Tabs.Tab>
                            <Tabs.Tab value="roi" icon={<IconTargetArrow style={iconStyle} />}>
                                ROI
                            </Tabs.Tab>
                            <Tabs.Tab value="effect" icon={<IconReportMedical style={iconStyle} />}>
                                Effect
                            </Tabs.Tab>
                            <Tabs.Tab value="task" icon={<IconSubtask style={iconStyle} />}>
                                Task
                            </Tabs.Tab>
                            <Tabs.Tab value="function" icon={<IconMathFunction style={iconStyle} />}>
                                Function
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

                    <Tabs.Panel value="parameters">
                        <Divider label="Aplitude" />
                        <Group position="apart">
                            <NumberInput
                                label="Amplitude (mA)"
                                precision={1}
                                {...form.getInputProps('stimulation_parameters.amplitude_ma')}
                                onChange={(value) => { setAmplitudeValue(value === "" ? 0 : value); form.getInputProps('stimulation_parameters.amplitude_ma').onChange(value); }}
                            />
                            <Button.Group>
                                <Button variant={form.getInputProps('stimulation_parameters.amplitude_ma').value === 0.5 ? "filled" : "default"} onClick={() => setAmplitudeValue(0.5)}>0.5</Button>
                                <Button variant={form.getInputProps('stimulation_parameters.amplitude_ma').value === 0.8 ? "filled" : "default"} onClick={() => setAmplitudeValue(0.8)}>0.8</Button>
                                <Button variant={form.getInputProps('stimulation_parameters.amplitude_ma').value === 1.0 ? "filled" : "default"} onClick={() => setAmplitudeValue(1.0)}>1.0</Button>
                                <Button variant={form.getInputProps('stimulation_parameters.amplitude_ma').value === 1.2 ? "filled" : "default"} onClick={() => setAmplitudeValue(1.2)}>1.2</Button>
                                <Button variant={form.getInputProps('stimulation_parameters.amplitude_ma').value === 1.4 ? "filled" : "default"} onClick={() => setAmplitudeValue(1.4)}>1.4</Button>
                                <Button variant={form.getInputProps('stimulation_parameters.amplitude_ma').value === 2.0 ? "filled" : "default"} onClick={() => setAmplitudeValue(2.0)}>2.0</Button>
                            </Button.Group>
                            <NumberInput
                                label="Amplitude Max (mA)"
                                precision={1}
                                {...form.getInputProps('stimulation_parameters.amplitude_ma_max')}
                            />
                        </Group>
                        <Divider label="Frequency" />
                        <Group position="apart">
                            <NumberInput
                                label="Frequency (Hz)"
                                {...form.getInputProps('stimulation_parameters.frequency_hz')}
                                onChange={(value) => { setFrequencyValue(value === "" ? 0 : value); form.getInputProps('stimulation_parameters.frequency_hz').onChange(value); }}
                            />
                            <Button.Group>
                                <Button variant={form.getInputProps('stimulation_parameters.frequency_hz').value === 1 ? "filled" : "default"} onClick={() => setFrequencyValue(1)}>1</Button>
                                <Button variant={form.getInputProps('stimulation_parameters.frequency_hz').value === 55 ? "filled" : "default"} onClick={() => setFrequencyValue(55)}>55</Button>
                            </Button.Group>
                            <NumberInput
                                label="Frequency Max (Hz)"
                                {...form.getInputProps('stimulation_parameters.frequency_hz_max')}
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
                                        form.setFieldValue('stimulation_parameters.implentation_type', option.implantationType);
                                        form.setFieldValue('stimulation_parameters.electrode_make', option.make);
                                        form.setFieldValue('stimulation_parameters.contact_diameter', option.diameter);
                                        form.setFieldValue('stimulation_parameters.contact_separation', option.separation);
                                        form.setFieldValue('stimulation_parameters.contact_length', option.lenght);
                                    }
                                }}
                            />
                            <Group position="apart">
                                <Radio.Group
                                    label="Implentation type"
                                    {...form.getInputProps('stimulation_parameters.implentation_type')}
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
                        <Divider label="Phase" />
                        <Stack>
                            <Title order={5}>Phase</Title>
                            <Group>
                                <NumberInput
                                    label="Phase Length"
                                    precision={1}
                                    {...form.getInputProps('stimulation_parameters.phase_length')}
                                />
                                <Button.Group>
                                    <Button variant={form.getInputProps('stimulation_parameters.phase_length').value === 0.3 ? "filled" : "default"} onClick={() => form.setFieldValue('stimulation_parameters.phase_length', 0.3)}>0.3</Button>
                                    <Button variant={form.getInputProps('stimulation_parameters.phase_length').value === 0.5 ? "filled" : "default"} onClick={() => form.setFieldValue('stimulation_parameters.phase_length', 0.5)}>0.5</Button>
                                </Button.Group>
                            </Group>
                            <Radio.Group
                                label="Phase type"
                                {...form.getInputProps('stimulation_parameters.phase_type')}
                            >
                                <Group mt="xs">
                                    <Radio value="Monophasic" label="Monophasic" />
                                    <Radio value="Biphasic" label="Biphasic" />
                                    <Radio value="" label="N/A" />
                                </Group>
                            </Radio.Group>
                        </Stack>
                        <Divider label="Duration" />
                        <Group position="apart">
                            <NumberInput
                                label="Duration (s)"
                                {...form.getInputProps('stimulation_parameters.duration_s')}
                                onChange={(value) => { setDurationValue(value === "" ? 0 : value); form.getInputProps('stimulation_parameters.duration_s').onChange(value); }}
                            />
                            <Button.Group>
                                <Button variant={form.getInputProps('stimulation_parameters.duration_s').value === 5 ? "filled" : "default"} onClick={() => setDurationValue(5)}>5</Button>
                                <Button variant={form.getInputProps('stimulation_parameters.duration_s').value === 10 ? "filled" : "default"} onClick={() => setDurationValue(10)}>10</Button>
                            </Button.Group>
                            <NumberInput
                                label="Duration Max (s)"
                                {...form.getInputProps('stimulation_parameters.duration_s_max')}
                            />
                        </Group>
                    </Tabs.Panel>
                    <Tabs.Panel value="roi">
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

                        <Table sx={{ tableLayout: 'fixed', width: "100%", border: 0 }}>
                            <thead>
                                <tr>
                                    <th>Lobe</th>
                                    <th>Region</th>
                                    <th>Area</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={"options"}>
                                    <td>
                                        <ColumnButtonSelect
                                            data={getRoiOptions('lobe')}
                                            onChange={(v) => { appendValueToCurrentFormValue('roi.lobe', v); }}
                                            form={form} form_path='roi.lobe'
                                        />
                                    </td>
                                    <td>
                                        <ColumnButtonSelect
                                            data={getRoiOptions('region')}
                                            form={form} form_path="roi.region"
                                            onChange={(v) => { appendValueToCurrentFormValue('roi.region', v); }}
                                        />
                                    </td>
                                    <td>
                                        <ColumnButtonSelect
                                            data={getRoiOptions('area')}
                                            form={form} form_path="roi.area"
                                            onChange={(v) => { appendValueToCurrentFormValue('roi.area', v); }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextInput
                                            placeholder="Insert some value here"
                                            {...form.getInputProps('roi.lobe')}
                                        />
                                    </td>
                                    <td>
                                        <TextInput
                                            placeholder="Insert some value here"
                                            {...form.getInputProps('roi.region')}
                                        />
                                    </td>
                                    <td>
                                        <TextInput
                                            placeholder="Insert some value here"
                                            {...form.getInputProps('roi.area')}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>

                        <Divider label="MNI" />
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

                    </Tabs.Panel>
                    <Tabs.Panel value="effect">
                        <Table sx={{ tableLayout: 'fixed', width: "100%", border: 0 }}>
                            <thead>
                                <tr>
                                    <th>Class</th>
                                    <th>Descriptor</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={"options"}>
                                    <td>
                                        <ColumnButtonSelect
                                            data={getEffectOptions('class')}
                                            form={form} form_path="effect.class"
                                            onChange={(v) => { appendValueToCurrentFormValue('effect.class', v); }}
                                        />
                                    </td>
                                    <td>
                                        <ColumnButtonSelect
                                            data={getEffectOptions('descriptor')}
                                            form={form} form_path="effect.descriptor"
                                            onChange={(v) => { appendValueToCurrentFormValue('effect.descriptor', v); }}
                                        />
                                    </td>
                                    <td>
                                        <ColumnButtonSelect
                                            data={getEffectOptions('details')}
                                            form={form} form_path="effect.details"
                                            onChange={(v) => { appendValueToCurrentFormValue('effect.details', v); }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextInput
                                            placeholder="Insert some value here"
                                            {...form.getInputProps('effect.class')}
                                        />
                                    </td>
                                    <td>
                                        <TextInput
                                            placeholder="Insert some value here"
                                            {...form.getInputProps('effect.descriptor')}
                                        />
                                    </td>
                                    <td>
                                        <TextInput
                                            placeholder="Insert some value here"
                                            {...form.getInputProps('effect.details')}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>

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
                        <NativeSelect
                            label="Body part"
                            data={[{ value: '', label: 'Pick One' }, ...getBodyPartOptions()]}
                            {...form.getInputProps('effect.body_part')}
                        />
                        <Divider />
                        <Textarea
                            label="Comments"
                            placeholder="Write your comments here"
                            {...form.getInputProps('effect.comments')}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel value="task">
                        <Table sx={{ tableLayout: 'fixed', width: "100%", border: 0 }}>
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Subcategory</th>
                                    <th>Characteristic</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={"options"}>
                                    <td>
                                        <ColumnButtonSelect
                                            data={getTaskOptions('category')}
                                            form={form} form_path="task.category"
                                            onChange={(v) => { appendValueToCurrentFormValue('task.category', v); }}
                                        />
                                    </td>
                                    <td>
                                        <ColumnButtonSelect
                                            data={getTaskOptions('subcategory')}
                                            form={form} form_path="task.subcategory"
                                            onChange={(v) => { appendValueToCurrentFormValue('task.subcategory', v); }}
                                        />
                                    </td>
                                    <td>
                                        <ColumnButtonSelect
                                            data={getTaskOptions('characteristic')}
                                            form={form} form_path="task.characteristic"
                                            onChange={(v) => { appendValueToCurrentFormValue('task.characteristic', v); }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextInput
                                            placeholder="Insert some value here"
                                            {...form.getInputProps('task.category')}
                                        />
                                    </td>
                                    <td>
                                        <TextInput
                                            placeholder="Insert some value here"
                                            {...form.getInputProps('task.subcategory')}
                                        />
                                    </td>
                                    <td>
                                        <TextInput
                                            placeholder="Insert some value here"
                                            {...form.getInputProps('task.characteristic')}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        <Divider />
                        <Textarea
                            label="Comments"
                            placeholder="Write your comments here"
                            {...form.getInputProps('task.comments')}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel value="function">
                        <Switch
                            label="Article designed to assess specific function ?"
                            labelPosition="left"
                            {...form.getInputProps('function.article_designed_for_function', { type: 'checkbox' })}
                        />
                        <Table sx={{ tableLayout: 'fixed', width: "100%", border: 0 }}>
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Subcategory</th>
                                    <th>Characteristic</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={"options"}>
                                    <td>
                                        <ColumnButtonSelect
                                            data={getFunctionOptions('category')}
                                            form={form} form_path="function.category"
                                            onChange={(v) => { appendValueToCurrentFormValue('function.category', v); }}
                                        />
                                    </td>
                                    <td>
                                        <ColumnButtonSelect
                                            data={getFunctionOptions('subcategory')}
                                            form={form} form_path="function.subcategory"
                                            onChange={(v) => { appendValueToCurrentFormValue('function.subcategory', v); }}
                                        />
                                    </td>
                                    <td>
                                        <ColumnButtonSelect
                                            data={getFunctionOptions('characteristic')}
                                            form={form} form_path="function.characteristic"
                                            onChange={(v) => { appendValueToCurrentFormValue('function.characteristic', v); }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextInput
                                            placeholder="Insert some value here"
                                            {...form.getInputProps('function.category')}
                                        />
                                    </td>
                                    <td>
                                        <TextInput
                                            placeholder="Insert some value here"
                                            {...form.getInputProps('function.subcategory')}
                                        />
                                    </td>
                                    <td>
                                        <TextInput
                                            placeholder="Insert some value here"
                                            {...form.getInputProps('function.characteristic')}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        <Divider />
                        <Textarea
                            label="Comments"
                            placeholder="Write your comments here"
                            {...form.getInputProps('function.comments')}
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
        amplitude_ma: number,
        amplitude_ma_max: number,
        frequency_hz: number,
        frequency_hz_max: number,
        duration_s: number,
        duration_s_max: number,
        implentation_type: string,
        electrode_make: string,
        contact_separation: number,
        contact_diameter: number,
        contact_length: number,
        phase_length: number,
        phase_type: string,
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
}

interface CreateEditResultFormProps {
    onSubmit: (values: CreateEditResultFormValues) => void;
    onCancel?: () => void;
    edit_result?: ResultDdo;
    rois: ROIDdo[];
    effects: EffectDdo[];
    tasks: TaskDdo[];
    functions: FunctionDdo[];
}
