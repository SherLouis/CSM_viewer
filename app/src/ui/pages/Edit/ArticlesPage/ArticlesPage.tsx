import { Box, Button, Group, LoadingOverlay, Modal, Stack } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import ArticlesTable from "../../../components/ArticlesTable/ArticlesTable";
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { CreateEditArticleForm, CreateFormValues } from "../../../components/CreateEditArticleForm/CreateEditArticleForm";
import ArticleUIService from "../../../services/ArticleUIService";
import { useCallback, useEffect, useState } from "react";
import { CreateResponseDto, EditResponseDto } from "../../../../IPC/dtos/CreateEditResponseDto";
import { ArticleDtoFromDdo } from "../../../../IPC/dtos/ArticleDto";


export function ArticlesPage() {
  // Hooks
  const [articles, setArticles] = useState<ArticleSummaryDdo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<ArticleDdo | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const navigate = useNavigate();
  const [createEditOpened, createEditModalHandlers] = useDisclosure(false);

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
      .then((res: CreateResponseDto) => {
        console.debug(res);
        if (res.successful) {
          setArticles([...articles, { doi: article.doi, title: article.title, nb_results: 0 } as ArticleSummaryDdo])
        }
        console.log(res.message)
        // TODO: display if success or not in notistack
        setIsLoading(false)
      });
  }, [articles]);

  const editArticle = useCallback((values: CreateFormValues) => {
    setIsLoading(true);
    const article = { doi: values.reference.doi, title: values.reference.title, methodology: { stimulation_parameters: values.stimulation_params } } as ArticleDdo;
    ArticleUIService.editArticle(currentArticle.doi, ArticleDtoFromDdo(article))
      .then((res: EditResponseDto) => {
        createEditModalHandlers.close();
        if (res.successful) {
          setArticles(articles.map(a => {
            if (a.doi === currentArticle.doi) {
              return { doi: article.doi, title: article.title, nb_results: a.nb_results };
            }
            else {
              return a;
            }
          }));
        }
        console.log(res.message);
        setIsLoading(false);
      });
  }, [currentArticle])

  const getCurrentArticle = useCallback((articleId: string) => {
    ArticleUIService.getArticle(articleId)
      .then((res: ArticleDdo) => setCurrentArticle(res));
  }, [currentArticle]);

  const deleteArticle = useCallback((articleId: string) => {
    setIsLoading(true);
    ArticleUIService.deleteArticle(articleId)
      .then((res: EditResponseDto) => {
        console.debug(res);
        if (res.successful) {
          setArticles(articles.filter(a => a.doi != articleId));
        }
        console.log(res.message)
        // TODO: display if success or not in notistack
        setIsLoading(false)
      })
  }, [articles])

  // Functions
  const viewArticle = (articleId: string) => {
    navigate(`/edit/sources/${articleId}`);
  }

  const onEditArticle = (articleId: string) => {
    setIsLoading(true);
    getCurrentArticle(articleId);
    setMode("edit");
    setIsLoading(false);
    createEditModalHandlers.open();
  }

  const onDeleteArticle = (articleId: string) => {
    // TODO: add a confirmation
    deleteArticle(articleId);
  }

  const createNewArticle = (values: CreateFormValues) => {
    const article = { doi: values.reference.doi, title: values.reference.title, methodology: { stimulation_parameters: values.stimulation_params } } as ArticleDdo;
    createArticle(article);
    createEditModalHandlers.close();
  }

  return (
    <Box>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      <Stack>
        "TODO: Articles page. Breadcrumps, table with edit button for each entry, button to add article to table."

        <Group>
          <Button leftIcon={<IconPlus />} variant="filled" onClick={() => createEditModalHandlers.open()}>New</Button>
          <Button leftIcon={<IconRefresh />} variant="subtle" onClick={refreshArticles}>Refresh</Button>
        </Group>

        <ArticlesTable
          data={articles}
          onRowClick={(articleId) => viewArticle(articleId)}
          onEdit={(articleId) => onEditArticle(articleId)}
          onDelete={(articleId) => onDeleteArticle(articleId)}
        />
      </Stack>

      <Modal opened={createEditOpened}
        onClose={() => { createEditModalHandlers.close(); setMode("create") }}
        title={mode === "create" ? "New Article" : "Edit Article"}
        centered size="70%">
        <CreateEditArticleForm
          onSubmit={(values) => { mode === "create" ? createNewArticle(values) : editArticle(values) }}
          mode={mode}
          edit_article={mode === "edit" ? currentArticle : null} />
      </Modal>

    </Box>
  )
}
