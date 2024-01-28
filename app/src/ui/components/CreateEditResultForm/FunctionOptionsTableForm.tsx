import { UseFormReturnType } from "@mantine/form";
import { CreateEditResultFormValues } from "./CreateEditResultForm";
import { Table, TextInput } from "@mantine/core";
import ColumnButtonSelect from "./ColumnButtonSelect";
import { useState } from "react";
import { FunctionDdo } from "../../models/FunctionDdo";

const FunctionOptionsTableForm = ({ form, onSelect, functions }: FunctionOptionsTableFormProps) => {
    // TODO: make this a generic component
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
                onSelect('function.category', value);
                break;

            case 'subcategory':
                onSelect('function.category', category);
                onSelect('function.subcategory', value);
                break;

            case 'characteristic':
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
                            {...form.getInputProps('function.category')}
                        />
                    </td>
                    <td>
                        <TextInput
                            size="md"
                            placeholder="Insert some value here"
                            {...form.getInputProps('function.subcategory')}
                        />
                    </td>
                    <td>
                        <TextInput
                            size="md"
                            placeholder="Insert some value here"
                            {...form.getInputProps('function.characteristic')}
                        />
                    </td>
                </tr>
                <tr key={"options"}>
                    <td valign="top">
                        <ColumnButtonSelect
                            data={getFunctionOptions('category')}
                            onChange={(v) => setCategory(v)}
                            onSelect={(v) => handleSelect('category', v)}
                        />
                    </td>
                    <td valign="top">
                        <ColumnButtonSelect
                            data={getFunctionOptions('subcategory')}
                            onChange={(v) => setSubcategory(v)}
                            onSelect={(v) => handleSelect('subcategory', v)}
                        />
                    </td>
                    <td valign="top">
                        <ColumnButtonSelect
                            data={getFunctionOptions('characteristic')}
                            onChange={(v) => setCharacteristic(v)}
                            onSelect={(v) => handleSelect('characteristic', v)}
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