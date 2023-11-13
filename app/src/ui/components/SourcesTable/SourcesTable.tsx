import { MouseEvent, useEffect, useState } from 'react';
import sortBy from 'lodash.sortby';
import { ActionIcon, Group, Text } from '@mantine/core';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { SourceSummaryDdo } from "../../models/SourceDdo";
import { useListState } from '@mantine/hooks';

const SourcesTable = (props: SourcesTableProps) => {
  // [ ] add filtering
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

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });
  const [sourceRecords, sourceRecordsHandlers] = useListState(props.data);

  useEffect(() => {
    const data = sortBy(props.data, sortStatus.columnAccessor) as SourceSummaryDdo[];
    sourceRecordsHandlers.setState(sortStatus.direction === 'desc' ? data.reverse() : data);
  }, [sortStatus, props.data])

  return (
    <DataTable
      withColumnBorders
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      striped
      highlightOnHover
      idAccessor={(record) => String(record.id)}
      records={sourceRecords}
      columns={[
        {
          accessor: 'id',
          title: 'ID',
          sortable: true
        },
        {
          accessor: 'title',
          title: 'Title',
          sortable: true
        },
        {
          accessor: 'nb_results',
          title: "# results",
          sortable: true
        },
        {
          accessor: 'state',
          title: "Status",
          sortable: true
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