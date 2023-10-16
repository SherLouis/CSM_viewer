import { Box, Button, Container, Group, LoadingOverlay, Modal, Stack, Text } from "@mantine/core"
import { notifications } from '@mantine/notifications';
import { useNavigate } from "react-router-dom"
import SourcesTable from "../../../components/SourcesTable/SourcesTable";
import { IconCheck, IconCircleX, IconPlus, IconRefresh, IconTrash, IconX} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { CreateEditSourceForm, CreateFormValues } from "../../../components/CreateEditSourceForm/CreateEditSourceForm";
import SourceUIService from "../../../services/SourceUIService";
import { useCallback, useEffect, useState } from "react";
import { CreateResponseDto, EditResponseDto } from "../../../../IPC/dtos/CreateEditResponseDto";
import { SourceDtoFromDdo } from "../../../../IPC/dtos/SourceDto";
import { SourceDdo, SourceSummaryDdo } from "../../../models/SourceDdo";


export function SourcesPage() {
  // Hooks
  const [sources, setSources] = useState<SourceSummaryDdo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSource, setCurrentSource] = useState<SourceDdo | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const navigate = useNavigate();
  const [createEditOpened, createEditModalHandlers] = useDisclosure(false);
  const [toDeleteSourceId, setToDeleteSourceId] = useState(undefined);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    console.debug("using effect");
    setIsLoading(true);
    SourceUIService.getAllSourcesSummary()
      .then((res) => {
        setSources(res);
        setIsLoading(false)
      });
  }, []);

  useEffect(() => {
    // Listen for the event
    window.electronAPI.dbLocationChanged((event, value) => {
      refreshSources();
    })
  }, []);

  const refreshSources = useCallback(() => {
    setIsLoading(true);
    SourceUIService.getAllSourcesSummary()
      .then((res) => {
        setSources(res);
        setIsLoading(false)
      });
  }, [sources]);

  const createSource = useCallback((source: SourceDdo) => {
    setIsLoading(true);
    notifications.show({
      id: 'creatingSource',
      title: "Creating new source...",
      message: "Please wait while the data is being saved.",
      loading: true,
    });
    SourceUIService.createSource(source)
      .then((res: CreateResponseDto) => {
        console.debug(res);
        if (res.successful) {
          refreshSources();
        }
        notifications.update({
          id: 'creatingSource',
          autoClose: 2000,
          title: res.successful ? "Created" : "Error",
          message: res.message,
          color: res.successful ? 'teal' : 'red',
          icon: res.successful ? <IconCheck /> : <IconX/>,
          loading: false,
        });
        setIsLoading(false)
      });
  }, [sources]);

  const editSource = useCallback((values: CreateFormValues) => {
    setIsLoading(true);
    notifications.show({
      id: 'editingSource',
      title: "Editing source...",
      message: "Please wait while the data is being saved.",
      loading: true,
    });
    const source = {
      id: currentSource.id,
      type: values.reference.type,
      author: values.reference.author,
      date: values.reference.date,
      publisher: values.reference.publisher,
      location: values.reference.location,
      doi: values.reference.doi,
      title: values.reference.title,
      cohort: values.reference.cohort
    } as SourceDdo;
    SourceUIService.editSource(currentSource.id, SourceDtoFromDdo(source))
      .then((res: EditResponseDto) => {
        createEditModalHandlers.close();
        if (res.successful) {
          setSources(sources.map(a => {
            if (a.id === currentSource.id) {
              return { id: source.id, title: source.title, nb_results: a.nb_results };
            }
            else {
              return a;
            }
          }));
        }
        notifications.update({
          id: 'editingSource',
          autoClose: 2000,
          title: res.successful ? "Saved" : "Error",
          message: res.message,
          color: res.successful ? 'teal' : 'red',
          icon: res.successful ? <IconCheck /> : <IconX/>,
          loading: false,
        });
        setIsLoading(false);
      });
  }, [currentSource])

  const getCurrentSource = useCallback((sourceId: number) => {
    SourceUIService.getSource(sourceId)
      .then((res: SourceDdo) => setCurrentSource(res));
  }, [currentSource]);

  const deleteSource = useCallback((sourceId: number) => {
    setIsLoading(true);
    notifications.show({
      id: 'deletingSource',
      title: "Deleting source...",
      message: "Please wait while the data is being saved.",
      loading: true,
    });
    SourceUIService.deleteSource(sourceId)
      .then((res: EditResponseDto) => {
        if (res.successful) {
          setSources(sources.filter(a => a.id != sourceId));
        }
        notifications.update({
          id: 'deletingSource',
          autoClose: 2000,
          title: res.successful ? "Deleted" : "Error",
          message: res.message,
          color: res.successful ? 'teal' : 'red',
          icon: res.successful ? <IconCheck /> : <IconX/>,
          loading: false,
        });
        setIsLoading(false)
      })
  }, [sources])


  // Functions
  const viewSource = (sourceId: number) => {
    navigate(`/edit/sources/${sourceId}`);
  }

  const onEditSource = (sourceId: number) => {
    setIsLoading(true);
    getCurrentSource(sourceId);
    setMode("edit");
    setIsLoading(false);
    createEditModalHandlers.open();
  }

  const onDeleteSource = (sourceId: number) => {
    setToDeleteSourceId(sourceId);
    setShowConfirmDelete(true);
  }

  const onConfirmDeleteSource = () => {
    setShowConfirmDelete(false);
    deleteSource(toDeleteSourceId);
    setToDeleteSourceId(undefined);
  }

  const createNewSource = (values: CreateFormValues) => {
    const source = {
      type: values.reference.type,
      author: values.reference.author,
      date: values.reference.date,
      publisher: values.reference.publisher,
      location: values.reference.location,
      doi: values.reference.doi,
      title: values.reference.title,
      cohort: values.reference.cohort
    } as SourceDdo;
    createSource(source);
    createEditModalHandlers.close();
  }

  return (
    <Container size={"80%"}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      <Stack>
        <Group>
          <Button leftIcon={<IconPlus />} variant="filled" onClick={() => createEditModalHandlers.open()}>New</Button>
          <Button leftIcon={<IconRefresh />} variant="subtle" onClick={refreshSources}>Refresh</Button>
        </Group>

        <Modal opened={showConfirmDelete} onClose={() => setShowConfirmDelete(false)} title="Delete Source ?">
          <Text>Are you sure you want to delete source with id {toDeleteSourceId} ?</Text>
          <Group position="apart">
            <Button leftIcon={<IconCircleX color="white" />} variant="filled" onClick={() => setShowConfirmDelete(false)}>Cancel</Button>
            <Button leftIcon={<IconTrash color="white" />} variant="filled" color="red" onClick={onConfirmDeleteSource}>Delete</Button>
          </Group>
        </Modal>

        <Box h={"70vh"}>
          <SourcesTable
            data={sources}
            onRowClick={(sourceId) => viewSource(sourceId)}
            onEdit={(sourceId) => onEditSource(sourceId)}
            onDelete={(sourceId) => onDeleteSource(sourceId)}
          />
        </Box>
      </Stack>

      <Modal opened={createEditOpened}
        onClose={() => { createEditModalHandlers.close(); setMode("create") }}
        title={mode === "create" ? "New Source" : "Edit Source"}
        centered size="70%">
        <CreateEditSourceForm
          onSubmit={(values) => { mode === "create" ? createNewSource(values) : editSource(values) }}
          mode={mode}
          edit_source={mode === "edit" ? currentSource : null} />
      </Modal>

    </Container>
  )
}
