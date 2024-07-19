import { GAME, GAMES_LIST } from "./actions";


const initialState = {
    games: [],
    game: {},
    user: []
}

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case GAMES_LIST: {
            return {
                ...state,
                games: action.payload
            }
        }

        case GAME: {
            return {
                ...state,
                game: action.payload
            }
        }

        default: {
            return { ...state }
        }
    }

}

export default reducer;