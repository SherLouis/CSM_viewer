import { Box, Button, Group, LoadingOverlay, Modal, Stack, Title } from "@mantine/core"
import { Breadcrumbs, Anchor, Text } from '@mantine/core';
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom'
import ArticleUIService from "../../../services/ArticleUIService";
import { useDisclosure, useListState } from "@mantine/hooks";

export const ArticleDetailsPage = () => {
    // hooks
    const { articleId } = useParams<string>();

    const [isLoading, setIsLoading] = useState(true);
    const [currentArticle, setCurrentArticle] = useState<ArticleDdo>();
    //const [results, resultsHandlers] = useListState<ResultDdo[]>([]);
    const [createEditOpened, createEditModalHandlers] = useDisclosure(false);
    const [mode, setMode] = useState<"create" | "edit">("create");

    // Load current article
    useEffect(() => {
        console.debug("using effect");
        setIsLoading(true);
        ArticleUIService.getArticle(articleId)
            .then((res) => {
                setCurrentArticle(res);
                setIsLoading(false)
            });
    }, []);

    // TODO
    /*
    const refreshResults = useCallback(() => {
        setIsLoading(true);
        ArticleUIService.getResults(articleId)
          .then((res) => {
            resultsHandlers.setState(res);
            setIsLoading(false)
          });
      }, [results]);
      */

    return (
        <Box>
            <LoadingOverlay visible={isLoading} overlayBlur={2} />

            <Breadcrumbs>
                <Anchor component={Link} title="Articles" to="/edit/sources">Articles</Anchor>
                <Text>{articleId}</Text>
            </Breadcrumbs>

            {!isLoading &&
                <Stack>
                    {/*TODO: 
                 [ ] Specific Article page: Reference infos (DOI, title, etc)
                 [ ] Methodology infos (stimulation params)
                 [ ] Results table with edit and delete button for each entry
                 [x] Breadcrumps
                 [ ] Button to add result to table.
                */}

                    {/* TODO: mettre ça beau*/}
                    <Title w="h3">{currentArticle.doi} ({currentArticle.title})</Title>
                    {JSON.stringify(currentArticle.methodology.stimulation_parameters)}


                    <Group>
                        <Button leftIcon={<IconPlus />} variant="filled" onClick={() => createEditModalHandlers.open()}>New</Button>
                        {/*<Button leftIcon={<IconRefresh />} variant="subtle" onClick={refreshResults}>Refresh</Button>*/}
                    </Group>

                    {/*TODO: ResultsTable */}
                </Stack>
            }

            <Modal opened={createEditOpened}
                onClose={() => { createEditModalHandlers.close(); setMode("create") }}
                title={mode === "create" ? "New Result" : "Edit Result"}
                centered size="70%">
                {/*TODO: CreateEditResultForm */}
            </Modal>
        </Box>
    )
}