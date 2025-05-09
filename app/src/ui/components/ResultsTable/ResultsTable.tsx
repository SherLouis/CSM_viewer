import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { ActionIcon, Box, Checkbox, Group, MultiSelect, Popover, Text, TextInput } from '@mantine/core';
import sortBy from 'lodash.sortby';
import { IconCopy, IconFilterOff, IconSearch, IconTableOptions, IconTrash, IconX } from '@tabler/icons-react';
import { DataTable, DataTableColumn, DataTableSortStatus, useDataTableColumns } from 'mantine-datatable';
import { ResultDdo } from '../../models/ResultDdo';
import { CreateEditResultForm, CreateEditResultFormValues } from '../CreateEditResultForm/CreateEditResultForm';
import { ROIDdo } from '../../models/ROIDdo';
import { EffectDdo } from '../../models/EffectDdo';
import { TaskDdo } from '../../models/TaskDdo';
import { FunctionDdo } from '../../models/FunctionDdo';
import { useDebouncedState, useListState } from '@mantine/hooks';
import { useAppState } from '../../context/AppContext';
import AppMode from '../../../core/models/AppMode';
import { DataTableColumnToggle } from 'mantine-datatable/dist/hooks';

const ResultsTable = (props: ResultsTableProps) => {

    const handleEdit = (values: CreateEditResultFormValues, resultId: number) => {
        const result = {
            id: resultId,
            roi: {
                side: values.roi.side,
                description: values.roi.description,
                mask: values.roi.mask,
                mask_conversion_method: values.roi.mask_conversion_method,
            },
            stimulation_parameters: {
                stated: values.stimulation_parameters.stated,
                amplitude_ma_min: values.stimulation_parameters.amplitude_ma_min,
                amplitude_ma_max: values.stimulation_parameters.amplitude_ma_max,
                amplitude_ma_avg: values.stimulation_parameters.amplitude_ma_avg,
                amplitude_variable: values.stimulation_parameters.amplitude_variable,
                frequency_hz: values.stimulation_parameters.frequency_hz,
                frequency_hz_max: values.stimulation_parameters.frequency_hz_max,
                frequency_multiple: values.stimulation_parameters.frequency_multiple,
                duration_s: values.stimulation_parameters.duration_s,
                duration_s_max: values.stimulation_parameters.duration_s_max,
                duration_variable: values.stimulation_parameters.duration_variable,
                duration_multiple: values.stimulation_parameters.duration_multiple,
                electrode_make: values.stimulation_parameters.electrode_make,
                implantation_type: values.stimulation_parameters.implantation_type,
                contact_separation: values.stimulation_parameters.contact_separation,
                contact_diameter: values.stimulation_parameters.contact_diameter,
                contact_length: values.stimulation_parameters.contact_length,
                phase_length: values.stimulation_parameters.phase_length,
                phase_length_multiple: values.stimulation_parameters.phase_length_multiple,
                phase_type: values.stimulation_parameters.phase_type,
                epi_zone: values.stimulation_parameters.epi_zone,
                epi_zone_comments: values.stimulation_parameters.epi_zone_comments,
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
                stated: values.function.stated,
                comments: values.function.comments
            },

            occurrence_clinical_effect: values.occurrence_clinical_effect,
            nb_stimulations: values.nb_stimulations,
            occurrence_ns: values.occurrence_ns,
            complement_parameters: values.complement_parameters,
            complement_parameters_result_id: values.complement_parameters_result_id,
            occurrence_responsive_rate: values.occurrence_responsive_rate,
            comments: values.comments,
            comments_2: values.comments_2,
            clinical_semiology: values.clinical_semiology,
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
            roi: { side: '', description: '', mask: '', mask_conversion_method: '' },
            stimulation_parameters: {
                stated: true,
                amplitude_ma_min: 0,
                amplitude_ma_max: 0,
                amplitude_ma_avg: 0,
                amplitude_variable: false,
                frequency_hz: 0,
                frequency_hz_max: 0,
                frequency_multiple: '',
                duration_s: 0,
                duration_s_max: 0,
                duration_variable: false,
                duration_multiple: '',
                implantation_type: '',
                contact_separation: 0,
                contact_diameter: 0,
                contact_length: 0,
                phase_length: 0,
                phase_length_multiple: '',
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
                stated: false,
                comments: '',
            },
            occurrence_clinical_effect: 0,
            nb_stimulations: 0,
            occurrence_ns: false,
            complement_parameters: false,
            complement_parameters_result_id: 0,
            occurrence_responsive_rate: false,
            comments: '',
            comments_2: '',
        } as ResultDdo;
        switch (level) {
            case "stim":
                newResult.stimulation_parameters = result.stimulation_parameters;
                props.onCreate(newResult);
                break;
            case "task":
                newResult.stimulation_parameters = result.stimulation_parameters;
                newResult.task = result.task;
                props.onCreate(newResult);
                break;
            case "function":
                newResult.stimulation_parameters = result.stimulation_parameters;
                newResult.task = result.task;
                newResult.function = result.function;
                props.onCreate(newResult);
                break;
            case "roi":
                newResult.stimulation_parameters = result.stimulation_parameters;
                newResult.task = result.task;
                newResult.function = result.function;
                newResult.roi = result.roi;
                props.onCreate(newResult);
                break;
            case "effect":
                newResult.stimulation_parameters = result.stimulation_parameters;
                newResult.task = result.task;
                newResult.function = result.function;
                newResult.roi = result.roi;
                newResult.effect = result.effect;
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

    const handleClearSectionValues = (event: MouseEvent, originalResult: ResultDdo, section: "parameters" | "roi" | "effect" | "task" | "function" | "details") => {
        event.stopPropagation();
        let newResult = originalResult;
        switch (section) {
            case "parameters":
                newResult = {
                    ...originalResult,
                    stimulation_parameters: {
                        stated: true,
                        amplitude_ma_min: 0,
                        amplitude_ma_max: 0,
                        amplitude_ma_avg: 0,
                        amplitude_variable: false,
                        frequency_hz: 0,
                        frequency_hz_max: 0,
                        frequency_multiple: '',
                        duration_s: 0,
                        duration_s_max: 0,
                        duration_variable: false,
                        duration_multiple: '',
                        implantation_type: '',
                        contact_separation: 0,
                        contact_diameter: 0,
                        contact_length: 0,
                        phase_length: 0,
                        phase_length_multiple: '',
                        phase_type: ''
                    }
                } as ResultDdo;
                break;
            case "roi":
                newResult = {
                    ...originalResult,
                    roi: { side: '', description: '', mask: '', mask_conversion_method: '' }
                } as ResultDdo;
                break;
            case "effect":
                newResult = {
                    ...originalResult,
                    effect: {
                        class: '',
                        descriptor: '',
                        details: '',
                        post_discharge: '',
                        lateralization: '',
                        dominant: '',
                        body_part: '',
                        comments: '',
                    }
                } as ResultDdo;
                break;
            case "task":
                newResult = {
                    ...originalResult,
                    task: {
                        category: '',
                        subcategory: '',
                        characteristic: '',
                        comments: '',
                    }
                } as ResultDdo;
                break;
            case "function":
                newResult = {
                    ...originalResult,
                    function: {
                        category: '',
                        subcategory: '',
                        characteristic: '',
                        stated: false,
                        comments: '',
                    }
                }
                break;
            case "details":
                newResult = {
                    ...originalResult,
                    occurrence_clinical_effect: 0,
                    comments: '',
                    comments_2: '',
                    nb_stimulations: 0
                }
                break;
        }
        props.onEdit(newResult);
    }

    // sorting & filtering
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });
    const [records, setRecords] = useState(props.data);
    const [roiQuery, setRoiQuery] = useDebouncedState('', 200);
    const [effectQuery, setEffectQuery] = useDebouncedState('', 200);
    const [taskQuery, setTaskQuery] = useDebouncedState('', 200);
    const [functionQuery, setFunctionQuery] = useDebouncedState('', 200);
    const [sourceDbFilter, setSourceDbFilterHandlers] = useListState<string>([]);

    // For table row expansion
    const [expandedRecordIds, setExpandedRecordIds] = useState<string[]>([]);
    const [selectedTabForEdit, setSelectedTabForEdit] = useState<"parameters" | "roi" | "effect" | "task" | "function" | "details">("parameters");

    const appMode = useAppState().mode;

    const tableColumns = [
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
                        {
                            result.stimulation_parameters.stated ?
                                (result.stimulation_parameters.amplitude_ma_avg ? result.stimulation_parameters.amplitude_ma_avg : '-') +
                                ' (' + (result.stimulation_parameters.amplitude_ma_min ? result.stimulation_parameters.amplitude_ma_min : '-') + '-' +
                                (result.stimulation_parameters.amplitude_ma_max ? result.stimulation_parameters.amplitude_ma_max : '-') + ') mA ' + '| ' +
                                (result.stimulation_parameters.frequency_hz ? result.stimulation_parameters.frequency_hz : '-') + ' Hz' + '| ' +
                                (result.stimulation_parameters.duration_s ? result.stimulation_parameters.duration_s : '-') + ' s ' + '| ' +
                                (result.stimulation_parameters.contact_length ? result.stimulation_parameters.contact_length : '-') + ' mm '
                                : "Not stated"
                        }
                    </Text>
                    <Group spacing={0}>
                        <ActionIcon onClick={(e: MouseEvent) => handleDuplicate(e, result, 'stim')}>
                            <IconCopy size={16} />
                        </ActionIcon>
                        <ActionIcon onClick={(e: MouseEvent) => handleClearSectionValues(e, result, 'parameters')}>
                            <IconX size={16} />
                        </ActionIcon>
                    </Group>
                </Group>)
        },
        {
            accessor: 'task',
            title: 'Task',
            render: (result) => (
                <Group position='apart'>
                    <Text>
                        {result.task.category + '/' + result.task.subcategory + '/' + result.task.characteristic}
                    </Text>
                    <Group spacing={0}>
                        <ActionIcon onClick={(e: MouseEvent) => handleDuplicate(e, result, 'task')}>
                            <IconCopy size={16} />
                        </ActionIcon>
                        <ActionIcon onClick={(e: MouseEvent) => handleClearSectionValues(e, result, 'task')}>
                            <IconX size={16} />
                        </ActionIcon>
                    </Group>
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
                        {result.function.category + '/' + result.function.subcategory + '/' + result.function.characteristic}
                    </Text>
                    <Group spacing={0}>
                        <ActionIcon onClick={(e: MouseEvent) => handleDuplicate(e, result, 'function')}>
                            <IconCopy size={16} />
                        </ActionIcon>
                        <ActionIcon onClick={(e: MouseEvent) => handleClearSectionValues(e, result, 'function')}>
                            <IconX size={16} />
                        </ActionIcon>
                    </Group>
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
            accessor: 'roi',
            title: 'ROI',
            render: (result) => (
                <Group position='apart'>
                    <Text>
                        {result.roi.description + '|' + result.roi.mask + '|' + result.roi.mask_conversion_method}
                    </Text>
                    <Group spacing={0}>
                        <ActionIcon onClick={(e: MouseEvent) => handleDuplicate(e, result, 'roi')}>
                            <IconCopy size={16} />
                        </ActionIcon>
                        <ActionIcon onClick={(e: MouseEvent) => handleClearSectionValues(e, result, 'roi')}>
                            <IconX size={16} />
                        </ActionIcon>
                    </Group>
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
                        {result.effect.class + '/' + result.effect.descriptor + '/' + result.effect.details}
                    </Text>
                    <Group spacing={0}>
                        <ActionIcon onClick={(e: MouseEvent) => handleDuplicate(e, result, 'effect')}>
                            <IconCopy size={16} />
                        </ActionIcon>
                        <ActionIcon onClick={(e: MouseEvent) => handleClearSectionValues(e, result, 'effect')}>
                            <IconX size={16} />
                        </ActionIcon>
                    </Group>
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
            accessor: 'occurrence_clinical_effect',
            title: 'Occurrences',
            sortable: true,
            render: (result) => (
                <Group position='apart'>
                    <Text>
                        {result.occurrence_clinical_effect}
                    </Text>
                    <ActionIcon onClick={(e: MouseEvent) => handleClearSectionValues(e, result, 'details')}>
                        <IconX size={16} />
                    </ActionIcon>
                </Group>)
        },
        {
            accessor: 'source_db',
            title: "Source DB",
            sortable: true,
            filter: (
                <MultiSelect
                    data={Array.from(new Set(props.data.flatMap((r) => r.source_db)))}
                    placeholder='Select Source DB(s) to include'
                    value={sourceDbFilter}
                    label="Source DB"
                    onChange={(newValues) => setSourceDbFilterHandlers.setState(newValues)}
                />
            ),
            filtering: sourceDbFilter.length !== 0,
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
    ] as DataTableColumn<ResultDdo>[];

    const columnsLocalStorageKey = 'result_table_columns';
    const { effectiveColumns, columnsToggle, setColumnsToggle } = useDataTableColumns<ResultDdo>({
        key: columnsLocalStorageKey,
        columns: tableColumns
    });

    useEffect(() => {
        var data = sortBy(props.data, sortStatus.columnAccessor) as ResultDdo[];
        data = data.filter((result) => {
            const roiValue = result.roi.description + (result.roi.mask ? ('|' + result.roi.mask + (result.roi.mask_conversion_method ? ('|' + result.roi.mask_conversion_method) : '')) : '');
            const effectValue = result.effect.class + (result.effect.descriptor ? ('/' + result.effect.descriptor + (result.effect.details ? ('/' + result.effect.details + (result.effect.body_part ? ('/' + result.effect.body_part) : '')) : '')) : '');
            const taskValue = result.task.category + (result.task.subcategory ? ('/' + result.task.subcategory + (result.task.characteristic ? ('/' + result.task.characteristic) : '')) : '');
            const functionValue = result.function.category + (result.function.subcategory ? ('/' + result.function.subcategory + (result.function.characteristic ? ('/' + result.function.characteristic) : '')) : '');

            if (roiQuery !== '' && !roiValue.toLowerCase().includes(roiQuery.trim().toLowerCase())) { return false; }
            if (effectQuery !== '' && !effectValue.toLowerCase().includes(effectQuery.trim().toLowerCase())) { return false; }
            if (taskQuery !== '' && !taskValue.toLowerCase().includes(taskQuery.trim().toLowerCase())) { return false; }
            if (functionQuery !== '' && !functionValue.toLowerCase().includes(functionQuery.trim().toLowerCase())) { return false; }
            if (sourceDbFilter.length !== 0 && !sourceDbFilter.includes(result.source_db)) { return false; }
            return true;
        });
        setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    }, [sortStatus, roiQuery, effectQuery, taskQuery, functionQuery, props.data, sourceDbFilter])

    useEffect(() => {
        setColumnsToggle((prevToggleState) => prevToggleState.map(toggle => toggle.accessor === 'source_db' ? { ...toggle, toggled: appMode === AppMode.MERGE } : toggle));
    }, [appMode]);

    const clearAllFilters = () => {
        setRoiQuery('');
        setEffectQuery('');
        setEffectQuery('');
        setTaskQuery('');
        setFunctionQuery('');
        setSourceDbFilterHandlers.setState([]);
    }

    // Editing
    const [initialEditRecord, setInitialEditRecord] = useState<ResultDdo | undefined>();
    const handleEditFormValueChanged = (index: number, newValue: CreateEditResultFormValues) => {
        setRecords(prevRecords => [
            ...prevRecords.slice(0, index),
            { ...prevRecords[index], ...newValue },
            ...prevRecords.slice(index + 1),
        ]);
    };
    const handleCancelEdit = (index: number) => {
        setRecords(prevRecords => [
            ...prevRecords.slice(0, index),
            { ...prevRecords[index], ...initialEditRecord },
            ...prevRecords.slice(index + 1),
        ]);
        setInitialEditRecord(undefined);
    };


    return (
        <Box h={"100%"}>
            {/** Table buttons: clear filters & select columns */}
            <Group position='apart' h={"4%"} pr={15}>
                <Text>{"Total records displayed: " + records.length}</Text>
                <Group position='right' h={"100%"} p={0} m={0}>
                    <ActionIcon title={'Clear all filters'}>
                        <IconFilterOff onClick={clearAllFilters} />
                    </ActionIcon>
                    <Popover position='bottom-end'>
                        <Popover.Target>
                            <ActionIcon title={'Select columns'}>
                                <IconTableOptions />
                            </ActionIcon>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <Checkbox.Group
                                value={columnsToggle.filter((col) => col.toggled).map(col => col.accessor)}
                                onChange={(checkedValues) => { setColumnsToggle((prevToggleState) => prevToggleState.map(toggle => { return { ...toggle, toggled: checkedValues.includes(toggle.accessor) } as DataTableColumnToggle })) }}
                                label={'Select columns'}
                            >
                                {columnsToggle.map(c =>
                                    <Checkbox
                                        value={c.accessor}
                                        key={c.accessor}
                                        label={effectiveColumns.filter(ec => ec.accessor === c.accessor).length > 0 ? effectiveColumns.filter(ec => ec.accessor === c.accessor)[0].title : ''} />
                                )}
                            </Checkbox.Group>
                        </Popover.Dropdown>
                    </Popover>
                </Group>
            </Group>

            <DataTable
                height={'96%'}
                scrollAreaProps={{ type: 'auto', scrollbarSize: 15, offsetScrollbars: true }}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                withColumnBorders
                striped
                highlightOnHover
                idAccessor={(record) => String(record.id)}
                records={records}
                columns={effectiveColumns}
                onCellClick={({ event, record, recordIndex, column, columnIndex }) => {
                    event.stopPropagation();
                    setExpandedRecordIds([String(record.id)]);
                    switch (column.accessor) {
                        case 'stimulation_parameters':
                            setSelectedTabForEdit("parameters");
                            break;
                        case 'roi':
                            setSelectedTabForEdit("roi");
                            break;
                        case 'effect':
                            setSelectedTabForEdit("effect");
                            break;
                        case 'task':
                            setSelectedTabForEdit("task");
                            break;
                        case 'function':
                            setSelectedTabForEdit("function");
                            break;
                        case 'occurrence_clinical_effect':
                            setSelectedTabForEdit("details");
                            break;
                        default:
                            setSelectedTabForEdit("parameters");
                    }
                }}
                rowExpansion={{
                    allowMultiple: false,
                    trigger: 'never',
                    expanded: {
                        recordIds: expandedRecordIds,
                        onRecordIdsChange: setExpandedRecordIds,
                    },
                    content: ({ record, recordIndex, collapse }) => (
                        <CreateEditResultForm
                            edit_result={record}
                            rois={props.rois}
                            effects={props.effects}
                            tasks={props.tasks}
                            functions={props.functions}
                            body_parts={props.bodyParts}
                            onSubmit={(values) => handleEdit(values, record.id)}
                            onCancel={() => { handleCancelEdit(recordIndex); collapse(); }}
                            selected_tab={selectedTabForEdit}
                            onFormValueChanged={(values) => handleEditFormValueChanged(recordIndex, values)}
                        />
                    ),
                }}

            />
        </Box>
    );
}

type ResultsTableProps = {
    data: ResultDdo[],
    rois: ROIDdo[],
    effects: EffectDdo[];
    tasks: TaskDdo[];
    functions: FunctionDdo[];
    bodyParts: string[];
    onEdit: (result: ResultDdo) => void,
    onCreate: (result: ResultDdo) => void,
    onDelete: (resultId: number) => void
}

export default ResultsTable;
