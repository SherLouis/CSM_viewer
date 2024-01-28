import { UseFormReturnType } from "@mantine/form";
import { CreateEditResultFormValues } from "./CreateEditResultForm";
import { Table, TextInput } from "@mantine/core";
import ColumnButtonSelect from "./ColumnButtonSelect";
import { useState } from "react";
import { EffectDdo } from "../../models/EffectDdo";

const EffectOptionsTableForm = ({ form, onSelect, effects }: EffectOptionsTableFormProps) => {
    // TODO: make this a generic component
    const [eclass, setClass] = useState("");
    const [descriptor, setDescriptor] = useState("");
    const [details, setDetails] = useState("");

    const getEffectOptions = (level: 'class' | 'descriptor' | 'details') => {
        switch (level) {
            case 'class':
                return effects.filter((effect) => effect.level == level).map((effect) => effect.class);
            case 'descriptor':
                return effects.filter((effect) => effect.level == level
                    && effect.class == eclass).map((effect) => effect.descriptor);
            case 'details':
                return effects.filter((effect) => effect.level == level
                    && effect.class == eclass
                    && effect.descriptor == descriptor).map((effect) => effect.details);
            default:
                return [];
        }
    }

    const handleSelect = (level: 'class' | 'descriptor' | 'details', value: string) => {
        switch (level) {
            case 'class':
                onSelect('effect.class', value);
                break;

            case 'descriptor':
                onSelect('effect.class', eclass);
                onSelect('effect.descriptor', value);
                break;

            case 'details':
                onSelect('effect.class', eclass);
                onSelect('effect.descriptor', descriptor);
                onSelect('effect.details', value);
                break
        }
    }

    return (
        <Table sx={{ tableLayout: 'fixed', width: "100%", border: 0 }}>
            <thead>
                <tr>
                    <th>Class</th>
                    <th>Descriptor</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <TextInput
                            size="md"
                            placeholder="Insert some value here"
                            {...form.getInputProps('effect.class')}
                        />
                    </td>
                    <td>
                        <TextInput
                            size="md"
                            placeholder="Insert some value here"
                            {...form.getInputProps('effect.descriptor')}
                        />
                    </td>
                    <td>
                        <TextInput
                            size="md"
                            placeholder="Insert some value here"
                            {...form.getInputProps('effect.details')}
                        />
                    </td>
                </tr>
                <tr key={"options"}>
                    <td valign="top">
                        <ColumnButtonSelect
                            data={getEffectOptions('class')}
                            onChange={(v) => setClass(v)}
                            onSelect={(v) => handleSelect('class', v)}
                        />
                    </td>
                    <td valign="top">
                        <ColumnButtonSelect
                            data={getEffectOptions('descriptor')}
                            onChange={(v) => setDescriptor(v)}
                            onSelect={(v) => handleSelect('descriptor', v)}
                        />
                    </td>
                    <td valign="top">
                        <ColumnButtonSelect
                            data={getEffectOptions('details')}
                            onChange={(v) => setDetails(v)}
                            onSelect={(v) => handleSelect('details', v)}
                        />
                    </td>
                </tr>
            </tbody>
        </Table>
    );
}

export default EffectOptionsTableForm;

interface EffectOptionsTableFormProps {
    form: UseFormReturnType<CreateEditResultFormValues>;
    onSelect: (form_path: string, value: string) => void;
    effects: EffectDdo[];
}