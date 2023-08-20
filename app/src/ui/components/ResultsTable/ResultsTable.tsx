import { MouseEvent } from 'react';
import { ActionIcon, Group, Text } from '@mantine/core';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { ResultDdo } from '../../models/ResultDdo';

const ResultsTable = (props: ResultsTableProps) => {
    // [ ] add sorting and filtering
    // [ ] add pagination

    const handleView = (event: MouseEvent, result: ResultDdo) => {
        event.stopPropagation();
        props.onRowClick(result);
    }

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
            withBorder
            borderRadius="sm"
            withColumnBorders
            striped
            highlightOnHover
            idAccessor={"id"}
            records={props.data}
            groups={[
                {
                    id: "location",
                    columns: [
                        { accessor: "location.side", title: "Side" },
                        { accessor: "location.lobe", title: "Lobe"},
                        { accessor: "location.gyrus", title: "Gyrus" }
                    ]
                },
                {
                    id: "effect",
                    columns: [
                        { accessor: "effect.category", title: "Category" },
                        { accessor: "effect.semiology", title: "Semiology" },
                        { accessor: "effect.characteristic", title: "Characteristic" }
                    ]
                },
                {
                    id: "actions",
                    title: "",
                    columns: [
                        {
                            accessor: 'actions',
                            title: <Text mr="xs">Actions</Text>,
                            textAlignment: 'right',
                            width: "10%",
                            render: (result) => (
                                <Group spacing={4} position="right" noWrap>
                                    <ActionIcon color="green" onClick={(e: MouseEvent) => handleView(e, result)}>
                                        <IconEye size={16} />
                                    </ActionIcon>
                                    <ActionIcon color="blue" onClick={(e: MouseEvent) => handleEdit(e, result)}>
                                        <IconEdit size={16} />
                                    </ActionIcon>
                                    <ActionIcon color="red" onClick={(e: MouseEvent) => handleDelete(e, result.id)}>
                                        <IconTrash size={16} />
                                    </ActionIcon>
                                </Group>
                            ),
                        }]
                }
            ]}
            onRowClick={(result) => { props.onRowClick(result) }}
        />
    );
}

type ResultsTableProps = {
    data: ResultDdo[],
    onRowClick: (result: ResultDdo) => void,
    onEdit: (result: ResultDdo) => void,
    onDelete: (resultId: number) => void
}


export default ResultsTable;