import { Accordion, Button, Title} from '@mantine/core';
import BasePage from '../../components/BasePage/basePage'


const buttonClicked = async () => {
    const response = await window.electronAPI.getSystemInfo("test")
    console.log(response)
}

export default function CreatePage() {
  return (
    <BasePage title='Insert new data'>
      <Accordion defaultValue='reference'>
        <Accordion.Item value='reference'>
          <Accordion.Control>{<Title order={2}>Reference</Title>}</Accordion.Control>
          <Accordion.Panel>{<Button onClick={buttonClicked}>Click me!</Button>}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value='test'>
          <Accordion.Control>{<Title order={2}>Test</Title>}</Accordion.Control>
          <Accordion.Panel>{<Button onClick={buttonClicked}>Click me!</Button>}</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </BasePage>
    );
}
