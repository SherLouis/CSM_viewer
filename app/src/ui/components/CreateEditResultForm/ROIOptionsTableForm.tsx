import { UseFormReturnType } from "@mantine/form";
import { CreateEditResultFormValues } from "./CreateEditResultForm";
import { ActionIcon, Select, SelectItem, Table, TextInput } from "@mantine/core";
import { ROIDdo } from "../../models/ROIDdo";
import { IconX } from "@tabler/icons-react";

const ROIOptionsTableForm = ({ form, rois }: ROIOptionsTableFormProps) => {
    const maskConversionMethodOptions: SelectItem[] = [
        { label: "Standard nomenclature", value: "standard_nomenclature" },
        { label: "Reviewer's approximation from a figure", value: "approx_from_figure" },
        { label: "Reviewer's approximation from text", value: "approx_from_text" },
        { label: "Exact (MNI)", value: "exact" }
    ];

    // TODO: searchable description + show options with count
    // TODO: mask options from choices if exist
    // TODO: update roi options if inserted or updated result roi is not in existing ...
    console.debug(rois);
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
                        <TextInput
                            size="md"
                            placeholder="How is the ROI described"
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
                        <TextInput
                            size="md"
                            placeholder="ROI mask reference"
                            rightSection={
                                form.values.roi.mask !== "" &&
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
                            label="Mask conversion method"
                            clearable
                            data={maskConversionMethodOptions}
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