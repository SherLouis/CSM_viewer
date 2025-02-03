import { UseFormReturnType } from "@mantine/form";
import { CreateEditResultFormValues } from "./CreateEditResultForm";
import { ActionIcon, Table, TextInput } from "@mantine/core";
import ColumnButtonSelect from "./ColumnButtonSelect";
import { useState } from "react";
import { TaskDdo } from "../../models/TaskDdo";
import { IconX } from "@tabler/icons-react";

const TaskOptionsTableForm = ({ form, onSelect, tasks }: TaskOptionsTableFormProps) => {
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [characteristic, setCharacteristic] = useState("");

    const getTaskOptions = (level: 'category' | 'subcategory' | 'characteristic') => {
        switch (level) {
            case 'category':
                return tasks.filter((task) => task.level == level).map((task) => task.category);
            case 'subcategory':
                return tasks.filter((task) => task.level == level
                    && task.category == category).map((task) => task.subcategory);
            case 'characteristic':
                return tasks.filter((task) => task.level == level
                    && task.category == category
                    && task.subcategory == subcategory).map((task) => task.characteristic);
            default:
                return [];
        }
    }

    const handleSelect = (level: 'category' | 'subcategory' | 'characteristic', value: string) => {
        switch (level) {
            case 'category':
                setCategory(value);
                onSelect('task.category', value);
                break;

            case 'subcategory':
                setSubcategory(value);
                onSelect('task.category', category);
                onSelect('task.subcategory', value);
                break;

            case 'characteristic':
                setCharacteristic(value);
                onSelect('task.category', category);
                onSelect('task.subcategory', subcategory);
                onSelect('task.characteristic', value);
                break
        }
    }

    return (
        <Table sx={{ tableLayout: 'fixed', width: "100%", border: 0 }}>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Subcategory</th>
                    <th>Characteristic</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <TextInput
                            size="md"
                            placeholder="Insert some value here"
                            rightSection={
                                form.values.task.category !== "" &&
                                <ActionIcon onClick={() => form.setFieldValue('task.category', "")}>
                                    <IconX />
                                </ActionIcon>
                            }
                            {...form.getInputProps('task.category')}
                        />
                    </td>
                    <td>
                        <TextInput
                            size="md"
                            placeholder="Insert some value here"
                            rightSection={
                                form.values.task.subcategory !== "" &&
                                <ActionIcon onClick={() => form.setFieldValue('task.subcategory', "")}>
                                    <IconX />
                                </ActionIcon>
                            }
                            {...form.getInputProps('task.subcategory')}
                        />
                    </td>
                    <td>
                        <TextInput
                            size="md"
                            placeholder="Insert some value here"
                            rightSection={
                                form.values.task.characteristic !== "" &&
                                <ActionIcon onClick={() => form.setFieldValue('task.characteristic', "")}>
                                    <IconX />
                                </ActionIcon>
                            }
                            {...form.getInputProps('task.characteristic')}
                        />
                    </td>
                </tr>
                <tr key={"options"}>
                    <td valign="top">
                        <ColumnButtonSelect
                            data={getTaskOptions('category')}
                            onChange={(v) => handleSelect('category', v)}
                            selectedValues={form.values.task.category.split(';')}
                        />
                    </td>
                    <td valign="top">
                        <ColumnButtonSelect
                            data={getTaskOptions('subcategory')}
                            onChange={(v) => handleSelect('subcategory', v)}
                            selectedValues={form.values.task.subcategory.split(';')}
                        />
                    </td>
                    <td valign="top">
                        <ColumnButtonSelect
                            data={getTaskOptions('characteristic')}
                            onChange={(v) => handleSelect('characteristic', v)}
                            selectedValues={form.values.task.characteristic.split(';')}
                        />
                    </td>
                </tr>
            </tbody>
        </Table>
    );
}

export default TaskOptionsTableForm;

interface TaskOptionsTableFormProps {
    form: UseFormReturnType<CreateEditResultFormValues>;
    onSelect: (form_path: string, value: string) => void;
    tasks: TaskDdo[];
}