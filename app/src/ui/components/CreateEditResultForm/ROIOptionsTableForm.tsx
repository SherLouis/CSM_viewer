import { UseFormReturnType } from "@mantine/form";
import { CreateEditResultFormValues } from "./CreateEditResultForm";
import { ActionIcon, Autocomplete, Select, SelectItem, Table, TextInput } from "@mantine/core";
import { ROIDdo } from "../../models/ROIDdo";
import { IconX } from "@tabler/icons-react";
import { useDebouncedState } from "@mantine/hooks";
import { useMemo } from "react";

const ROIOptionsTableForm = ({ form, rois }: ROIOptionsTableFormProps) => {
    const maskConversionMethodOptions: SelectItem[] = [
        { label: "Standard nomenclature", value: "standard_nomenclature" },
        { label: "Reviewer's approximation from a figure", value: "approx_from_figure" },
        { label: "Reviewer's approximation from text", value: "approx_from_text" },
        { label: "Exact (MNI)", value: "exact" }
    ];


    // TODO: mask options from choices if exist
    const roiMasksByDescription = useMemo(() => {
        return rois.reduce((map, { description, mask, count }) => {
            if (!map.has(description)) {
                map.set(description, { masks: new Set<string>(), total: 0 });
            }
            const entry = map.get(description)!;
            entry.masks.add(mask);
            entry.total += count;
            return map;
        }, new Map<string, { masks: Set<string>; total: number }>());
    }, [rois]);

    const descriptionAutoCompleteOptions = Array.from(roiMasksByDescription.entries())
        .sort((a, b) => b[1].total - a[1].total)
        .map(([description, { masks, total }]) => ({
            value: description,
            label: `${description} (${total} usages; ${masks.size} mask${masks.size > 1 ? "s" : ""})`,
        }));

    const getMaskOptions = () => {
        const masks = roiMasksByDescription.get(form.values.roi.description);
        return Array.from(masks?.masks ?? []);
    }

    return (
        <Table sx={{ tableLayout: 'fixed', width: "100%", border: 0 }}>
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Mask</th>
                    <th>Mask conversion method</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <Autocomplete
                            placeholder="How is the ROI described (choose or type)"
                            data={descriptionAutoCompleteOptions}
                            limit={5}
                            rightSection={
                                form.values.roi.description !== "" &&
                                <ActionIcon onClick={() => form.setFieldValue('roi.description', "")}>
                                    <IconX />
                                </ActionIcon>
                            }
                            {...form.getInputProps('roi.description')}
                        />
                    </td>
                    <td>
                        <Autocomplete
                            placeholder="ROI mask reference"
                            data={getMaskOptions()}
                            limit={5}
                            rightSection={
                                form.values.roi.description !== "" &&
                                <ActionIcon onClick={() => form.setFieldValue('roi.mask', "")}>
                                    <IconX />
                                </ActionIcon>
                            }
                            {...form.getInputProps('roi.mask')}
                        />
                    </td>
                    <td>
                        <Select
                            size="md"
                            data={maskConversionMethodOptions}
                            rightSection={
                                form.values.roi.mask !== "" &&
                                <ActionIcon onClick={() => form.setFieldValue('roi.mask', "")}>
                                    <IconX />
                                </ActionIcon>
                            }
                            {...form.getInputProps('roi.mask_conversion_method')}
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
    rois: ROIDdo[];
}