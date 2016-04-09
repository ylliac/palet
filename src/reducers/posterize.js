import { RUN_DETECTION } from '../constants/PaletActionTypes';

module.exports.type = RUN_DETECTION;

export default function apply(state, action){
	return state
		.set('image', state.get('image').posterize(3));
}
