import { Box, TextInput, Group, Flex, Button, Accordion, NativeSelect, NumberInput, Switch, Stack } from "@mantine/core"
import { useForm } from '@mantine/form';
const citejs = require('@citation-js/core')
require('@citation-js/plugin-pubmed')
require('@citation-js/plugin-doi')
import { useCallback, useState } from "react";
import { SourceDdo, SourceSummaryDdo } from "../../models/SourceDdo";

export const CreateEditSourceForm = ({ onSubmit, mode, edit_source }: CreateSourceFormProps) => {
  const form = useForm<CreateFormValues>({
    initialValues: {
      reference: {
        author: edit_source != null ? edit_source.author : '',
        date: edit_source != null ? edit_source.date : '',
        publisher: edit_source != null ? edit_source.publisher : '',
        doi: edit_source != null ? edit_source.doi : '',
        title: edit_source != null ? edit_source.title : '',
        cohort: edit_source != null ? edit_source.cohort : 0,
      },
      status: edit_source != null ? edit_source.state : "À Faire",
      validity: {
        roi_nomenclature: edit_source != null ? edit_source.validity.roi_nomenclature : '',
        null_effects: edit_source != null ? edit_source.validity.null_effects : false,
        sham_stimulation: edit_source != null ? edit_source.validity.sham_stimulation : false,
        control_for_after_discharge: edit_source != null ? edit_source.validity.control_for_after_discharge : false,
        response_characterization: {
          cat_methodology: edit_source != null ? edit_source.validity.response_characterization.cat_methodology : false,
          replicability_of_response: edit_source != null ? edit_source.validity.response_characterization.replicability_of_response : false,
          dose_responsiveness: edit_source != null ? edit_source.validity.response_characterization.dose_responsiveness : false,
          dissection_of_response: edit_source != null ? edit_source.validity.response_characterization.dissection_of_response : false,
        }
      }
    } as CreateFormValues,
    validate: {
      reference: {
        date: (value) => (value === '' || /^\d{4}(\/\d{2})?(\/\d{2})?$/.test(value) ? null : 'Invalid date format')
      }
    },
  });

  const getInfoFromPubMedId = useCallback((id: string) => {
    setLoadingFromPubMed(true);
    citejs.Cite.async(id, { forceType: '@pubmed/id' })
      .then(
        (cite: any) => {
          const doi = cite.data[0].DOI;
          const author = cite.data[0].author[0];
          const publisher = cite.data[0]['publisher'];
          const title = cite.data[0].title;
          const _date = cite.data[0].issued['date-parts'][0]
          const date = String(_date[0])
          form.setFieldValue('reference.doi', doi);
          form.setFieldValue('reference.author', author.family + ',' + author.given);
          form.setFieldValue('reference.publisher', publisher != null ? publisher : "");
          form.setFieldValue('reference.title', title != null ? title : "");
          form.setFieldValue('reference.date', date);
          setLoadingFromPubMed(false);
        },
        (reason: any) => { console.error(reason); setLoadingFromPubMed(false) })
  }, [])

  const getInfoFromDoi = useCallback((id: string) => {
    setLoadingFromDoi(true);
    citejs.Cite.async(id, { forceType: '@doi/id' })
      .then(
        (cite: any) => {
          console.log(cite);
          const author = cite.data[0].author[0];
          const publisher = cite.data[0]['publisher'];
          const title = cite.data[0].title;
          const _date = cite.data[0].issued['date-parts'][0]
          const date = String(_date[0])
          form.setFieldValue('reference.author', author.family + ',' + author.given);
          form.setFieldValue('reference.publisher', publisher != null ? publisher : "");
          form.setFieldValue('reference.title', title != null ? title : "");
          form.setFieldValue('reference.date', date);
          setLoadingFromDoi(false);
        },
        (reason: any) => { console.error(reason); setLoadingFromDoi(false) })
  }, [])


  const [pubMedId, setPubMedId] = useState<string>();
  const [loadingFromPubMed, setLoadingFromPubMed] = useState<boolean>(false);

  const [loadingFromDoi, setLoadingFromDoi] = useState<boolean>(false);

  const handleSubmit = (values: CreateFormValues) => {
    form.validate();
    onSubmit(values);
  }

  return (
    <Box>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Accordion multiple defaultValue={['reference', 'validity']}>
          <Accordion.Item value="reference">
            <Accordion.Control>Reference</Accordion.Control>
            <Accordion.Panel>
              <Flex direction='row' align='flex-end'>
                <TextInput
                  label="PubMed ID"
                  name="pubmedId"
                  placeholder="Paste PubMed ID here to try to autofill reference fields"
                  onChange={(e) => setPubMedId(e.target.value)}
                />
                <Button onClick={() => getInfoFromPubMedId(pubMedId)} loading={loadingFromPubMed}>Get from pubmed</Button>
              </Flex>
              <Flex direction='row' align='flex-end'>
                <TextInput
                  label="DOI"
                  placeholder="10.nnnnnn/example"
                  required
                  {...form.getInputProps('reference.doi')}
                />
                <Button onClick={() => getInfoFromDoi(form.values.reference.doi)} loading={loadingFromDoi}>Get from DOI</Button>
              </Flex>

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
                label="Publisher"
                {...form.getInputProps('reference.publisher')}
                placeholder="Enter publisher"
              />
              <NumberInput
                label="Cohort"
                hideControls
                {...form.getInputProps('reference.cohort')}
              />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="validity">
            <Accordion.Control>Reference</Accordion.Control>
            <Accordion.Panel>
              <Flex direction='row' align='flex-end'>
                <TextInput
                  label="ROI Nomenclature"
                  required
                  {...form.getInputProps('validity.roi_nomenclature')}
                />
                <Button onClick={() => form.setFieldValue('validity.roi_nomenclature', 'NS')}>NS</Button>
              </Flex>
              <Stack>
                <Switch
                  label="Null Effects"
                  labelPosition="left"
                  {...form.getInputProps('validity.null_effects', { type: 'checkbox' })}
                />
                <Switch
                  label="Sham stimulation"
                  labelPosition="left"
                  {...form.getInputProps('validity.sham_stimulation', { type: 'checkbox' })}
                />
                <Switch
                  label="Control for After Discharge"
                  labelPosition="left"
                  {...form.getInputProps('validity.control_for_after_discharge', { type: 'checkbox' })}
                />
              </Stack>

              <label>Response characterization</label>
              <Stack>
                <Switch
                  label="Categorization methodology"
                  description="Is there a specific reference to a classification that was used?"
                  {...form.getInputProps('validity.response_characterization.cat_methodology', { type: 'checkbox' })} />
                <Switch
                  label="Replicability of response"
                  {...form.getInputProps('validity.response_characterization.replicability_of_response', { type: 'checkbox' })} />
                <Switch
                  label="Dose responsiveness"
                  {...form.getInputProps('validity.response_characterization.dose_responsiveness', { type: 'checkbox' })} />
                <Switch
                  label="Dissection of response category for each individual contacts sites (in bipolar stimulation)"
                  {...form.getInputProps('validity.response_characterization.dissection_of_response', { type: 'checkbox' })} />
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <NativeSelect
          label="Status"
          data={["À Faire", "Fait", "À Discutter"]}
          {...form.getInputProps('status')}
        />

        <Group position="right" mt="md">
          <Button type="submit">{mode === "create" ? "Create" : "Save"}</Button>
        </Group>
      </form>
    </Box>
  )
}

export interface CreateFormValues {
  reference: {
    author: string
    date: string
    publisher: string
    doi: string
    title: string
    cohort: number
  },
  status: "À Faire" | "Fait" | "À Discutter",
  validity: {
    roi_nomenclature: string;
    null_effects: boolean;
    sham_stimulation: boolean;
    control_for_after_discharge: boolean;
    response_characterization: {
      cat_methodology: boolean;
      replicability_of_response: boolean;
      dose_responsiveness: boolean;
      dissection_of_response: boolean;
    }
  }
}

interface CreateSourceFormProps {
  onSubmit: (values: CreateFormValues) => void;
  mode: "edit" | "create";
  edit_source?: SourceDdo;
}
