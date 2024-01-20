import { MouseEvent, useEffect, useState } from 'react';
import { ActionIcon, Group, Text, TextInput } from '@mantine/core';
import sortBy from 'lodash.sortby';
import { IconCopy, IconSearch, IconTrash } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { ResultDdo } from '../../models/ResultDdo';
import { CreateEditResultForm, CreateEditResultFormValues } from '../CreateEditResultForm/CreateEditResultForm';
import { ROIDdo } from '../../models/ROIDdo';
import { EffectDdo } from '../../models/EffectDdo';
import { TaskDdo } from '../../models/TaskDdo';
import { FunctionDdo } from '../../models/FunctionDdo';
import { useDebouncedState } from '@mantine/hooks';

const ResultsTable = (props: ResultsTableProps) => {
    // [ ] add pagination

    const handleEdit = (values: CreateEditResultFormValues, resultId: number) => {
        const result = {
            id: resultId,
            roi: {
                side: values.roi.side,
                lobe: values.roi.lobe,
                region: values.roi.region,
                area: values.roi.area,
                from_figure: values.roi.from_figure,
                mni_x: values.roi.mni_x,
                mni_y: values.roi.mni_y,
                mni_z: values.roi.mni_z,
                mni_average: values.roi.mni_average,
            },
            stimulation_parameters: {
                amplitude_ma: values.stimulation_parameters.amplitude_ma,
                amplitude_ma_max: values.stimulation_parameters.amplitude_ma_max,
                frequency_hz: values.stimulation_parameters.frequency_hz,
                frequency_hz_max: values.stimulation_parameters.frequency_hz_max,
                duration_s: values.stimulation_parameters.duration_s,
                duration_s_max: values.stimulation_parameters.duration_s_max,
                electrode_make: values.stimulation_parameters.electrode_make,
                implentation_type: values.stimulation_parameters.implentation_type,
                contact_separation: values.stimulation_parameters.contact_separation,
                contact_diameter: values.stimulation_parameters.contact_diameter,
                contact_length: values.stimulation_parameters.contact_length,
                phase_length: values.stimulation_parameters.phase_length,
                phase_type: values.stimulation_parameters.phase_type
            },
            effect: {
                class: values.effect.class,
                descriptor: values.effect.descriptor,
                details: values.effect.details,
                post_discharge: values.effect.post_discharge,
                lateralization: values.effect.lateralization,
                dominant: values.effect.dominant,
                body_part: values.effect.body_part,
                comments: values.effect.comments
            },
            task: {
                category: values.task.category,
                subcategory: values.task.subcategory,
                characteristic: values.task.characteristic,
                comments: values.task.comments
            },
            function: {
                category: values.function.category,
                subcategory: values.function.subcategory,
                characteristic: values.function.characteristic,
                article_designed_for_function: values.function.article_designed_for_function,
                comments: values.function.comments
            },
            occurrences: values.occurrences,
            comments: values.comments,
            comments_2: values.comments_2,
            precision_score: values.precision_score
        } as ResultDdo
        props.onEdit(result);
    }

    const handleDelete = (event: MouseEvent, resultId: number) => {
        event.stopPropagation();
        props.onDelete(resultId);
    }

    const handleDuplicate = (event: MouseEvent, result: ResultDdo, level: "stim" | "roi" | "effect" | "task" | "function" | "all") => {
        event.stopPropagation();
        let newResult = {
            id: undefined,
            roi: { side: '', lobe: '', region: '', area: '', mni_x: 0, mni_y: 0, mni_z: 0, mni_average: false },
            stimulation_parameters: {
                amplitude_ma: 0,
                amplitude_ma_max: 0,
                frequency_hz: 0,
                frequency_hz_max: 0,
                duration_s: 0,
                duration_s_max: 0,
                implentation_type: '',
                contact_separation: 0,
                contact_diameter: 0,
                contact_length: 0,
                phase_length: 0,
                phase_type: ''
            },
            effect: {
                class: '',
                descriptor: '',
                details: '',
                post_discharge: '',
                lateralization: '',
                dominant: '',
                body_part: '',
                comments: '',
            },
            task: {
                category: '',
                subcategory: '',
                characteristic: '',
                comments: '',
            },
            function: {
                category: '',
                subcategory: '',
                characteristic: '',
                article_designed_for_function: false,
                comments: '',
            },
            occurrences: 0,
            comments: '',
            comments_2: '',
            precision_score: 0
        } as ResultDdo;
        switch (level) {
            case "stim":
                newResult.stimulation_parameters = result.stimulation_parameters;
                props.onCreate(newResult);
                break;
            case "roi":
                newResult.stimulation_parameters = result.stimulation_parameters;
                newResult.roi = result.roi;
                props.onCreate(newResult);
                break;
            case "effect":
                newResult.stimulation_parameters = result.stimulation_parameters;
                newResult.roi = result.roi;
                newResult.effect = result.effect;
                props.onCreate(newResult);
                break;
            case "task":
                newResult.stimulation_parameters = result.stimulation_parameters;
                newResult.roi = result.roi;
                newResult.effect = result.effect;
                newResult.task = result.task;
                props.onCreate(newResult);
                break;
            case "function":
                newResult.stimulation_parameters = result.stimulation_parameters;
                newResult.roi = result.roi;
                newResult.effect = result.effect;
                newResult.task = result.task;
                newResult.function = result.function;
                props.onCreate(newResult);
                break;
            case "all":
                props.onCreate({ id: undefined, ...result } as ResultDdo);
                break;
            default:
                console.warn('Invalid level of copy. Won\'t duplicate')
                break;
        }
    }

    // sorting & filtering
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });
    const [records, setRecords] = useState(sortBy(props.data, 'id'));
    const [roiQuery, setRoiQuery] = useDebouncedState('', 200);
    const [effectQuery, setEffectQuery] = useDebouncedState('', 200);
    const [taskQuery, setTaskQuery] = useDebouncedState('', 200);
    const [functionQuery, setFunctionQuery] = useDebouncedState('', 200);

    useEffect(() => {
        var data = sortBy(props.data, sortStatus.columnAccessor) as ResultDdo[];
        data = data.filter((result) => {
            const roiValue = result.roi.lobe + (result.roi.region ? ('/' + result.roi.region + (result.roi.area ? ('/' + result.roi.area) : '')) : '');
            const effectValue = result.effect.class + (result.effect.descriptor ? ('/' + result.effect.descriptor + (result.effect.details ? ('/' + result.effect.details + (result.effect.body_part ? ('/' + result.effect.body_part) : '')) : '')) : '');
            const taskValue = result.task.category + (result.task.subcategory ? ('/' + result.task.subcategory + (result.task.characteristic ? ('/' + result.task.characteristic) : '')) : '');
            const functionValue = result.function.category + (result.function.subcategory ? ('/' + result.function.subcategory + (result.function.characteristic ? ('/' + result.function.characteristic) : '')) : '');

            if (roiQuery !== '' && !roiValue.toLowerCase().includes(roiQuery.trim().toLowerCase())) { return false; }
            if (effectQuery !== '' && !effectValue.toLowerCase().includes(effectQuery.trim().toLowerCase())) { return false; }
            if (taskQuery !== '' && !taskValue.toLowerCase().includes(taskQuery.trim().toLowerCase())) { return false; }
            if (functionQuery !== '' && !functionValue.toLowerCase().includes(functionQuery.trim().toLowerCase())) { return false; }
            return true;
        });
        setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    }, [sortStatus, roiQuery, effectQuery, taskQuery, functionQuery, props.data])

    return (
        <DataTable
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            withColumnBorders
            striped
            highlightOnHover
            idAccessor={(record) => String(record.id)}
            records={records}
            columns={[
                {
                    accessor: 'id',
                    title: 'ID',
                    sortable: true
                },
                {
                    accessor: 'stimulation_parameters',
                    title: 'Parameters',
                    render: (result) => (
                        <Group position='apart'>
                            <Text>
                                {(result.stimulation_parameters.amplitude_ma ? result.stimulation_parameters.amplitude_ma : '-') + ' mA '
                                    + '| ' + (result.stimulation_parameters.duration_s ? result.stimulation_parameters.duration_s : '-') + ' s '
                                    + '| ' + (result.stimulation_parameters.contact_separation ? result.stimulation_parameters.contact_separation : '-') + ' mm '
                                    + '| ' + (result.stimulation_parameters.frequency_hz ? result.stimulation_parameters.frequency_hz : '-') + ' Hz'}
                            </Text>
                            <ActionIcon onClick={(e: MouseEvent) => handleDuplicate(e, result, 'stim')}>
                                <IconCopy size={16} />
                            </ActionIcon>
                        </Group>)
                },
                {
                    accessor: 'roi',
                    title: 'ROI',
                    render: (result) => (
                        <Group position='apart'>
                            <Text>
                                {result.roi.lobe +
                                    (result.roi.region ? ('/' + result.roi.region +
                                        (result.roi.area ? ('/' + result.roi.area) : '')) : '')}
                            </Text>
                            <ActionIcon onClick={(e: MouseEvent) => handleDuplicate(e, result, 'roi')}>
                                <IconCopy size={16} />
                            </ActionIcon>
                        </Group>),
                    filter: (
                        <TextInput
                            label="ROI"
                            description="Search for a ROI that includes specified text"
                            placeholder='Search ROI...'
                            icon={<IconSearch size={16} />}
                            defaultValue={roiQuery}
                            onChange={(e) => setRoiQuery(e.currentTarget.value)}
                        />
                    ),
                    filtering: roiQuery != '',
                },
                {
                    accessor: 'effect',
                    title: 'Effect',
                    render: (result) => (
                        <Group position='apart'>
                            <Text>
                                {result.effect.class +
                                    (result.effect.descriptor ? ('/' + result.effect.descriptor
                                        + (result.effect.details ? ('/' + result.effect.details + (
                                            result.effect.body_part ? ('/' + result.effect.body_part) : '')) : '')) : '')}
                            </Text>
                            <ActionIcon onClick={(e: MouseEvent) => handleDuplicate(e, result, 'effect')}>
                                <IconCopy size={16} />
                            </ActionIcon>
                        </Group>),
                    filter: (
                        <TextInput
                            label="Effect"
                            description="Search for an Effect that includes specified text"
                            placeholder='Search Effect...'
                            icon={<IconSearch size={16} />}
                            defaultValue={effectQuery}
                            onChange={(e) => setEffectQuery(e.currentTarget.value)}
                        />
                    ),
                    filtering: effectQuery != '',
                },
                {
                    accessor: 'task',
                    title: 'Task',
                    render: (result) => (
                        <Group position='apart'>
                            <Text>
                                {result.task.category +
                                    (result.task.subcategory ? ('/' + result.task.subcategory
                                        + (result.task.characteristic ? ('/' + result.task.characteristic) : '')) : '')}
                            </Text>
                            <ActionIcon onClick={(e: MouseEvent) => handleDuplicate(e, result, 'task')}>
                                <IconCopy size={16} />
                            </ActionIcon>
                        </Group>),
                    filter: (
                        <TextInput
                            label="Task"
                            description="Search for a Task that includes specified text"
                            placeholder='Search Task...'
                            icon={<IconSearch size={16} />}
                            defaultValue={taskQuery}
                            onChange={(e) => setTaskQuery(e.currentTarget.value)}
                        />
                    ),
                    filtering: taskQuery != '',
                },
                {
                    accessor: 'function',
                    title: 'Function',
                    render: (result) => (
                        <Group position='apart'>
                            <Text>
                                {result.function.category +
                                    (result.function.subcategory ? ('/' + result.function.subcategory
                                        + (result.function.characteristic ? ('/' + result.function.characteristic) : '')) : '')}
                            </Text>
                            <ActionIcon onClick={(e: MouseEvent) => handleDuplicate(e, result, 'function')}>
                                <IconCopy size={16} />
                            </ActionIcon>
                        </Group>),
                    filter: (
                        <TextInput
                            label="Function"
                            description="Search for a Function that includes specified text"
                            placeholder='Search Function...'
                            icon={<IconSearch size={16} />}
                            defaultValue={functionQuery}
                            onChange={(e) => setFunctionQuery(e.currentTarget.value)}
                        />
                    ),
                    filtering: functionQuery != '',
                },
                {
                    accessor: 'occurrences',
                    title: 'Occurrences',
                    sortable: true
                },
                {
                    accessor: 'actions',
                    title: <Text mr="xs">Actions</Text>,
                    textAlignment: 'right',
                    width: "10%",
                    render: (result) => (
                        <Group spacing={4} position="right" noWrap>
                            <ActionIcon onClick={(e: MouseEvent) => handleDuplicate(e, result, 'all')}>
                                <IconCopy size={16} />
                            </ActionIcon>
                            <ActionIcon color="red" onClick={(e: MouseEvent) => handleDelete(e, result.id)}>
                                <IconTrash size={16} />
                            </ActionIcon>
                        </Group>
                    ),
                }
            ]}
            rowExpansion={{
                allowMultiple: false,
                content: ({ record }) => (
                    <CreateEditResultForm
                        edit_result={record}
                        rois={props.rois}
                        effects={props.effects}
                        tasks={props.tasks}
                        functions={props.functions}
                        onSubmit={(values) => handleEdit(values, record.id)}
                    />
                ),
            }}

        />
    );
}

type ResultsTableProps = {
    data: ResultDdo[],
    rois: ROIDdo[],
    effects: EffectDdo[];
    tasks: TaskDdo[];
    functions: FunctionDdo[];
    onEdit: (result: ResultDdo) => void,
    onCreate: (result: ResultDdo) => void,
    onDelete: (resultId: number) => void
}


export default ResultsTable;
