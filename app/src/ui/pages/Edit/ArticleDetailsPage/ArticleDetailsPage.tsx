import { Box, Button, Container, Flex, Group, LoadingOverlay, Modal, Stack, Table, Title } from "@mantine/core"
import { Breadcrumbs, Anchor, Text } from '@mantine/core';
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom'
import ArticleUIService from "../../../services/ArticleUIService";
import ResultUIService from "../../../services/ResultUIService";
import { useDisclosure, useListState } from "@mantine/hooks";
import { ResultDdo } from "../../../models/ResultDdo";
import ResultsTable from "../../../components/ResultsTable/ResultsTable";

export const ArticleDetailsPage = () => {
    // hooks
    const { articleId } = useParams<string>();

    const [isLoading, setIsLoading] = useState(true);
    const [currentArticle, setCurrentArticle] = useState<ArticleDdo>();
    const [results, resultsHandlers] = useListState<ResultDdo>([]);
    const [createEditOpened, createEditModalHandlers] = useDisclosure(false);
    const [mode, setMode] = useState<"create" | "edit">("create");

    // Load current article and results
    useEffect(() => {
        console.debug("getting current article");
        ArticleUIService.getArticle(articleId)
            .then((res) => {
                setCurrentArticle(res);
                console.debug("getting results");
                ResultUIService.getAllResultsForArticle(articleId)
                    .then((res) => {
                        resultsHandlers.setState(res);
                        setIsLoading(false)
                    });
            });
    }, []);

    const refreshResults = useCallback(() => {
        setIsLoading(true);
        console.debug("getting results");
        ResultUIService.getAllResultsForArticle(articleId)
            .then((res) => {
                resultsHandlers.setState(res);
                setIsLoading(false);
            });
    }, [results]);

    // Functions
    const viewResult = (resultId: string) => {
        return;
    }

    const onEditResult = (resultId: string) => {
        return;
    }

    const onDeleteResult = (resultId: string) => {
        return;
    }

    return (
        <Container size={"80%"}>
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
                 [x] Results table with 
                 [ ] edit and delete button for each entry
                 [x] Breadcrumps
                 [ ] Button to add result to table.
                */}

                    {/* TODO: mettre ça beau*/}
                    <Title order={3}>{currentArticle.title}</Title>

                    <Title order={3}>Stimulation parameters</Title>
                    <Table>
                        <thead>
                            <tr>
                                <th>type</th>
                                <th>electrode separation</th>
                                <th>polarity</th>
                                <th>current</th>
                                <th>pulse width</th>
                                <th>pulse frequency</th>
                                <th>train duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{currentArticle.methodology.stimulation_parameters.type}</td>
                                <td>{currentArticle.methodology.stimulation_parameters.electrode_separation} mm</td>
                                <td>{currentArticle.methodology.stimulation_parameters.polarity}</td>
                                <td>{currentArticle.methodology.stimulation_parameters.current_mA} mA</td>
                                <td>{currentArticle.methodology.stimulation_parameters.pulse_width_ms} ms</td>
                                <td>{currentArticle.methodology.stimulation_parameters.pulse_freq_Hz} Hz</td>
                                <td>{currentArticle.methodology.stimulation_parameters.train_duration_s} s</td>
                            </tr>
                        </tbody>
                    </Table>

                    <Group>
                        <Button leftIcon={<IconPlus />} variant="filled" onClick={() => createEditModalHandlers.open()}>New</Button>
                        <Button leftIcon={<IconRefresh />} variant="subtle" onClick={refreshResults}>Refresh</Button>
                    </Group>

                    {/*TODO: scroll left problem when window is too smal*/}
                    <ResultsTable
                        data={results}
                        onRowClick={(resultId) => viewResult(resultId)}
                        onEdit={(resultId) => onEditResult(resultId)}
                        onDelete={(resultId) => onDeleteResult(resultId)} />
                </Stack>
            }

            <Modal opened={createEditOpened}
                onClose={() => { createEditModalHandlers.close(); setMode("create") }}
                title={mode === "create" ? "New Result" : "Edit Result"}
                centered size="70%">
                {/*TODO: CreateEditResultForm */}
            </Modal>
        </Container>
    )
}