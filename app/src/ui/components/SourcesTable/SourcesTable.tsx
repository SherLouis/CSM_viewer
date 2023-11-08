import { MouseEvent } from 'react';
import { ActionIcon, Group, Text } from '@mantine/core';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { SourceDdo, SourceSummaryDdo } from "../../models/SourceDdo";

const SourcesTable = (props: SourcesTableProps) => {
  // [ ] add sorting and filtering
  // [ ] add pagination

  const handleView = (event: MouseEvent, sourceId: number) => {
    event.stopPropagation();
    props.onRowClick(sourceId);
  }

  const handleEdit = (event: MouseEvent, sourceId: number) => {
    event.stopPropagation();
    props.onEdit(sourceId);
  }

  const handleDelete = (event: MouseEvent, sourceId: number) => {
    event.stopPropagation();
    props.onDelete(sourceId);
  }

  return (
    <DataTable
      withColumnBorders
      striped
      highlightOnHover
      idAccessor={"id"}
      records={props.data}
      columns={[
        {
          accessor: 'id',
          title: 'ID'
        },
        { accessor: 'title' },
        {
          accessor: 'nb_results',
          title: "# results"
        },
        {
          accessor: 'state',
          title: "Status"
        },
        {
          accessor: 'actions',
          title: <Text mr="xs">Actions</Text>,
          textAlignment: 'right',
          width: "10%",
          render: (source) => (
            <Group spacing={4} position="right" noWrap>
              <ActionIcon color="green" onClick={(e: MouseEvent) => handleView(e, source.id)}>
                <IconEye size={16} />
              </ActionIcon>
              <ActionIcon color="blue" onClick={(e: MouseEvent) => handleEdit(e, source.id)}>
                <IconEdit size={16} />
              </ActionIcon>
              <ActionIcon color="red" onClick={(e: MouseEvent) => handleDelete(e, source.id)}>
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          ),
        }
      ]}
      onRowClick={(source) => { props.onRowClick(source.id) }}
    />
  );
}

type SourcesTableProps = {
  data: SourceSummaryDdo[],
  onRowClick: (sourceId: number) => void,
  onEdit: (sourceId: number) => void,
  onDelete: (sourceId: number) => void
}


export default SourcesTable;