import { Result } from "../../core/models/Result"

export type ResultEntity = {
    id: number,
    source_id: number,
    roi_id: number,
    stim_amp_ma: number,
    stim_freq: number,
    stim_electrode_separation: number,
    stim_duration_ms: number,
    effect_id: number,
    effect_post_discharge: number,
    occurrences: number,
    comments: string
}

export type ReadResultEntity = {
    id: number,
    source_id: number,
    roi_lobe: string,
    roi_gyrus: string,
    roi_sub: string,
    roi_precision: string,
    stim_amp_ma: number,
    stim_freq: number,
    stim_electrode_separation: number,
    stim_duration_ms: number,
    effect_category: string,
    effect_semiology: string,
    effect_characteristic: string,
    effect_precision: string,
    effect_post_discharge: number,
    task_category: string,
    task_subcategory: string,
    task_characteristic: string,
    task_precision: string,
    function_category: string,
    function_subcategory: string,
    function_characteristic: string,
    function_precision: string,
    occurrences: number,
    comments: string
}

export const ReadResultEntityToModel = (readEntity: ReadResultEntity): Result => {
    return {
        id: readEntity.id,
        source_id: readEntity.source_id,
        roi: {
            lobe: readEntity.roi_lobe,
            gyrus: readEntity.roi_gyrus,
            sub: readEntity.roi_sub,
            precision: readEntity.roi_precision
        },
        stimulation_parameters: {
            amplitude_ma: readEntity.stim_amp_ma,
            frequency_hz: readEntity.stim_freq,
            electrode_separation_mm: readEntity.stim_electrode_separation,
            duration_s: readEntity.stim_duration_ms
        },
        effect: {
            category: readEntity.effect_category,
            semiology: readEntity.effect_semiology,
            characteristic: readEntity.effect_characteristic,
            precision: readEntity.effect_precision,
            post_discharge: readEntity.effect_post_discharge > 0
        },
        task: {
            category: readEntity.task_category,
            subcategory: readEntity.task_subcategory,
            characteristic: readEntity.task_characteristic,
            precision: readEntity.task_precision
        },
        function: {
            category: readEntity.function_category,
            subcategory: readEntity.function_subcategory,
            characteristic: readEntity.function_characteristic,
            precision: readEntity.function_precision
        },
        occurrences: readEntity.occurrences,
        comments: readEntity.comments
    }
}