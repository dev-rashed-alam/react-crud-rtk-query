import {configureStore} from '@reduxjs/toolkit'
import {jsonServerApi} from "../services/jsonServerApi.js";

export const store = configureStore({
    reducer: {
        [jsonServerApi.reducerPath]: jsonServerApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(jsonServerApi.middleware)
})