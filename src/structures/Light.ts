import type { TemperatureLight } from './TemperatureLight';
import type { ColorLight } from './ColorLight';
import type { DimmableLight } from './DimmableLight';
import type { GradientLight } from './GradientLight';
import { Resource, ResourceType } from './Resource';
import { LightCapabilities } from './LightCapabilities';
import type { DeepPartial, TransitionOptions } from '../types/common';
import { LightZoneManager } from '../managers/LightZoneManager';
import type { ApiLight } from '../types/api';
import { Routes } from '../util/Routes';
import type { Room } from './Room';
import type { Bridge } from '../bridge/Bridge';
import { Util } from '../util/Util';

export type LightResolvable = Light | string;

export interface LightStateOptions {
	on?: boolean;
}

export class Light extends Resource<ApiLight> {
	type = ResourceType.Light;
	public capabilities: LightCapabilities;
	public zones: LightZoneManager;

	constructor(bridge: Bridge) {
		super(bridge);
		this.capabilities = new LightCapabilities(this);
		this.zones = new LightZoneManager(this);
	}

	get id(): string {
		return this.data.id;
	}

	get name(): string {
		return this.data.metadata?.name;
	}

	get room(): Room {
		return this.bridge.rooms.cache.find((room) => room.lights.cache.has(this.id));
	}

	get roomId(): string {
		return this.room?.id;
	}

	get on(): boolean {
		return this.data.on?.on;
	}

	public async state(state: LightStateOptions, transition?: TransitionOptions): Promise<void> {
		await this._edit(Util.parseLightStateOptions(state, this), transition);
	}

	public isDimmable(): this is DimmableLight | TemperatureLight | ColorLight | GradientLight {
		return Boolean(
			[
				ResourceType.DimmableLight,
				ResourceType.TemperatureLight,
				ResourceType.ColorLight,
				ResourceType.GradientLight,
			].includes(this.type),
		);
	}

	public isTemperature(): this is TemperatureLight | ColorLight | GradientLight {
		return Boolean(
			[ResourceType.TemperatureLight, ResourceType.ColorLight, ResourceType.GradientLight].includes(this.type),
		);
	}

	public isColor(): this is ColorLight | GradientLight {
		return Boolean([ResourceType.ColorLight, ResourceType.GradientLight].includes(this.type));
	}

	public isGradient(): this is GradientLight {
		return Boolean(this.type === ResourceType.GradientLight);
	}

	protected async _edit(data: DeepPartial<ApiLight>, transition?: TransitionOptions): Promise<void> {
		console.log(data);
		await this.bridge.lights.rest.put(Routes.light(this.id), {
			...data,
			dynamics: { duration: transition?.duration },
		});
	}
}
