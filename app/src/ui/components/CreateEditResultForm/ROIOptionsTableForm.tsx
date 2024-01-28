import { UseFormReturnType } from "@mantine/form";
import { CreateEditResultFormValues } from "./CreateEditResultForm";
import { Table, TextInput } from "@mantine/core";
import ColumnButtonSelect from "./ColumnButtonSelect";
import { useState } from "react";
import { ROIDdo } from "../../models/ROIDdo";

const ROIOptionsTableForm = ({ form, onSelect, rois }: ROIOptionsTableFormProps) => {
    // TODO: make this a generic component
    const [lobe, setLobe] = useState("");
    const [region, setRegion] = useState("");
    const [area, setArea] = useState("");

    const getRoiOptions = (level: 'lobe' | 'region' | 'area') => {
        switch (level) {
            case 'lobe':
                return rois.filter((roi) => roi.level == level).map((roi) => roi.lobe);
            case 'region':
                return rois.filter((roi) => roi.level == level
                    && roi.lobe == lobe).map((roi) => roi.region);
            case 'area':
                return rois.filter((roi) => roi.level == level
                    && roi.lobe == lobe && roi.region == region).map((roi) => roi.area);
            default:
                return [];
        }
    }

    const handleSelect = (level: 'lobe' | 'region' | 'area', value: string) => {
        switch (level) {
            case 'lobe':
                onSelect('roi.lobe', value);
                break;

            case 'region':
                onSelect('roi.lobe', lobe);
                onSelect('roi.region', value);
                break;

            case 'area':
                onSelect('roi.lobe', lobe);
                onSelect('roi.region', region);
                onSelect('roi.area', value);
                break
        }
    }

    return (
        <Table sx={{ tableLayout: 'fixed', width: "100%", border: 0 }}>
            <thead>
                <tr>
                    <th>Lobe</th>
                    <th>Region</th>
                    <th>Area</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <TextInput
                            size="md"
                            placeholder="Insert some value here"
                            {...form.getInputProps('roi.lobe')}
                        />
                    </td>
                    <td>
                        <TextInput
                            size="md"
                            placeholder="Insert some value here"
                            {...form.getInputProps('roi.region')}
                        />
                    </td>
                    <td>
                        <TextInput
                            size="md"
                            placeholder="Insert some value here"
                            {...form.getInputProps('roi.area')}
                        />
                    </td>
                </tr>
                <tr key={"options"}>
                    <td valign="top">
                        <ColumnButtonSelect
                            data={getRoiOptions('lobe')}
                            onChange={(v) => setLobe(v)}
                            onSelect={(v) => handleSelect('lobe', v)}
                        />
                    </td>
                    <td valign="top">
                        <ColumnButtonSelect
                            data={getRoiOptions('region')}
                            onChange={(v) => setRegion(v)}
                            onSelect={(v) => handleSelect('region', v)}
                        />
                    </td>
                    <td valign="top">
                        <ColumnButtonSelect
                            data={getRoiOptions('area')}
                            onChange={(v) => setArea(v)}
                            onSelect={(v) => handleSelect('area', v)}
                        />
                    </td>
                </tr>
            </tbody>
        </Table>
    );
}

export default ROIOptionsTableForm;

interface ROIOptionsTableFormProps {
    form: UseFormReturnType<CreateEditResultFormValues>;
    onSelect: (form_path: string, value: string) => void;
    rois: ROIDdo[];
}