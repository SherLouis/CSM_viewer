import { Box, TextInput, Group, Button, Accordion, NativeSelect, NumberInput, Autocomplete, MultiSelect, Switch, Space, Textarea, Checkbox, Tabs, rem } from "@mantine/core"
import { useForm } from '@mantine/form';
import { ResultDdo } from "../../models/ResultDdo";
import { IconTargetArrow, IconSettingsBolt, IconReportMedical, IconChartPie, IconSubtask, IconMathFunction } from "@tabler/icons-react";
import { ROIDdo } from "../../models/ROIDdo";
import { EffectDdo } from "../../models/EffectDdo";
import { TaskDdo } from "../../models/TaskDdo";
import { FunctionDdo } from "../../models/FunctionDdo";

export const CreateEditResultForm = ({ onSubmit, edit_result, rois, effects, tasks, functions }: CreateEditResultFormProps) => {
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
            task: {
                category: edit_result && edit_result.task.category != null ? edit_result.task.category : "" ,
                subcategory: edit_result && edit_result.task.subcategory != null ? edit_result.task.subcategory : "" ,
                characteristic: edit_result && edit_result.task.characteristic != null ? edit_result.task.characteristic : "" ,
                precision: edit_result && edit_result.task.precision != null ? edit_result.task.precision : "" ,
            },
            function: {
                category: edit_result && edit_result.function.category != null ? edit_result.function.category : "",
                subcategory: edit_result && edit_result.function.subcategory != null ? edit_result.function.subcategory : "",
                characteristic: edit_result && edit_result.function.characteristic != null ? edit_result.function.characteristic : "",
                precision: edit_result && edit_result.function.precision != null ? edit_result.function.precision : "",
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

    const getTaskOptions = (level: 'category' | 'subcategory' | 'characteristic' | 'precision') => {
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
            case 'precision':
                return tasks.filter((task) => task.level == level
                    && task.category == form.getInputProps('task.category').value
                    && task.subcategory == form.getInputProps('task.subcategory').value
                    && task.characteristic == form.getInputProps('task.characteristic').value).map((task) => task.precision);
        }
    }

    const getFunctionOptions = (level: 'category' | 'subcategory' | 'characteristic' | 'precision') => {
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
            case 'precision':
                return functions.filter((func) => func.level == level
                    && func.category == form.getInputProps('function.category').value
                    && func.subcategory == form.getInputProps('function.subcategory').value
                    && func.characteristic == form.getInputProps('function.characteristic').value).map((func) => func.precision);
        }
    }

    const canAddNewRoiManual = (level: 'lobe' | 'gyrus' | 'sub' | 'precision'): boolean => {
        switch (level) {
            case 'lobe':
                return false;
            case 'gyrus':
                return false;
            case 'sub':
                let roi = rois.find((r) => r.level == 'gyrus' && r.gyrus == form.getInputProps('roi.gyrus').value);
                return getRoiOptions('gyrus').includes(form.getInputProps('roi.gyrus').value)
                    && roi != undefined && !roi.is_manual
            case 'precision':
                roi = rois.find((r) => r.level == 'sub' && r.sub == form.getInputProps('roi.sub').value)
                return getRoiOptions('sub').includes(form.getInputProps('roi.sub').value)
                    && roi != undefined && !roi.is_manual
        }
    }

    const canAddNewEffectManual = (level: 'category' | 'semiology' | 'characteristic' | 'precision'): boolean => {
        switch (level) {
            case 'category':
                return false;
            case 'semiology':
                return false;
            case 'characteristic':
                let effect = effects.find((e) => e.level == 'semiology' && e.semiology == form.getInputProps('effect.semiology').value);
                return getEffectOptions('semiology').includes(form.getInputProps('effect.semiology').value)
                    && effect != undefined && !effect.is_manual
            case 'precision':
                effect = effects.find((e) => e.level == 'characteristic' && e.characteristic == form.getInputProps('effect.characteristic').value)
                return getEffectOptions('characteristic').includes(form.getInputProps('effect.characteristic').value)
                    && effect != undefined && !effect.is_manual
        }
    }

    const canAddNewTaskManual = (level: 'category' | 'subcategory' | 'characteristic' | 'precision'): boolean => {
        switch (level) {
            case 'category':
                return false;
            case 'subcategory':
                return false;
            case 'characteristic':
                let task = tasks.find((i) => i.level == 'subcategory' && i.subcategory == form.getInputProps('task.subcategory').value);
                return getTaskOptions('subcategory').includes(form.getInputProps('task.subcategory').value)
                    && task != undefined && !task.is_manual
            case 'precision':
                task = tasks.find((i) => i.level == 'characteristic' && i.characteristic == form.getInputProps('task.characteristic').value);
                return getTaskOptions('characteristic').includes(form.getInputProps('task.characteristic').value)
                    && task != undefined && !task.is_manual
        }
    }

    const canAddNewFunctionManual = (level: 'category' | 'subcategory' | 'characteristic' | 'precision'): boolean => {
        switch (level) {
            case 'category':
                return false;
            case 'subcategory':
                return false;
            case 'characteristic':
                let func = functions.find((i) => i.level == 'subcategory' && i.subcategory == form.getInputProps('function.subcategory').value);
                return getFunctionOptions('subcategory').includes(form.getInputProps('function.subcategory').value)
                    && func!=undefined && !func.is_manual
            case 'precision':
                func = functions.find((i) => i.level == 'characteristic' && i.characteristic == form.getInputProps('function.characteristic').value);
                return getFunctionOptions('characteristic').includes(form.getInputProps('function.characteristic').value)
                    && func!=undefined && !func.is_manual;
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
                        <Tabs.Tab value="parameters" icon={<IconSettingsBolt style={iconStyle} />}>
                            Parameters
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

                    <Tabs.Panel value="roi">
                        <NativeSelect
                            required
                            label="Lobe"
                            data={[{ value: '', label: 'Pick One' }, ...getRoiOptions('lobe')]}
                            {...form.getInputProps('roi.lobe')}
                            onChange={(event) => {
                                form.setFieldValue('roi.gyrus', '');
                                form.setFieldValue('roi.sub', '');
                                form.setFieldValue('roi.precision', '');
                                form.getInputProps('roi.lobe').onChange(event)
                            }}
                        />
                        {getRoiOptions('gyrus').length > 0 &&
                            <NativeSelect
                                label="Gyrus"
                                data={[{ value: '', label: 'Pick One' }, ...getRoiOptions('gyrus')]}
                                {...form.getInputProps('roi.gyrus')}
                                onChange={(event) => {
                                    form.setFieldValue('roi.sub', '');
                                    form.setFieldValue('roi.precision', '');
                                    form.getInputProps('roi.gyrus').onChange(event)
                                }}
                            />
                        }
                        {getRoiOptions('sub').length > 0 && !canAddNewRoiManual("sub") &&
                            <NativeSelect
                                label="Subregion"
                                data={[{ value: '', label: 'Pick One' }, ...getRoiOptions('sub')]}
                                {...form.getInputProps('roi.sub')}
                                onChange={(event) => {
                                    form.setFieldValue('roi.precision', '');
                                    form.getInputProps('roi.sub').onChange(event)
                                }}
                            />
                        }
                        {canAddNewRoiManual("sub") &&
                            <Autocomplete
                                label="Subregion"
                                data={[...getRoiOptions('sub')]}
                                placeholder="Select from the list or type a new value"
                                {...form.getInputProps('roi.sub')}
                                onChange={(event) => {
                                    form.setFieldValue('roi.precision', '');
                                    form.getInputProps('roi.sub').onChange(event)
                                }}
                            />
                        }
                        {getRoiOptions('precision').length > 0 && !canAddNewRoiManual("precision") &&
                            <NativeSelect
                                label="Precision"
                                data={[{ value: '', label: 'Pick One' }, ...getRoiOptions('precision')]}
                                {...form.getInputProps('roi.precision')}
                            />
                        }
                        {canAddNewRoiManual("precision") &&
                            <Autocomplete
                                label="Precision"
                                data={[...getRoiOptions('precision')]}
                                placeholder="Select from the list or type a new value"
                                {...form.getInputProps('roi.precision')}
                            />
                        }
                    </Tabs.Panel>
                    <Tabs.Panel value="parameters">
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
                        {getEffectOptions('characteristic').length > 0 && !canAddNewEffectManual('characteristic') &&
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
                        {canAddNewEffectManual('characteristic') &&
                            <Autocomplete
                                label="characteristic"
                                data={[...getEffectOptions('characteristic')]}
                                placeholder="Select from the list or type a new value"
                                {...form.getInputProps('effect.characteristic')}
                                onChange={(event) => {
                                    form.setFieldValue('effect.precision', '');
                                    form.getInputProps('effect.characteristic').onChange(event);
                                }}
                            />
                        }
                        {getEffectOptions('precision').length > 0 && !canAddNewEffectManual('precision') &&
                            <NativeSelect
                                label="precision"
                                data={[{ value: '', label: 'Pick One' }, ...getEffectOptions('precision')]}
                                {...form.getInputProps('effect.precision')}
                            />
                        }
                        {canAddNewEffectManual('precision') &&
                            <Autocomplete
                                label="precision"
                                data={[...getEffectOptions('precision')]}
                                placeholder="Select from the list or type a new value"
                                {...form.getInputProps('effect.precision')}
                            />
                        }
                        <Switch
                            label="Post discharge ?"
                            labelPosition="left"
                            {...form.getInputProps('effect.post_discharge', { type: 'checkbox' })}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel value="task">
                        <NativeSelect
                            label="Category"
                            data={[{ value: '', label: 'Pick One' }, ...getTaskOptions('category')]}
                            placeholder="Pick one"
                            {...form.getInputProps('task.category')}
                            onChange={(event) => {
                                form.setFieldValue('task.subcategory', '');
                                form.setFieldValue('task.characteristic', '');
                                form.setFieldValue('task.precision', '');
                                form.getInputProps('task.category').onChange(event);
                            }}
                        />
                        {getTaskOptions('subcategory').length > 0 &&
                            <NativeSelect
                                label="Subcategory"
                                data={[{ value: '', label: 'Pick One' }, ...getTaskOptions('subcategory')]}
                                {...form.getInputProps('task.subcategory')}
                                onChange={(event) => {
                                    form.setFieldValue('task.characteristic', '');
                                    form.setFieldValue('task.precision', '');
                                    form.getInputProps('task.subcategory').onChange(event);
                                }}
                            />
                        }
                        {getTaskOptions('characteristic').length > 0 && !canAddNewTaskManual('characteristic') &&
                            <NativeSelect
                                label="characteristic"
                                data={[{ value: '', label: 'Pick One' }, ...getTaskOptions('characteristic')]}
                                {...form.getInputProps('task.characteristic')}
                                onChange={(event) => {
                                    form.setFieldValue('task.precision', '');
                                    form.getInputProps('task.characteristic').onChange(event);
                                }}
                            />
                        }
                        {canAddNewTaskManual('characteristic') &&
                            <Autocomplete
                                label="characteristic"
                                data={[...getTaskOptions('characteristic')]}
                                placeholder="Select from the list or type a new value"
                                {...form.getInputProps('task.characteristic')}
                                onChange={(event) => {
                                    form.setFieldValue('task.precision', '');
                                    form.getInputProps('task.characteristic').onChange(event);
                                }}
                            />
                        }
                        {getTaskOptions('precision').length > 0 && !canAddNewTaskManual('precision') &&
                            <NativeSelect
                                label="precision"
                                data={[{ value: '', label: 'Pick One' }, ...getTaskOptions('precision')]}
                                {...form.getInputProps('task.precision')}
                            />
                        }
                        {canAddNewTaskManual('precision') &&
                            <Autocomplete
                                label="precision"
                                data={[...getTaskOptions('precision')]}
                                placeholder="Select from the list or type a new value"
                                {...form.getInputProps('task.precision')}
                            />
                        }
                    </Tabs.Panel>
                    <Tabs.Panel value="function">
                        <NativeSelect
                            label="Category"
                            data={[{ value: '', label: 'Pick One' }, ...getFunctionOptions('category')]}
                            placeholder="Pick one"
                            {...form.getInputProps('function.category')}
                            onChange={(event) => {
                                form.setFieldValue('function.subcategory', '');
                                form.setFieldValue('function.characteristic', '');
                                form.setFieldValue('function.precision', '');
                                form.getInputProps('function.category').onChange(event);
                            }}
                        />
                        {getFunctionOptions('subcategory').length > 0 &&
                            <NativeSelect
                                label="Subcategory"
                                data={[{ value: '', label: 'Pick One' }, ...getFunctionOptions('subcategory')]}
                                {...form.getInputProps('function.subcategory')}
                                onChange={(event) => {
                                    form.setFieldValue('function.characteristic', '');
                                    form.setFieldValue('function.precision', '');
                                    form.getInputProps('function.subcategory').onChange(event);
                                }}
                            />
                        }
                        {getFunctionOptions('characteristic').length > 0 && !canAddNewFunctionManual('characteristic') &&
                            <NativeSelect
                                label="characteristic"
                                data={[{ value: '', label: 'Pick One' }, ...getFunctionOptions('characteristic')]}
                                {...form.getInputProps('function.characteristic')}
                                onChange={(event) => {
                                    form.setFieldValue('function.precision', '');
                                    form.getInputProps('function.characteristic').onChange(event);
                                }}
                            />
                        }
                        {canAddNewFunctionManual('characteristic') &&
                            <Autocomplete
                                label="characteristic"
                                data={[...getFunctionOptions('characteristic')]}
                                placeholder="Select from the list or type a new value"
                                {...form.getInputProps('function.characteristic')}
                                onChange={(event) => {
                                    form.setFieldValue('function.precision', '');
                                    form.getInputProps('function.characteristic').onChange(event);
                                }}
                            />
                        }
                        {getFunctionOptions('precision').length > 0 && !canAddNewFunctionManual('precision') &&
                            <NativeSelect
                                label="precision"
                                data={[{ value: '', label: 'Pick One' }, ...getFunctionOptions('precision')]}
                                {...form.getInputProps('function.precision')}
                            />
                        }
                        {canAddNewFunctionManual('precision') &&
                            <Autocomplete
                                label="precision"
                                data={[...getFunctionOptions('precision')]}
                                placeholder="Select from the list or type a new value"
                                {...form.getInputProps('function.precision')}
                            />
                        }
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
    },
    task: {
        category: string,
        subcategory: string,
        characteristic: string,
        precision: string,
    },
    function: {
        category: string,
        subcategory: string,
        characteristic: string,
        precision: string,
    },
    occurrences: number,
    comments?: string
}

interface CreateEditResultFormProps {
    onSubmit: (values: CreateEditResultFormValues) => void;
    edit_result?: ResultDdo;
    rois: ROIDdo[];
    effects: EffectDdo[];
    tasks: TaskDdo[];
    functions: FunctionDdo[];
}
