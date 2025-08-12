import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../Data";

// FETCH ALL EVENTS
export const fetchEvents = () => async (dispatch) => {
  try {
    dispatch({ type: "FetchEventsRequest" });

    const { data } = await axios.get(`${server}/event/`, {
      withCredentials: true,
    });

    dispatch({ type: "FetchEventsSuccess", payload: data.events });
  } catch (error) {
    dispatch({
      type: "FetchEventsFail",
      payload: error.response?.data?.message || "Failed to fetch events",
    });
  }
};

// CREATE EVENT
export const createEvent = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "CreateEventRequest" });

    const { data } = await axios.post(`${server}/event/create`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    dispatch({ type: "CreateEventSuccess", payload: data.event });
    return true;
  } catch (error) {
    dispatch({
      type: "CreateEventFail",
      payload: error.response?.data?.message || "Failed to create event",
    });
    toast.error(error.response?.data?.message)
    return false;
  }
};

// UPDATE EVENT
export const updateEvent = (eventId, formData) => async (dispatch, getState) => {
  try {
    dispatch({ type: "UpdateEventRequest" });

    const { data } = await axios.put(
      `${server}/event/update/${eventId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );

    // Update events list in state without reload
    const { events } = getState().events; // assuming your reducer key is "events"
    const updatedEvents = events.map((ev) =>
      ev._id === eventId ? data.event : ev
    );

    dispatch({ type: "UpdateEventSuccess", payload: data.event });
    dispatch({ type: "LoadEventsSuccess", payload: updatedEvents });

    toast.success("Event updated successfully");
    return true;
  } catch (error) {
    dispatch({
      type: "UpdateEventFail",
      payload:
        error.response?.data?.message || "Failed to update event",
    });
    toast.error(error.response?.data?.message || "Failed to update event");
    return false;
  }
};


// DELETE EVENT
export const deleteEvent = (eventId) => async (dispatch) => {
  try {
    dispatch({ type: "DeleteEventRequest" });

    await axios.delete(`${server}/event/delete/${eventId}`, {
      withCredentials: true,
    });

    dispatch({ type: "DeleteEventSuccess", payload: eventId });
    return true;
  } catch (error) {
    dispatch({
      type: "DeleteEventFail",
      payload: error.response?.data?.message || "Failed to delete event",
    });
    toast.error(error.response?.data?.message || "Failed to delete event");
    return false;
  }
};

// RESET STATE
export const resetEvents = () => (dispatch) => {
  dispatch({ type: "ResetEvents" });
};
