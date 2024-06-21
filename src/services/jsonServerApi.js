import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const jsonServerApi = createApi({
    reducerPath: "jsonServerApi",
    baseQuery: fetchBaseQuery({baseUrl: "http://localhost:3000/"}),
    tagTypes: ["Tasks"],
    endpoints: (builder) => ({
        getTasks: builder.query({
            query: () => 'tasks',
            transformResponse: (tasks) => tasks.reverse(),
            providesTags: ["Tasks"]
        }),
        addTask: builder.mutation({
            query: (task) => ({
                url: 'tasks',
                method: "POST",
                body: task
            }),
            invalidatesTags: ["Tasks"]
        })
    })
})

export const {useGetTasksQuery, useAddTaskMutation} = jsonServerApi