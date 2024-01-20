import { Box, Button, Container, Group, LoadingOverlay, Modal, Stack, Title } from "@mantine/core"
import { Breadcrumbs, Anchor, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconCircleX, IconPlus, IconRefresh, IconTrash, IconX } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from 'react-router-dom'
import SourceUIService from "../../../services/SourceUIService";
import ResultUIService from "../../../services/ResultUIService";
import { useListState } from "@mantine/hooks";
import { ResultDdo } from "../../../models/ResultDdo";
import { ROIDdo } from "../../../models/ROIDdo";
import { SourceDdo } from "../../../models/SourceDdo";
import { EffectDdo } from "../../../models/EffectDdo";
import ResultsTable from "../../../components/ResultsTable/ResultsTable";
import { CreateEditResultForm, CreateEditResultFormValues } from "../../../components/CreateEditResultForm/CreateEditResultForm";
import { CreateResponseDto, EditResponseDto } from "../../../../IPC/dtos/CreateEditResponseDto";
import { TaskDdo } from "../../../models/TaskDdo";
import { FunctionDdo } from "../../../models/FunctionDdo";


export const SourceDetailsPage = () => {
    // hooks
    const { sourceIdParam } = useParams<string>();
    const sourceId = parseInt(sourceIdParam);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [currentSource, setCurrentSource] = useState<SourceDdo>();
    const [results, resultsHandlers] = useListState<ResultDdo>([]);
    const [toDeleteResultId, setToDeleteResultId] = useState(undefined);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const [rois, roisHandlers] = useListState<ROIDdo>([]);
    const [effects, effectsHandlers] = useListState<EffectDdo>([]);
    const [tasks, tasksHandlers] = useListState<TaskDdo>([]);
    const [functions, functionsHandlers] = useListState<FunctionDdo>([])

    // Load current source, results, rois, tasks and functions
    useEffect(() => {
        console.debug("getting current source");
        SourceUIService.getSource(sourceId)
            .then((res) => {
                setCurrentSource(res);
                console.debug("getting results");
                ResultUIService.getAllResultsForSource(sourceId)
                    .then((res) => {
                        resultsHandlers.setState(res);
                        console.debug("getting ROIs");
                        ResultUIService.getROIs()
                            .then((rois) => {
                                roisHandlers.setState(rois);
                                console.debug("getting Effects");
                                ResultUIService.getEffects()
                                    .then((res_effects) => {
                                        effectsHandlers.setState(res_effects)
                                        console.debug("getting Tasks");
                                        ResultUIService.getTasks()
                                            .then((tasks) => {
                                                tasksHandlers.setState(tasks)
                                                console.debug("getting Functions");
                                                ResultUIService.getFunctions()
                                                    .then((functions) => {
                                                        functionsHandlers.setState(functions);
                                                        setIsLoading(false);
                                                    })
                                            })
                                    })
                            })
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
        setIsLoading(true);
        notifications.show({
            id: 'creatingResult',
            title: "Creating new result...",
            message: "Please wait while the data is being saved.",
            loading: true,
        });
        ResultUIService.createResult(sourceId, result)
            .then((res: CreateResponseDto) => {
                console.debug(res);
                if (res.successful) {
                    refreshResults();
                }
                notifications.update({
                    id: 'creatingResult',
                    autoClose: 2000,
                    title: res.successful ? "Created" : "Error",
                    message: res.message,
                    color: res.successful ? 'teal' : 'red',
                    icon: res.successful ? <IconCheck /> : <IconX />,
                    loading: false,
                });
                setIsLoading(false)
            });
    }, [currentSource]);

    const editResult = useCallback((result: ResultDdo) => {
        setIsLoading(true);
        notifications.show({
            id: 'editingResult',
            title: "Creating new result...",
            message: "Please wait while the data is being saved.",
            loading: true,
        });
        ResultUIService.editResult(sourceId, result)
            .then((res: EditResponseDto) => {
                if (res.successful) {
                    resultsHandlers.applyWhere(
                        (r) => (r.id === result.id),
                        (r) => result
                    );
                }
                notifications.update({
                    id: 'editingResult',
                    autoClose: 2000,
                    title: res.successful ? "Saved" : "Error",
                    message: res.message,
                    color: res.successful ? 'teal' : 'red',
                    icon: res.successful ? <IconCheck /> : <IconX />,
                    loading: false,
                });
                setIsLoading(false);
            });
    }, [currentSource])

    // Functions
    const onDeleteResult = (resultId: number) => {
        setToDeleteResultId(resultId);
        setShowConfirmDelete(true);
    }

    const onConfirmDeleteResult = () => {
        setShowConfirmDelete(false);
        setIsLoading(true);
        notifications.show({
            id: 'deletingResult',
            title: "Deleting result...",
            message: "Please wait while the data is being saved.",
            loading: true,
        });
        ResultUIService.deleteResult(toDeleteResultId)
            .then((res: EditResponseDto) => {
                console.debug(res);
                if (res.successful) {
                    resultsHandlers.filter((a) => a.id != toDeleteResultId);
                }
                notifications.update({
                    id: 'deletingResult',
                    autoClose: 2000,
                    title: res.successful ? "Deleted" : "Error",
                    message: res.message,
                    color: res.successful ? 'teal' : 'red',
                    icon: res.successful ? <IconCheck /> : <IconX />,
                    loading: false,
                });
                setIsLoading(false);
                setToDeleteResultId(undefined);
            })
    }

    const onCreateResult = (values: CreateEditResultFormValues) => {
        const result = {
            roi: {
                side: values.roi.side,
                lobe: values.roi.lobe,
                region: values.roi.region,
                area: values.roi.area,
                from_figure: values.roi.from_figure,
                mni_x: values.roi.mni_x,
                mni_y: values.roi.mni_y,
                mni_z: values.roi.mni_z,
                mni_average: values.roi.mni_average,
            },
            stimulation_parameters: {
                amplitude_ma: values.stimulation_parameters.amplitude_ma,
                amplitude_ma_max: values.stimulation_parameters.amplitude_ma_max,
                frequency_hz: values.stimulation_parameters.frequency_hz,
                frequency_hz_max: values.stimulation_parameters.frequency_hz_max,
                duration_s: values.stimulation_parameters.duration_s,
                duration_s_max: values.stimulation_parameters.duration_s_max,
                electrode_make: values.stimulation_parameters.electrode_make,
                implentation_type: values.stimulation_parameters.implentation_type,
                contact_separation: values.stimulation_parameters.contact_separation,
                contact_diameter: values.stimulation_parameters.contact_diameter,
                contact_length: values.stimulation_parameters.contact_length,
                phase_length: values.stimulation_parameters.phase_length,
                phase_type: values.stimulation_parameters.phase_type
            },
            effect: {
                class: values.effect.class,
                descriptor: values.effect.descriptor,
                details: values.effect.details,
                post_discharge: values.effect.post_discharge,
                lateralization: values.effect.lateralization,
                dominant: values.effect.dominant,
                body_part: values.effect.body_part,
                comments: values.effect.comments
            },
            task: {
                category: values.task.category,
                subcategory: values.task.subcategory,
                characteristic: values.task.characteristic,
                comments: values.task.comments
            },
            function: {
                category: values.function.category,
                subcategory: values.function.subcategory,
                characteristic: values.function.characteristic,
                article_designed_for_function: values.function.article_designed_for_function,
                comments: values.function.comments
            },
            occurrences: values.occurrences,
            comments: values.comments,
            comments_2: values.comments_2,
            precision_score: values.precision_score
        } as ResultDdo
        setShowCreateForm(false);
        createResult(result);
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

            <Modal opened={showConfirmDelete} onClose={() => setShowConfirmDelete(false)} title="Delete Result ?">
                <Text>Are you sure you want to delete result with id {toDeleteResultId} ?</Text>
                <Group position="apart">
                    <Button leftIcon={<IconCircleX color="white" />} variant="filled" onClick={() => setShowConfirmDelete(false)}>Cancel</Button>
                    <Button leftIcon={<IconTrash color="white" />} variant="filled" color="red" onClick={onConfirmDeleteResult}>Delete</Button>
                </Group>
            </Modal>

            {!isLoading &&
                <Stack>
                    <Title order={3}>{currentSource.title}</Title>
                    <Group>
                        <Button leftIcon={<IconPlus />} variant="filled" onClick={onCreateButton}>New</Button>
                        <Button leftIcon={<IconRefresh />} variant="subtle" onClick={refreshResults}>Refresh</Button>
                    </Group>

                    <Box h={"80vh"}>
                        {showCreateForm && (
                            <CreateEditResultForm
                                onSubmit={(values) => onCreateResult(values)}
                                onCancel={() => setShowCreateForm(false)}
                                rois={rois}
                                effects={effects}
                                tasks={tasks}
                                functions={functions}
                            />
                        )}
                        <ResultsTable
                            data={results}
                            rois={rois}
                            effects={effects}
                            tasks={tasks}
                            functions={functions}
                            onEdit={(result) => editResult(result)}
                            onCreate={(result) => createResult(result)}
                            onDelete={(resultId) => onDeleteResult(resultId)} />
                    </Box>
                </Stack>
            }
        </Container>
    )
}