import { MouseEvent, useEffect, useMemo, useState } from 'react';
import sortBy from 'lodash.sortby';
import { ActionIcon, Group, MultiSelect, Text, TextInput } from '@mantine/core';
import { IconEye, IconEdit, IconTrash, IconSearch } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { SourceSummaryDdo } from "../../models/SourceDdo";
import { useDebouncedState, useListState } from '@mantine/hooks';

const SourcesTable = (props: SourcesTableProps) => {
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

  // sorting & filtering
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'desc' });
  const [records, sourceRecordsHandlers] = useListState(props.data);
  const [titleQuery, setTitleQuery] = useDebouncedState('', 200);
  const [selectedStates, selectedStatesHandler] = useListState<string>([]);
  const states = useMemo(() => {
    const states = new Set(props.data.map((source) => source.state));
    return [...states];
  }, [props.data])

  useEffect(() => {
    var data = sortBy(props.data, sortStatus.columnAccessor) as SourceSummaryDdo[];
    data = data.filter((sourceSummary) => {
      if (titleQuery !== '' && !sourceSummary.title.toLowerCase().includes(titleQuery.trim().toLowerCase())) { return false; }
      if (selectedStates.length !== 0 && !selectedStates.some((s) => s === sourceSummary.state)) { return false; }
      return true;
    });
    sourceRecordsHandlers.setState(sortStatus.direction === 'desc' ? data.reverse() : data);
  }, [sortStatus, titleQuery, selectedStates, props.data])

  return (
    <DataTable
      withColumnBorders
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
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
          accessor: 'title',
          title: 'Title',
          sortable: true,
          filter: (
            <TextInput
              label="Title"
              description="Search for a title that includes specified text"
              placeholder='Search title...'
              icon={<IconSearch size={16} />}
              defaultValue={titleQuery}
              onChange={(e) => setTitleQuery(e.currentTarget.value)}
            />
          ),
          filtering: titleQuery != '',
        },
        {
          accessor: 'nb_results',
          title: "# results",
          sortable: true
        },
        {
          accessor: 'state',
          title: "Status",
          sortable: true,
          filter: (
            <MultiSelect
              label="Status "
              description="Show all with selected status"
              data={states}
              value={selectedStates}
              placeholder="Select state(s)"
              onChange={selectedStatesHandler.setState}
              icon={<IconSearch size={16} />}
              clearable
              searchable
            />
          ),
          filtering: selectedStates.length > 0,
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