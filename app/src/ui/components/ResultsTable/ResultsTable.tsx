import { MouseEvent } from 'react';
import { ActionIcon, Group, Text } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { ResultDdo } from '../../models/ResultDdo';

const ResultsTable = (props: ResultsTableProps) => {
    // [ ] add sorting and filtering
    // [ ] add pagination

    const handleEdit = (event: MouseEvent, result: ResultDdo) => {
        event.stopPropagation();
        props.onEdit(result);
    }

    const handleDelete = (event: MouseEvent, resultId: number) => {
        event.stopPropagation();
        props.onDelete(resultId);
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
                    render: ({ roi }) => (roi.lobe +
                        (roi.gyrus ? ('/' + roi.gyrus +
                            (roi.sub ? ('/' + roi.sub +
                                (roi.precision ? ('/' + roi.precision) : '')) : '')) : ''))
                },
                {
                    accessor: 'stimulation_parameters',
                    title: 'Stimulation',
                    render: ({ stimulation_parameters }) => {
                        return (
                            (stimulation_parameters.amplitude_ma ? stimulation_parameters.amplitude_ma : '-') + ' mA '
                            + '| ' + (stimulation_parameters.duration_s ? stimulation_parameters.duration_s : '-') + ' s '
                            + '| ' + (stimulation_parameters.electrode_separation_mm ? stimulation_parameters.electrode_separation_mm : '-') + ' mm '
                            + '| ' + (stimulation_parameters.frequency_hz ? stimulation_parameters.frequency_hz : '-') + ' Hz')
                    }
                },
                {
                    accessor: 'effect',
                    title: 'Effect',
                    render: ({ effect }) => {
                        return (effect.category +
                            (effect.semiology ? ('/' + effect.semiology
                                + (effect.characteristic ? ('/' + effect.characteristic) : ''
                                    + effect.precision ? '/' + effect.precision : '')) : ''))
                    }
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
                            <ActionIcon color="blue" onClick={(e: MouseEvent) => handleEdit(e, result)}>
                                <IconEdit size={16} />
                            </ActionIcon>
                            <ActionIcon color="red" onClick={(e: MouseEvent) => handleDelete(e, result.id)}>
                                <IconTrash size={16} />
                            </ActionIcon>
                        </Group>
                    ),
                }
            ]}
        />
    );
}

type ResultsTableProps = {
    data: ResultDdo[],
    onEdit: (result: ResultDdo) => void,
    onDelete: (resultId: number) => void
}


export default ResultsTable;