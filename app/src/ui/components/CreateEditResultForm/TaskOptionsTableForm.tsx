import { UseFormReturnType } from "@mantine/form";
import { CreateEditResultFormValues } from "./CreateEditResultForm";
import { Table, TextInput } from "@mantine/core";
import ColumnButtonSelect from "./ColumnButtonSelect";
import { useState } from "react";
import { TaskDdo } from "../../models/TaskDdo";

const TaskOptionsTableForm = ({ form, onSelect, tasks }: TaskOptionsTableFormProps) => {
    // TODO: make this a generic component
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
                onSelect('task.category', value);
                break;

            case 'subcategory':
                onSelect('task.category', category);
                onSelect('task.subcategory', value);
                break;

            case 'characteristic':
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
                            {...form.getInputProps('task.category')}
                        />
                    </td>
                    <td>
                        <TextInput
                            size="md"
                            placeholder="Insert some value here"
                            {...form.getInputProps('task.subcategory')}
                        />
                    </td>
                    <td>
                        <TextInput
                            size="md"
                            placeholder="Insert some value here"
                            {...form.getInputProps('task.characteristic')}
                        />
                    </td>
                </tr>
                <tr key={"options"}>
                    <td valign="top">
                        <ColumnButtonSelect
                            data={getTaskOptions('category')}
                            onChange={(v) => setCategory(v)}
                            onSelect={(v) => handleSelect('category', v)}
                        />
                    </td>
                    <td valign="top">
                        <ColumnButtonSelect
                            data={getTaskOptions('subcategory')}
                            onChange={(v) => setSubcategory(v)}
                            onSelect={(v) => handleSelect('subcategory', v)}
                        />
                    </td>
                    <td valign="top">
                        <ColumnButtonSelect
                            data={getTaskOptions('characteristic')}
                            onChange={(v) => setCharacteristic(v)}
                            onSelect={(v) => handleSelect('characteristic', v)}
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