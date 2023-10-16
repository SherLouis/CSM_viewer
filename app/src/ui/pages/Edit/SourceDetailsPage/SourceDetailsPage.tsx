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
import { EffectDdo } from "../../../models/EffectDdo";
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
    const [toDeleteResultId, setToDeleteResultId] = useState(undefined);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const [rois, roisHandlers] = useListState<ROIDdo>([]);
    const [effects, effectsHandlers] = useListState<EffectDdo>([]);

    // Load current source, results and rois
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
                                console.debug(rois);
                                console.debug("getting Effects");
                                ResultUIService.getEffects()
                                    .then((res_effects) => {
                                        effectsHandlers.setState(res_effects)
                                        setIsLoading(false);
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

    const refreshRois = useCallback(() => {
        setIsLoading(true);
        console.debug("getting ROIs");
        ResultUIService.getROIs()
            .then((rois) => {
                roisHandlers.setState(rois);
                setIsLoading(false);
            })
    }, []);

    const refreshEffects = useCallback(() => {
        setIsLoading(true);
        console.debug("getting Effects");
        ResultUIService.getEffects()
            .then((effects) => {
                effectsHandlers.setState(effects);
                setIsLoading(false);
            })
    }, []);

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
                    // TODO: add new id in response and append to list instead of refreshing all
                    refreshResults();
                    if (shouldCreateNewRoi(result)) {
                        refreshRois();
                    }
                    if (shouldCreateNewEffect(result)) {
                        refreshEffects();
                    }
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
                    if (shouldCreateNewRoi(result)) {
                        refreshRois();
                    }
                    if (shouldCreateNewEffect(result)) {
                        refreshEffects();
                    }
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
                    icon: res.successful ? <IconCheck /> : <IconX/>,
                    loading: false,
                  });
                setIsLoading(false);
                setToDeleteResultId(undefined);
            })
    }

    const onCreateResult = (values: CreateEditResultFormValues) => {
        const result = {
            roi: {
                lobe: values.roi.lobe,
                gyrus: values.roi.gyrus,
                sub: values.roi.sub,
                precision: values.roi.precision
            },
            stimulation_parameters: {
                amplitude_ma: values.stimulation_parameters.amplitude_ma,
                frequency_hz: values.stimulation_parameters.frequency_hz,
                electrode_separation_mm: values.stimulation_parameters.electrode_separation_mm,
                duration_s: values.stimulation_parameters.duration_s
            },
            effect: {
                category: values.effect.category,
                semiology: values.effect.semiology,
                characteristic: values.effect.characteristic,
                precision: values.effect.precision,
                post_discharge: values.effect.post_discharge
            },
            occurrences: values.occurrences,
            comments: values.comments
        } as ResultDdo
        setShowCreateForm(false);
        createResult(result);
    }

    const onCreateButton = () => {
        setShowCreateForm(true);
    }

    const shouldCreateNewRoi = (result: ResultDdo): boolean => {
        const roi = {
            lobe: result.roi.lobe != '' ? result.roi.lobe : null,
            gyrus: result.roi.gyrus != '' ? result.roi.gyrus : null,
            sub: result.roi.sub != '' ? result.roi.sub : null,
            precision: result.roi.precision != '' ? result.roi.precision : null,
        }
        const isNewRoi = rois.filter((r) => r.lobe === roi.lobe && r.gyrus === roi.gyrus && r.sub === roi.sub && r.precision === roi.precision).length === 0;
        return isNewRoi;
    }

    const shouldCreateNewEffect = (result: ResultDdo): boolean => {
        const effect = {
            category: result.effect.category != '' ? result.effect.category : null,
            semiology: result.effect.semiology != '' ? result.effect.semiology : null,
            characteristic: result.effect.characteristic != '' ? result.effect.characteristic : null,
            precision: result.effect.precision != '' ? result.effect.precision : null,
        }
        const isNewEffect = effects.filter((e) =>
            e.category === effect.category &&
            e.semiology === effect.semiology &&
            e.characteristic === effect.characteristic &&
            e.precision === effect.precision).length === 0;
        return isNewEffect;
    }

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
                                rois={rois}
                                effects={effects}
                            />
                        )}
                        <ResultsTable
                            data={results}
                            rois={rois}
                            effects={effects}
                            onEdit={(result) => editResult(result)}
                            onCreate={(result) => createResult(result)}
                            onDelete={(resultId) => onDeleteResult(resultId)} />
                    </Box>
                </Stack>
            }
        </Container>
    )
}