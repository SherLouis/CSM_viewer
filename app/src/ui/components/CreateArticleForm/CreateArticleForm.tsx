import { Box, TextInput, Checkbox, Group, Button, Accordion, NativeSelect, NumberInput } from "@mantine/core"
import { useForm } from '@mantine/form';

export const CreateArticleForm = ({ onSubmit }: CreateArticleFormProps) => {
  // TODO: should be able to have null values
  const form = useForm<CreateFormValues>({
    initialValues: {
      reference: { doi: '', title: '' },
      stimulation_params: {
        type: '',
        electrode_separation: 0,
        polatiry: '',
        current_mA: 0,
        pulse_width_ms: 0,
        pulse_freq_Hz: 0,
        train_duration_s: 0
      }
    } as CreateFormValues,
  });

  const handleSubmit = (values: CreateFormValues) => {
    form.validate();
    console.log(form.errors);
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
                label="Current"
                description="In mA"
                hideControls
              />
              <NumberInput
                label="Pulse Width"
                description="In ms"
                hideControls
              />
              <NumberInput
                label="Pulse Frequency"
                description="In Hz"
                hideControls
              />
              <NumberInput
                label="Train Duration"
                description="In s"
                hideControls
              />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  )
}

export interface CreateFormValues {
  // TODO
  reference: {
    doi: string
    title?: string
  }
  stimulation_params: {
    type: StimulationType | ""
    electrode_separation: number
    polatiry?: StimulationPolarity | ""
    current_mA: number
    pulse_width_ms?: number
    pulse_freq_Hz?: number
    train_duration_s?: number
  }
}

interface CreateArticleFormProps {
  onSubmit: (values: CreateFormValues) => void;
}
