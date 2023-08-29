import { Box, Button, Container, Group, LoadingOverlay, Modal, Stack, Table, Title } from "@mantine/core"
import { Breadcrumbs, Anchor, Text } from '@mantine/core';
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom'
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
    console.debug(sourceId);

    const [isLoading, setIsLoading] = useState(true);
    const [currentSource, setCurrentSource] = useState<SourceDdo>();
    const [results, resultsHandlers] = useListState<ResultDdo>([]);
    const [createEditOpened, createEditModalHandlers] = useDisclosure(false);
    const [mode, setMode] = useState<"create" | "edit" | "view">("view");
    const [selectedResult, setSelectedResult] = useState<ResultDdo>();

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

    const createResult = useCallback((result: ResultDdo) => {
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
            });
    }, [currentSource]);

    const editResult = useCallback((values: CreateEditResultFormValues) => {
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
            });
    }, [selectedResult])

    // Functions
    const viewResult = (result: ResultDdo) => {
        setMode("view");
        setSelectedResult(result);
        createEditModalHandlers.open();
    }

    const onEditResult = (result: ResultDdo) => {
        setMode("edit");
        setSelectedResult(result);
        createEditModalHandlers.open();
    }

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

    const onCreateResult = (values: CreateEditResultFormValues) => {
        const result = { location: values.location, effect: values.effect, comments: values.comments } as ResultDdo;
        createResult(result);
        createEditModalHandlers.close();
    }

    const onCreateButton = () => {
        setMode("create");
        createEditModalHandlers.open();
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
                                <td>{currentSource.methodology.stimulation_parameters.type}</td>
                                <td>{currentSource.methodology.stimulation_parameters.electrode_separation} mm</td>
                                <td>{currentSource.methodology.stimulation_parameters.polarity}</td>
                                <td>{currentSource.methodology.stimulation_parameters.current_mA} mA</td>
                                <td>{currentSource.methodology.stimulation_parameters.pulse_width_ms} ms</td>
                                <td>{currentSource.methodology.stimulation_parameters.pulse_freq_Hz} Hz</td>
                                <td>{currentSource.methodology.stimulation_parameters.train_duration_s} s</td>
                            </tr>
                        </tbody>
                    </Table>

                    <Group>
                        <Button leftIcon={<IconPlus />} variant="filled" onClick={onCreateButton}>New</Button>
                        <Button leftIcon={<IconRefresh />} variant="subtle" onClick={refreshResults}>Refresh</Button>
                    </Group>

                    <Box h={"50vh"}>
                        <ResultsTable
                            data={results}
                            onRowClick={(result) => viewResult(result)}
                            onEdit={(result) => onEditResult(result)}
                            onDelete={(resultId) => onDeleteResult(resultId)} />
                    </Box>
                </Stack>
            }
            <Modal opened={createEditOpened}
                onClose={() => { createEditModalHandlers.close(); setMode("create") }}
                title={mode === "create" ? "New Result" : "Edit Result"}
                centered size="70%">
                <CreateEditResultForm
                    onSubmit={(values) => { mode === "create" ? onCreateResult(values) : mode === "edit" ? editResult(values) : createEditModalHandlers.close() }}
                    mode={mode}
                    edit_result={(mode === "edit" || mode === "view") ? selectedResult : null}
                />
            </Modal>
        </Container>
    )
}