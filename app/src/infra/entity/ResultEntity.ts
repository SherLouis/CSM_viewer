import { Result } from "../../core/models/Result"

export type ReadResultEntity = {
    id: number,
    source_id: number,
    roi_side: string,
    roi_lobe: string,
    roi_gyrus: string,
    roi_sub: string,
    roi_precision: string,
    stim_amp_ma: number,
    stim_amp_ma_max: number,
    stim_freq: number,
    stim_freq_max: number,
    stim_duration: number,
    stim_duration_max: number,
    stim_electrode_make: string,
    stim_implentation_type: string,
    stim_contact_separation: number,
    stim_contact_diameter: number,
    stim_contact_length: number,
    stim_phase_length: number,
    stim_phase_type: string,
    effect_category: string,
    effect_semiology: string,
    effect_characteristic: string,
    effect_post_discharge: number,
    effect_lateralization: string,
    effect_dominant: string,
    effect_body_part: string,
    effect_comments: string,
    task_category: string,
    task_subcategory: string,
    task_characteristic: string,
    task_comments: string,
    function_category: string,
    function_subcategory: string,
    function_characteristic: string,
    function_comments: string,
    occurrences: number,
    comments: string,
    comments_2: string,
    precision_score: number,
}

export const ReadResultEntityToModel = (readEntity: ReadResultEntity): Result => {
    return {
        id: readEntity.id,
        source_id: readEntity.source_id,
        roi: {
            side: readEntity.roi_side,
            lobe: readEntity.roi_lobe,
            gyrus: readEntity.roi_gyrus,
            sub: readEntity.roi_sub,
            precision: readEntity.roi_precision
        },
        stimulation_parameters: {
            amplitude_ma: readEntity.stim_amp_ma,
            amplitude_ma_max: readEntity.stim_amp_ma_max,
            frequency_hz: readEntity.stim_freq,
            frequency_hz_max: readEntity.stim_freq_max,
            duration_s: readEntity.stim_duration,
            duration_s_max: readEntity.stim_duration_max,
            electrode_make: readEntity.stim_electrode_make,
            implentation_type: readEntity.stim_implentation_type,
            contact_separation: readEntity.stim_contact_separation,
            contact_diameter: readEntity.stim_contact_diameter,
            contact_length: readEntity.stim_contact_length,
            phase_length: readEntity.stim_phase_length,
            phase_type: readEntity.stim_phase_type
        },
        effect: {
            category: readEntity.effect_category,
            semiology: readEntity.effect_semiology,
            characteristic: readEntity.effect_characteristic,
            post_discharge: readEntity.effect_post_discharge > 0,
            lateralization: readEntity.effect_lateralization,
            dominant: readEntity.effect_dominant,
            body_part: readEntity.effect_body_part,
            comments: readEntity.effect_comments
        },
        task: {
            category: readEntity.task_category,
            subcategory: readEntity.task_subcategory,
            characteristic: readEntity.task_characteristic,
            comments: readEntity.task_comments
        },
        function: {
            category: readEntity.function_category,
            subcategory: readEntity.function_subcategory,
            characteristic: readEntity.function_characteristic,
            comments: readEntity.function_comments
        },
        occurrences: readEntity.occurrences,
        comments: readEntity.comments,
        comments_2: readEntity.comments_2,
        precision_score: readEntity.precision_score
    }
}