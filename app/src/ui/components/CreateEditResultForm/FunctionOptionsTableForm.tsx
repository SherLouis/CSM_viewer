import { UseFormReturnType } from "@mantine/form";
import { CreateEditResultFormValues } from "./CreateEditResultForm";
import { ActionIcon, Table, TextInput } from "@mantine/core";
import ColumnButtonSelect from "./ColumnButtonSelect";
import { useState } from "react";
import { FunctionDdo } from "../../models/FunctionDdo";
import { IconX } from "@tabler/icons-react";

const FunctionOptionsTableForm = ({ form, onSelect, functions }: FunctionOptionsTableFormProps) => {
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [characteristic, setCharacteristic] = useState("");


    const getFunctionOptions = (level: 'category' | 'subcategory' | 'characteristic') => {
        switch (level) {
            case 'category':
                return functions.filter((func) => func.level == level).map((func) => func.category);
            case 'subcategory':
                return functions.filter((func) => func.level == level
                    && func.category == category).map((func) => func.subcategory);
            case 'characteristic':
                return functions.filter((func) => func.level == level
                    && func.category == category
                    && func.subcategory == subcategory).map((func) => func.characteristic);
        }
    }

    const handleSelect = (level: 'category' | 'subcategory' | 'characteristic', value: string) => {
        switch (level) {
            case 'category':
                setCategory(value);
                onSelect('function.category', value);
                break;

            case 'subcategory':
                setSubcategory(value);
                onSelect('function.category', category);
                onSelect('function.subcategory', value);
                break;

            case 'characteristic':
                setCharacteristic(value);
                onSelect('function.category', category);
                onSelect('function.subcategory', subcategory);
                onSelect('function.characteristic', value);
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
                                form.values.function.category !== "" &&
                                <ActionIcon onClick={() => form.setFieldValue('function.category', "")}>
                                    <IconX />
                                </ActionIcon>
                            }
                            {...form.getInputProps('function.category')}
                        />
                    </td>
                    <td>
                        <TextInput
                            size="md"
                            placeholder="Insert some value here"
                            rightSection={
                                form.values.function.subcategory !== "" &&
                                <ActionIcon onClick={() => form.setFieldValue('function.subcategory', "")}>
                                    <IconX />
                                </ActionIcon>
                            }
                            {...form.getInputProps('function.subcategory')}
                        />
                    </td>
                    <td>
                        <TextInput
                            size="md"
                            placeholder="Insert some value here"
                            rightSection={
                                form.values.function.characteristic !== "" &&
                                <ActionIcon onClick={() => form.setFieldValue('function.characteristic', "")}>
                                    <IconX />
                                </ActionIcon>
                            }
                            {...form.getInputProps('function.characteristic')}
                        />
                    </td>
                </tr>
                <tr key={"options"}>
                    <td valign="top">
                        <ColumnButtonSelect
                            data={getFunctionOptions('category')}
                            onChange={(v) => handleSelect('category', v)}
                            selectedValues={form.values.function.category.split(';')}
                        />
                    </td>
                    <td valign="top">
                        <ColumnButtonSelect
                            data={getFunctionOptions('subcategory')}
                            onChange={(v) => handleSelect('subcategory', v)}
                            selectedValues={form.values.function.subcategory.split(';')}
                        />
                    </td>
                    <td valign="top">
                        <ColumnButtonSelect
                            data={getFunctionOptions('characteristic')}
                            onChange={(v) => handleSelect('characteristic', v)}
                            selectedValues={form.values.function.characteristic.split(';')}
                        />
                    </td>
                </tr>
            </tbody>
        </Table>
    );
}

export default FunctionOptionsTableForm;

interface FunctionOptionsTableFormProps {
    form: UseFormReturnType<CreateEditResultFormValues>;
    onSelect: (form_path: string, value: string) => void;
    functions: FunctionDdo[];
}