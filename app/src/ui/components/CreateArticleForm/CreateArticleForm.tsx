import { Box, TextInput, Group, Button, Accordion, NativeSelect, NumberInput } from "@mantine/core"
import { useForm } from '@mantine/form';

export const CreateArticleForm = ({ onSubmit, mode, edit_article }: CreateArticleFormProps) => {
  // TODO: Ajouter validations
  const form = useForm<CreateFormValues>({
    initialValues: {
      reference: {
        doi: edit_article != null ? edit_article.doi : '',
        title: edit_article != null ? edit_article.title : ''
      },
      stimulation_params: {
        type: (mode == "edit" && edit_article != null) ? edit_article.methodology.stimulation_parameters.type : 'grid',
        electrode_separation: (mode == "edit" && edit_article != null) ? edit_article.methodology.stimulation_parameters.electrode_separation : 0,
        polarity: (mode == "edit" && edit_article != null) ? edit_article.methodology.stimulation_parameters.polarity : 'unknown',
        current_mA: (mode == "edit" && edit_article != null) ? edit_article.methodology.stimulation_parameters.current_mA : 0,
        pulse_width_ms: (mode == "edit" && edit_article != null) ? edit_article.methodology.stimulation_parameters.pulse_width_ms : 0,
        pulse_freq_Hz: (mode == "edit" && edit_article != null) ? edit_article.methodology.stimulation_parameters.pulse_freq_Hz : 0,
        train_duration_s: (mode == "edit" && edit_article != null) ? edit_article.methodology.stimulation_parameters.train_duration_s : 0
      }
    } as CreateFormValues,
  });

  const handleSubmit = (values: CreateFormValues) => {
    form.validate();
    console.debug(values);
    onSubmit(values);
  }

  return (
    <Box>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Accordion defaultValue="reference">
          <Accordion.Item value="reference">
            <Accordion.Control>Reference</Accordion.Control>
            <Accordion.Panel>
              <TextInput
                required
                label="DOI"
                {...form.getInputProps('reference.doi')}
                disabled={mode==="edit"}
              />
              <TextInput
                label="Title"
                {...form.getInputProps('reference.title')}
              />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="methodology">
            <Accordion.Control>Methodology - Stimulation Parameters</Accordion.Control>
            <Accordion.Panel>
              <NativeSelect
                required
                label="Type"
                data={[
                  { value: 'grid', label: 'Grid' },
                  { value: 'depth', label: 'Depth' },
                  { value: 'HTFS', label: 'HFTS' },
                ]}
                placeholder="Pick one"
                {...form.getInputProps('stimulation_params.type')}
              />
              <NumberInput
                label="Electrodes separation"
                description="In mm"
                required
                hideControls
                {...form.getInputProps('stimulation_params.electrode_separation')}
              />
              <NativeSelect
                required
                label="Polarity"
                data={[
                  { value: 'unknown', label: 'Unknown' },
                  { value: 'unipolar', label: 'Unipolar' },
                  { value: 'bipolar', label: 'Bipolar' },
                ]}
                placeholder="Pick one"
                {...form.getInputProps('stimulation_params.polarity')}
              />
              <NumberInput
                required
                label="Current"
                description="In mA"
                hideControls
                {...form.getInputProps('stimulation_params.current_mA')}
              />
              <NumberInput
                label="Pulse Width"
                description="In ms"
                hideControls
                {...form.getInputProps('stimulation_params.pulse_width_ms')}
              />
              <NumberInput
                label="Pulse Frequency"
                description="In Hz"
                hideControls
                {...form.getInputProps('stimulation_params.pulse_freq_Hz')}
              />
              <NumberInput
                label="Train Duration"
                description="In s"
                hideControls
                {...form.getInputProps('stimulation_params.train_duration_s')}
              />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <Group position="right" mt="md">
          <Button type="submit">{mode === "create" ? "Create" : "Save"}</Button>
        </Group>
      </form>
    </Box>
  )
}

export interface CreateFormValues {
  reference: {
    doi: string
    title?: string
  }
  stimulation_params: {
    type: StimulationTypeDdo | ''
    electrode_separation: number
    polarity?: StimulationPolarityDdo
    current_mA: number
    pulse_width_ms?: number
    pulse_freq_Hz?: number
    train_duration_s?: number
  }
}

interface CreateArticleFormProps {
  onSubmit: (values: CreateFormValues) => void;
  mode: "edit" | "create";
  edit_article?: ArticleDdo;
}
