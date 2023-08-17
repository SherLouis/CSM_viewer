import { Box, Button, Group, LoadingOverlay, Modal, NavLink, Space, Stack } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import ArticlesTable from "../../../components/ArticlesTable/ArticlesTable";
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { CreateArticleForm, CreateFormValues } from "../../../components/CreateArticleForm/CreateArticleForm";
import ArticleUIService from "../../../services/ArticleUIService";
import { useCallback, useEffect, useState } from "react";
import { CreateResponseDto, EditResponseDto } from "../../../../IPC/dtos/CreateEditResponseDto";
import { ArticleDtoFromDdo } from "../../../../IPC/dtos/ArticleDto";


export function ArticlesPage() {
  // [x]: get the actual articles from main using ui service and IPC, etc. 

  // Hooks
  const [articles, setArticles] = useState<ArticleSummaryDdo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<ArticleDdo | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");

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
          console.log("Success");
          setArticles([...articles, { doi: article.doi, title: article.title, nb_results: 0 } as ArticleSummaryDdo])
        }
        else { console.log("Failed") }
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
          console.log("Success updating article");
          setArticles(articles.map(a => {
            if (a.doi === currentArticle.doi) {
              return { doi: article.doi, title: article.title, nb_results: a.nb_results };
            }
            else {
              return a;
            }
          }));
        }
        else { console.log("Failed updating article"); }
        setIsLoading(false);
      });
  }, [currentArticle])

  const getCurrentArticle = useCallback((articleId: string) => {
    ArticleUIService.getArticle(articleId)
      .then((res: ArticleDdo) => setCurrentArticle(res));
  }, [currentArticle]);
  let navigate = useNavigate();
  const [createEditOpened, createEditModalHandlers] = useDisclosure(false);

  // Functions
  const viewArticle = (articleId: string) => {
    navigate(`/edit/sources/${articleId}`);
  }

  const openEditArticle = (articleId: string) => {
    setIsLoading(true);
    getCurrentArticle(articleId);
    setMode("edit");
    setIsLoading(false);
    createEditModalHandlers.open();
  }

  const deleteArticle = (articleId: string) => {
    // TODO
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
          onEdit={(articleId) => openEditArticle(articleId)}
          onDelete={(articleId) => deleteArticle(articleId)}
        />
      </Stack>

      <Modal opened={createEditOpened}
        onClose={() => {createEditModalHandlers.close(); setMode("create")}}
        title={mode === "create" ? "New Article" : "Edit Article"}
        centered size="70%">
        <CreateArticleForm
          onSubmit={(values) => { mode === "create" ? createNewArticle(values) : editArticle(values) }}
          mode={mode}
          edit_article={mode === "edit" ? currentArticle : null} />
      </Modal>

    </Box>
  )
}
