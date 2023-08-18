import { MouseEvent } from 'react';
import { ActionIcon, Group, Text } from '@mantine/core';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { ResultDdo } from '../../models/ResultDdo';

const ResultsTable = (props: ResultsTableProps) => {
    // [ ] add sorting and filtering
    // [ ] add pagination

    const handleView = (event: MouseEvent, articleDoi: string) => {
        event.stopPropagation();
        props.onRowClick(articleDoi);
    }

    const handleEdit = (event: MouseEvent, articleDoi: string) => {
        event.stopPropagation();
        props.onEdit(articleDoi);
    }

    const handleDelete = (event: MouseEvent, articleDoi: string) => {
        event.stopPropagation();
        props.onDelete(articleDoi);
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
                        { accessor: "location.side" },
                        { accessor: "location.lobe" },
                        { accessor: "location.gyrus" }
                    ]
                },
                {
                    id: "effect",
                    columns: [
                        { accessor: "effect.category" },
                        { accessor: "effect.semiology" },
                        { accessor: "effect.characteristic" }
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
                                    <ActionIcon color="green" onClick={(e: MouseEvent) => handleView(e, result.id)}>
                                        <IconEye size={16} />
                                    </ActionIcon>
                                    <ActionIcon color="blue" onClick={(e: MouseEvent) => handleEdit(e, result.id)}>
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
            onRowClick={(result) => { props.onRowClick(result.id) }}
        />
    );
}

type ResultsTableProps = {
    data: ResultDdo[],
    onRowClick: (resultId: string) => void,
    onEdit: (resultId: string) => void,
    onDelete: (resultId: string) => void
}


export default ResultsTable;