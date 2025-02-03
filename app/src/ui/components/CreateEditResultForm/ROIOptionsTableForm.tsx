import { UseFormReturnType } from "@mantine/form";
import { CreateEditResultFormValues } from "./CreateEditResultForm";
import { ActionIcon, Table, TextInput } from "@mantine/core";
import ColumnButtonSelect from "./ColumnButtonSelect";
import { useState } from "react";
import { ROIDdo } from "../../models/ROIDdo";
import { IconX } from "@tabler/icons-react";

const ROIOptionsTableForm = ({ form, onSelect, rois }: ROIOptionsTableFormProps) => {
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
                setLobe(value)
                onSelect('roi.lobe', value);
                break;

            case 'region':
                setRegion(value)
                onSelect('roi.lobe', lobe);
                onSelect('roi.region', value);
                break;

            case 'area':
                setArea(value)
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
                            rightSection={
                                form.values.roi.lobe !== "" &&
                                <ActionIcon onClick={() => form.setFieldValue('roi.lobe', "")}>
                                    <IconX />
                                </ActionIcon>
                            }
                            {...form.getInputProps('roi.lobe')}
                        />
                    </td>
                    <td>
                        <TextInput
                            size="md"
                            placeholder="Insert some value here"
                            rightSection={
                                form.values.roi.region !== "" &&
                                <ActionIcon onClick={() => form.setFieldValue('roi.region', "")}>
                                    <IconX />
                                </ActionIcon>
                            }
                            {...form.getInputProps('roi.region')}
                        />
                    </td>
                    <td>
                        <TextInput
                            size="md"
                            placeholder="Insert some value here"
                            rightSection={
                                form.values.roi.area !== "" &&
                                <ActionIcon onClick={() => form.setFieldValue('roi.area', "")}>
                                    <IconX />
                                </ActionIcon>
                            }
                            {...form.getInputProps('roi.area')}
                        />
                    </td>
                </tr>
                <tr key={"options"}>
                    <td valign="top">
                        <ColumnButtonSelect
                            data={getRoiOptions('lobe')}
                            onChange={(v) => handleSelect('lobe', v)}
                            selectedValues={form.values.roi.lobe.split(';')}
                        />
                    </td>
                    <td valign="top">
                        <ColumnButtonSelect
                            data={getRoiOptions('region')}
                            onChange={(v) => handleSelect('region', v)}
                            selectedValues={form.values.roi.region.split(';')}
                        />
                    </td>
                    <td valign="top">
                        <ColumnButtonSelect
                            data={getRoiOptions('area')}
                            onChange={(v) => handleSelect('area', v)}
                            selectedValues={form.values.roi.area.split(';')}
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