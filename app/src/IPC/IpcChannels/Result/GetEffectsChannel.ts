import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "../../IpcChannelInterface";
import { IpcRequest } from "../../IpcRequest";
import { EffectDto, EffectDtoMapper } from "../../dtos/EffectDto";
import { ResultService } from "../../../core/services/ResultService";

export class GetEffectsChannel implements IpcChannelInterface {
  constructor(
    private service : ResultService
  ) {}

  getName(): string {
    return 'results:getEffects';
  }

  handle(_event: IpcMainEvent, request: IpcRequest): EffectDto[] {
    console.log('Handling request on channel %s', this.getName())
    var effects = this.service.getEffects();
    var effectsDto = effects.map((effect) => EffectDtoMapper.ModelToDto(effect));
    return effectsDto;
  }
}