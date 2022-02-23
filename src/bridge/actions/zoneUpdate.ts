import type { Bridge } from '../Bridge';
import { Events } from '../../util/Events';
import type { ApiZone } from '../../types/api';

export default function zoneUpdate(bridge: Bridge, data: ApiZone) {
	const zone = bridge.zones.cache.get(data.id);
	if (zone) {
		const old = zone._update(data);
		bridge.emit(Events.ZoneUpdate, old, zone);
	}
}
