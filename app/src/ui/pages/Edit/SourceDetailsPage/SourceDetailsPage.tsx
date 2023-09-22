import { Box, Button, Container, Group, LoadingOverlay, Modal, Stack, Table, Title } from "@mantine/core"
import { Breadcrumbs, Anchor, Text } from '@mantine/core';
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import SourceUIService from "../../../services/SourceUIService";
import ResultUIService from "../../../services/ResultUIService";
import { useDisclosure, useListState } from "@mantine/hooks";
import { ResultDdo } from "../../../models/ResultDdo";
import ResultsTable from "../../../components/ResultsTable/ResultsTable";
import { CreateEditResultForm, CreateEditResultFormValues } from "../../../components/CreateEditResultForm/CreateEditResultForm";
import { CreateResponseDto, EditResponseDto } from "../../../../IPC/dtos/CreateEditResponseDto";

export const SourceDetailsPage = () => {
    // hooks
    const { sourceIdParam } = useParams<string>();
    const sourceId = parseInt(sourceIdParam);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [currentSource, setCurrentSource] = useState<SourceDdo>();
    const [results, resultsHandlers] = useListState<ResultDdo>([]);

    // Load current source and results
    useEffect(() => {
        console.debug("getting current source");
        SourceUIService.getSource(sourceId)
            .then((res) => {
                setCurrentSource(res);
                console.debug("getting results");
                ResultUIService.getAllResultsForSource(sourceId)
                    .then((res) => {
                        resultsHandlers.setState(res);
                        setIsLoading(false)
                    });
            });
    }, []);

    const refreshResults = useCallback(() => {
        setIsLoading(true);
        console.debug("getting results");
        ResultUIService.getAllResultsForSource(sourceId)
            .then((res) => {
                resultsHandlers.setState(res);
                setIsLoading(false);
            });
    }, [currentSource]);

    // Listen for the event db location changed
    useEffect(() => {
        window.electronAPI.dbLocationChanged((event, value) => {
            navigate('/edit/sources/');
        })
    }, []);

    const createResult = useCallback((result: ResultDdo) => {
        /* TODO: create
        setIsLoading(true);
        ResultUIService.createResult(sourceId, result)
            .then((res: CreateResponseDto) => {
                console.debug(res);
                if (res.successful) {
                    resultsHandlers.append(result)
                }
                console.log(res.message)
                // TODO: display if success or not in notistack
                setIsLoading(false)
            });*/
    }, [currentSource]);

    const editResult = useCallback((result: ResultDdo) => {
        /* TODO : edit
        setIsLoading(true);
        const result = { id: selectedResult.id, ...values } as ResultDdo;
        ResultUIService.editResult(selectedResult.id, result)
            .then((res: EditResponseDto) => {
                createEditModalHandlers.close();
                if (res.successful) {
                    resultsHandlers.applyWhere(
                        (r) => (r.id === selectedResult.id),
                        (r) => result
                    );
                }
                console.log(res.message);
                setIsLoading(false);
            });*/
    }, [currentSource])

    // Functions
    const onDeleteResult = (resultId: number) => {
        setIsLoading(true);
        ResultUIService.deleteResult(resultId)
            .then((res: EditResponseDto) => {
                console.debug(res);
                if (res.successful) {
                    resultsHandlers.filter((a) => a.id != resultId);
                }
                console.log(res.message)
                // TODO: display if success or not in notistack
                setIsLoading(false)
            })
    }


    const onCreateButton = () => {
        setShowCreateForm(true);
    }

    console.debug(results);

    return (
        <Container size={"80%"}>
            <LoadingOverlay visible={isLoading} overlayBlur={2} />

            <Breadcrumbs>
                <Anchor component={Link} title="Sources" to="/edit/sources">Sources</Anchor>
                <Text>{sourceId}</Text>
            </Breadcrumbs>

            {!isLoading &&
                <Stack>
                    <Title order={3}>{currentSource.title}</Title>
                    <Group>
                        <Button leftIcon={<IconPlus />} variant="filled" onClick={onCreateButton}>New</Button>
                        <Button leftIcon={<IconRefresh />} variant="subtle" onClick={refreshResults}>Refresh</Button>
                    </Group>

                    <Box h={"50vh"}>
                        {showCreateForm && (
                            <CreateEditResultForm
                            onSubmit={(values) => {setShowCreateForm(false); console.debug(values)}} />
                        )}
                        <ResultsTable
                            data={results}
                            onEdit={(result) => editResult(result)}
                            onDelete={(resultId) => onDeleteResult(resultId)} />
                    </Box>
                </Stack>
            }
        </Container>
    )
}