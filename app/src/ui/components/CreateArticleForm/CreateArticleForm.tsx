import { Box, TextInput, Checkbox, Group, Button } from "@mantine/core"
import { useForm } from '@mantine/form';

export const CreateArticleForm = ({ onSubmit }: CreateArticleFormProps) => {
  const form = useForm({
    initialValues: { email: '', name: '' } as CreateFormValues,
    validate: {
      email: (value) => /^\S+@\S+$/.test(value)? null : 'Invalid email',
    }
  });

  const handleSubmit = (values: CreateFormValues) => {
    form.validate();
    console.log(form.errors);
    onSubmit(values);
  }

  return (
    <Box maw={300} mx="auto">
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />

        <TextInput
          mt="md"
          label="Name"
          {...form.getInputProps('name')}
        />

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  )
}

export interface CreateFormValues {
  // TODO
  name: string;
  email: string;
}

interface CreateArticleFormProps {
  onSubmit: (values: CreateFormValues) => void;
}
