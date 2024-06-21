import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const jsonServerApi = createApi({
    reducerPath: "jsonServerApi",
    baseQuery: fetchBaseQuery({baseUrl: "http://localhost:3000"}),
    tagTypes: ["Tasks"],
    endpoints: (builder) => ({
        getTasks: builder.query({
            query: () => '/tasks',
            transformResponse: (tasks) => tasks.reverse(),
            providesTags: ["Tasks"]
        }),
        addTask: builder.mutation({
            query: (task) => ({
                url: '/tasks',
                method: "POST",
                body: task
            }),
            invalidatesTags: ["Tasks"]
        }),
        updateTask: builder.mutation({
            query: ({id, ...updatedTask}) => ({
                url: `/tasks/${id}`,
                method: "PATCH",
                body: updatedTask
            }),
            invalidatesTags: ["Tasks"],
            async onQueryStarted({id, ...updatedTask}, {dispatch, queryFulfilled}) {
                const patchResult = dispatch(jsonServerApi.util.updateQueryData("getTasks", undefined, (taskList) => {
                    const taskIndex = taskList.findIndex(item => item.id === id);
                    taskList[taskIndex] = {...taskList[taskIndex], ...updatedTask}
                }))

                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            }
        }),
        deleteTask: builder.mutation({
            query: (id) => ({
                url: `/tasks/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Tasks"],
            async onQueryStarted(id, {dispatch, queryFulfilled}) {
                const patchResult = dispatch(
                    jsonServerApi.util.updateQueryData("getTasks", undefined, (tasksList) => {
                        const taskIndex = tasksList.findIndex((el) => el.id === id);
                        tasksList.splice(taskIndex, 1);
                    }),
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        })
    })
})

export const {useGetTasksQuery, useAddTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation} = jsonServerApi