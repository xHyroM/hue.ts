import type { Bridge } from '../Bridge';
import { Events } from '../../util/Events';
import type { ApiScene } from '../../types/api';

export default function sceneUpdate(bridge: Bridge, data: ApiScene) {
	const scene = bridge.scenes.cache.get(data.id);
	if (scene) {
		const old = scene._update(data);
		bridge.emit(Events.SceneUpdate, old, scene);
	}
}
