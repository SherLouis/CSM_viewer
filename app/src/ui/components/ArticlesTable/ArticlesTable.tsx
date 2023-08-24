import { MouseEvent } from 'react';
import { ActionIcon, Group, Text } from '@mantine/core';
import { IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';

const ArticlesTable = (props: ArticlesTableProps) => {
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

  return (
    <DataTable
      withColumnBorders
      striped
      highlightOnHover
      idAccessor={"doi"}
      records={props.data}
      columns={[
        {
          accessor: 'doi',
          title: 'DOI'
        },
        { accessor: 'title' },
        {
          accessor: 'nb_results',
          title: "# results"
        },
        {
          accessor: 'actions',
          title: <Text mr="xs">Actions</Text>,
          textAlignment: 'right',
          width: "10%",
          render: (article) => (
            <Group spacing={4} position="right" noWrap>
              <ActionIcon color="green" onClick={(e: MouseEvent) => handleView(e, article.doi)}>
                <IconEye size={16} />
              </ActionIcon>
              <ActionIcon color="blue" onClick={(e: MouseEvent) => handleEdit(e, article.doi)}>
                <IconEdit size={16} />
              </ActionIcon>
              <ActionIcon color="red" onClick={(e: MouseEvent) => handleDelete(e, article.doi)}>
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          ),
        }
      ]}
      onRowClick={(article) => { props.onRowClick(article.doi) }}
    />
  );
}

type ArticlesTableProps = {
  data: ArticleSummaryDdo[],
  onRowClick: (articleId: string) => void,
  onEdit: (articleId: string) => void,
  onDelete: (articleId: string) => void
}


export default ArticlesTable;