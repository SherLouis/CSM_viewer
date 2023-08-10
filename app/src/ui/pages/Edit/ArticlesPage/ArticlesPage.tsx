import { Box, Button, Group, LoadingOverlay, Modal, NavLink, Space, Stack } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import ArticlesTable from "../../../components/ArticlesTable/ArticlesTable";
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { CreateArticleForm, CreateFormValues } from "../../../components/CreateArticleForm/CreateArticleForm";
import ArticleUIService from "../../../services/ArticleUIService";
import { useCallback, useEffect, useState } from "react";


export function ArticlesPage() {
  // [x]: get the actual articles from main using ui service and IPC, etc. 

  // Hooks
  const [articles, setArticles] = useState<ArticleSummaryDdo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.debug("using effect");
    setIsLoading(true);
    ArticleUIService.getAllArticlesSummary()
      .then((res) => {
        setArticles(res);
        setIsLoading(false)
      });
  }, []);

  const refreshArticles = useCallback(() => {
    setIsLoading(true);
    ArticleUIService.getAllArticlesSummary()
      .then((res) => {
        setArticles(res);
        setIsLoading(false)
      });
  }, [articles]);

  const createArticle = useCallback((article: ArticleDdo) => {
    setIsLoading(true);
    ArticleUIService.createArticle(article)
      .then((res) => {
        console.debug(res);
        if(res.successful) {console.log("Success")}
        else {console.log("Failed")}
        // TODO: display if success or not
        // TODO: get created article from response and add to articles
        setIsLoading(false)
      });
  }, [articles]);

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
    console.log(values);
    const article = {doi: values.reference.doi, title: values.reference.title, methodology: {stimulation_parameters: values.stimulation_params}} as ArticleDdo;
    createArticle(article);
  }

  return (
    <Box>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      <Stack>
        "TODO: Articles page. Breadcrumps, table with edit button for each entry, button to add article to table."

        <Group>
          <Button leftIcon={<IconPlus />} variant="filled" onClick={() => createHandlers.open()}>New</Button>
          <Button leftIcon={<IconRefresh />} variant="subtle" onClick={refreshArticles}>Refresh</Button>
        </Group>

        <ArticlesTable
          data={articles}
          onRowClick={(articleId) => viewArticle(articleId)}
          onEdit={(articleId) => editArticle(articleId)}
          onDelete={(articleId) => deleteArticle(articleId)}
        />
      </Stack>

      <Modal opened={createOpened} onClose={createHandlers.close} title="New Article" centered size="70%">
        <CreateArticleForm onSubmit={(values) => createNewArticle(values)} />
      </Modal>

    </Box>
  )
}
