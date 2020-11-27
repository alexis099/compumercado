const defaultPublicacion = null;

export default function publicacionReducer(state = defaultPublicacion, { type, payload }) {
	switch(type) {
		case "obtenerPublicacionEditada":
			return payload;

		default:
			return state;
	}
}

