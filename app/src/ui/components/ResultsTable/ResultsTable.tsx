import { MouseEvent, useState } from 'react';
import { ActionIcon, Group, Text } from '@mantine/core';
import { IconCopy, IconEdit, IconTrash } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { ResultDdo } from '../../models/ResultDdo';
import { CreateEditResultForm, CreateEditResultFormValues } from '../CreateEditResultForm/CreateEditResultForm';
import { ROIDdo } from '../../models/ROIDdo';

const ResultsTable = (props: ResultsTableProps) => {
    // [ ] add sorting and filtering
    // [ ] add pagination

    const handleEdit = (values: CreateEditResultFormValues, resultId: number) => {
        const result = {
            id: resultId,
            roi: {
                lobe: values.roi.lobe,
                gyrus: values.roi.gyrus,
                sub: values.roi.sub,
                precision: values.roi.precision
            },
            stimulation_parameters: {
                amplitude_ma: values.stimulation_parameters.amplitude_ma,
                frequency_hz: values.stimulation_parameters.frequency_hz,
                electrode_separation_mm: values.stimulation_parameters.electrode_separation_mm,
                duration_s: values.stimulation_parameters.duration_s
            },
            effect: {
                category: values.effect.category,
                semiology: values.effect.semiology,
                characteristic: values.effect.characteristic,
                precision: values.effect.precision,
                post_discharge: values.effect.post_discharge
            },
            occurrences: values.occurrences,
            comments: values.comments
        } as ResultDdo
        props.onEdit(result);
    }

    const handleDelete = (event: MouseEvent, resultId: number) => {
        event.stopPropagation();
        props.onDelete(resultId);
    }

    const handleDuplicate = (event: MouseEvent, result: ResultDdo, level: "roi" | "stim" | "effect" | "all") => {
        event.stopPropagation();
        // TODO: create a new with keeping only desired sections
        switch (level) {
            case "roi":
                console.debug(`Should duplicate result with id ${result.id} only keeping the ROI info`)
                break;
            case "stim":
                console.debug(`Should duplicate result with id ${result.id} only keeping the ROI and stim info`)
                break;
            case "effect":
                console.debug(`Should duplicate result with id ${result.id} only keeping the ROI, stim and effect info`)
                break;
            case "all":
                console.debug(`Should duplicate entire result`)
                break;
            default:
                console.warn('Invalid level of copy. Won\'t duplicate')
                break;
        }
    }

    console.debug(props.data);

    return (
        <DataTable
            withColumnBorders
            striped
            highlightOnHover
            idAccessor={(record) => String(record.id)}
            records={props.data}
            columns={[
                {
                    accessor: 'roi',
                    title: 'ROI',
                    render: (result) => (
                        <Group position='apart'>
                            <Text>
                                {result.roi.lobe +
                                    (result.roi.gyrus ? ('/' + result.roi.gyrus +
                                        (result.roi.sub ? ('/' + result.roi.sub +
                                            (result.roi.precision ? ('/' + result.roi.precision) : '')) : '')) : '')}
                            </Text>
                            <ActionIcon onClick={(e: MouseEvent) => handleDuplicate(e, result, 'roi')}>
                                <IconCopy size={16} />
                            </ActionIcon>
                        </Group>)
                },
                {
                    accessor: 'stimulation_parameters',
                    title: 'Stimulation',
                    render: (result) => (
                        <Group position='apart'>
                            <Text>
                                {(result.stimulation_parameters.amplitude_ma ? result.stimulation_parameters.amplitude_ma : '-') + ' mA '
                                    + '| ' + (result.stimulation_parameters.duration_s ? result.stimulation_parameters.duration_s : '-') + ' s '
                                    + '| ' + (result.stimulation_parameters.electrode_separation_mm ? result.stimulation_parameters.electrode_separation_mm : '-') + ' mm '
                                    + '| ' + (result.stimulation_parameters.frequency_hz ? result.stimulation_parameters.frequency_hz : '-') + ' Hz'}
                            </Text>
                            <ActionIcon onClick={(e: MouseEvent) => handleDuplicate(e, result, 'stim')}>
                                <IconCopy size={16} />
                            </ActionIcon>
                        </Group>)
                },
                {
                    accessor: 'effect',
                    title: 'Effect',
                    render: (result) => (
                        <Group position='apart'>
                            <Text>
                                {result.effect.category +
                                    (result.effect.semiology ? ('/' + result.effect.semiology
                                        + (result.effect.characteristic ? ('/' + result.effect.characteristic) : ''
                                            + result.effect.precision ? '/' + result.effect.precision : '')) : '')}
                            </Text>
                            <ActionIcon onClick={(e: MouseEvent) => handleDuplicate(e, result, 'effect')}>
                                <IconCopy size={16} />
                            </ActionIcon>
                        </Group>)
                },
                {
                    accessor: 'occurrences',
                    title: 'Occurrences',
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
                        onSubmit={(values) => handleEdit(values, record.id)} />
                ),
            }}

        />
    );
}

type ResultsTableProps = {
    data: ResultDdo[],
    rois: ROIDdo[],
    onEdit: (result: ResultDdo) => void,
    onDelete: (resultId: number) => void
}


export default ResultsTable;