import { Box, Button, Group, Modal, NavLink, Space, Stack } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import ArticlesTable from "../../../components/ArticlesTable/ArticlesTable";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { CreateArticleForm, CreateFormValues } from "../../../components/CreateArticleForm/CreateArticleForm";


export function ArticlesPage() {
  // TODO: get the actual articles from main using ui service and IPC, etc. 
  let articles: ArticleSummary[] = [
    { doi: "1234", title: "Test", nb_results: 1 },
    { doi: "5678", title: "Test", nb_results: 1 }
  ];

  // Hooks
  let navigate = useNavigate();
  const [createOpened, createHandlers] = useDisclosure(false);
  
  // Functions
  const viewArticle = (articleId: string) => {
    navigate(`/edit/sources/${articleId}`);
  }

  const editArticle = (articleId: string) => {
    // TODO
  }

  const deleteArticle = (articleId: string) => {
    // TODO
  }

  const createNewArticle = (values: CreateFormValues) => {
    // TODO
  }

  return (
    <Box>
      <Stack>
        "TODO: Articles page. Breadcrumps, table with edit button for each entry, button to add article to table."

        <Group>
          <Button leftIcon={<IconPlus />} variant="outline" onClick={() => createHandlers.open()}>New</Button>
        </Group>

        <ArticlesTable
          data={articles}
          onRowClick={(articleId) => viewArticle(articleId)}
          onEdit={(articleId) => editArticle(articleId)}
          onDelete={(articleId) => deleteArticle(articleId)}
        />
      </Stack>

      <Modal opened={createOpened} onClose={createHandlers.close} title="New Article" centered>
        <CreateArticleForm onSubmit={(values) => createNewArticle(values)}/>
      </Modal>

    </Box>
  )
}
