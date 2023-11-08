import { Box, TextInput, Group, Flex, Button, Accordion, NativeSelect, NumberInput } from "@mantine/core"
import { useForm } from '@mantine/form';
const citejs = require('@citation-js/core')
require('@citation-js/plugin-pubmed')
import { useCallback, useState } from "react";
import { SourceDdo, SourceSummaryDdo } from "../../models/SourceDdo";

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
        title: edit_source != null ? edit_source.title : '',
        cohort: edit_source != null ? edit_source.cohort : 0,
      },
      status: edit_source != null ? edit_source.state : "À Faire"
    } as CreateFormValues,
    validate: {
      reference: {
        date: (value) => (value === '' || /^\d{4}\/\d{2}\/\d{2}$/.test(value) ? null : 'Invalid date format')
      }
    },
  });

  const getInfoFromPubMedId = useCallback((id: string) => {
    setLoadingFromPubMed(true);
    citejs.Cite.async(id, { forceType: '@pubmed/id' })
      .then(
        (cite: any) => {
          console.log(cite);
          const doi = cite.data[0].DOI;
          const author = cite.data[0].author[0];
          const location = cite.data[0]['publisher-place'];
          const title = cite.data[0].title;
          const _date = cite.data[0].issued['date-parts'][0]
          const date = String(_date[0]) + '/' + String(_date[1]).padStart(2, '0') + '/' + String(_date[2]).padStart(2, '0')
          form.setFieldValue('reference.doi', doi);
          form.setFieldValue('reference.author', author.family + ',' + author.given);
          form.setFieldValue('reference.location', location);
          form.setFieldValue('reference.title', title);
          form.setFieldValue('reference.date', date);
          setLoadingFromPubMed(false);
        },
        (reason: any) => { console.error(reason); setLoadingFromPubMed(false) })
  }, [])

  const [pubMedId, setPubMedId] = useState<string>();
  const [loadingFromPubMed, setLoadingFromPubMed] = useState<boolean>(false);

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
                <Flex direction='row' align='flex-end'>
                  <TextInput
                    label="PubMed ID"
                    name="pubmedId"
                    placeholder="Paste PubMed ID here to try to autofill reference fields"
                    onChange={(e) => setPubMedId(e.target.value)}
                  />
                  <Button onClick={() => getInfoFromPubMedId(pubMedId)} loading={loadingFromPubMed}>Get from pubmed</Button>
                </Flex>

              }
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
                label="Publisher"
                {...form.getInputProps('reference.publisher')}
                placeholder="Enter publisher"
              />
              <TextInput
                label="Location"
                {...form.getInputProps('reference.location')}
                placeholder="Enter location"
              />
              <NumberInput
                label="Cohort"
                hideControls
                {...form.getInputProps('reference.cohort')}
              />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <NativeSelect
          label="Status"
          data = {["À Faire", "Fait", "À Discutter"]}
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
    type: "article" | "experimental" | "other"
    author: string
    date: string
    publisher: string
    location: string
    doi: string
    title: string
    cohort: number
  },
  status: "À Faire" | "Fait" | "À Discutter"
}

interface CreateSourceFormProps {
  onSubmit: (values: CreateFormValues) => void;
  mode: "edit" | "create";
  edit_source?: SourceDdo;
}
