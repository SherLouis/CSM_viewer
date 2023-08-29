import { Box, TextInput, Group, Button, Accordion, NativeSelect, NumberInput } from "@mantine/core"
import { useForm } from '@mantine/form';

export const CreateEditSourceForm = ({ onSubmit, mode, edit_source }: CreateSourceFormProps) => {
  // TODO: Ajouter validations
  const form = useForm<CreateFormValues>({
    initialValues: {
      reference: {
        type: edit_source != null ? edit_source.type : '',
        author: edit_source != null ? edit_source.author : '',
        date: edit_source != null ? edit_source.date : '',
        publisher: edit_source != null ? edit_source.publisher : '',
        location: edit_source != null ? edit_source.location : '',
        doi: edit_source != null ? edit_source.doi : '',
        title: edit_source != null ? edit_source.title : ''
      },
      stimulation_params: {
        type: (mode == "edit" && edit_source != null) ? edit_source.methodology.stimulation_parameters.type : 'grid',
        electrode_separation: (mode == "edit" && edit_source != null) ? edit_source.methodology.stimulation_parameters.electrode_separation : 0,
        polarity: (mode == "edit" && edit_source != null) ? edit_source.methodology.stimulation_parameters.polarity : 'unknown',
        current_mA: (mode == "edit" && edit_source != null) ? edit_source.methodology.stimulation_parameters.current_mA : 0,
        pulse_width_ms: (mode == "edit" && edit_source != null) ? edit_source.methodology.stimulation_parameters.pulse_width_ms : 0,
        pulse_freq_Hz: (mode == "edit" && edit_source != null) ? edit_source.methodology.stimulation_parameters.pulse_freq_Hz : 0,
        train_duration_s: (mode == "edit" && edit_source != null) ? edit_source.methodology.stimulation_parameters.train_duration_s : 0
      }
    } as CreateFormValues,
    validate: {
      reference: {
        date: (value) => (value === '' || /^\d{4}\/\d{2}\/\d{2}$/.test(value) ? null : 'Invalid date format')
      }
    },
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
              <NativeSelect
                required
                label="Type"
                data={[
                  { value: '', label: 'Pick one', disabled: true },
                  { value: 'article', label: 'Article' },
                  { value: 'experimental', label: 'Experimental' },
                  { value: 'other', label: 'Other' },
                ]}
                placeholder="Pick one"
                {...form.getInputProps('reference.type')}
              />
              {form.getInputProps('reference.type').value === 'article' &&
                <TextInput
                  label="DOI"
                  {...form.getInputProps('reference.doi')}
                />
              }

              <TextInput
                label="Author"
                {...form.getInputProps('reference.author')}
              />
              <TextInput
                label="Title"
                {...form.getInputProps('reference.title')}
              />
              <TextInput
                label="Date"
                {...form.getInputProps('reference.date')}
                placeholder="YYYY/MM/DD"
              />
              <TextInput
                label="Location"
                {...form.getInputProps('reference.location')}
                placeholder="Enter location"
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
    type: "article" | "experimental" | "other"
    author: string
    date: string
    publisher: string
    location: string
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

interface CreateSourceFormProps {
  onSubmit: (values: CreateFormValues) => void;
  mode: "edit" | "create";
  edit_source?: SourceDdo;
}
