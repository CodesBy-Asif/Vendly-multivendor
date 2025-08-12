import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    events: [],
    loading: false,
    error: null,
    success: false, // for create or update event success
};

export const eventsReducer = createReducer(initialState, (builder) => {
    builder

        // FETCH EVENTS
        .addCase("FetchEventsRequest", (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase("FetchEventsSuccess", (state, action) => {
            state.events = action.payload;
            state.loading = false;
            state.error = null;
        })
        .addCase("FetchEventsFail", (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to fetch events";
        })

        // CREATE EVENT
        .addCase("CreateEventRequest", (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        })
        .addCase("CreateEventSuccess", (state, action) => {
            state.loading = false;
            state.events.unshift(action.payload); // add to top
            state.success = true;
        })
        .addCase("CreateEventFail", (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to create event";
            state.success = false;
        })

        // UPDATE EVENT
        .addCase("UpdateEventRequest", (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        })
        .addCase("UpdateEventSuccess", (state, action) => {
            state.loading = false;
            state.success = true;

            const index = state.events.findIndex(
                (event) => event._id === action.payload._id
            );
            if (index !== -1) {
                state.events[index] = action.payload;
            }
        })
        .addCase("UpdateEventFail", (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to update event";
            state.success = false;
        })

        // DELETE EVENT
        .addCase("DeleteEventRequest", (state) => {
            state.loading = true;
        })
        .addCase("DeleteEventSuccess", (state, action) => {
            state.loading = false;
            state.events = state.events.filter((event) => event._id !== action.payload);
        })
        .addCase("DeleteEventFail", (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to delete event";
        })

        // RESET
        .addCase("ResetEvents", () => initialState);
});
