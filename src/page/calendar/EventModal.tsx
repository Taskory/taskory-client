import React, { forwardRef, useState, useEffect } from 'react';
import {
  createEvent,
  updateEvent,
  getEventById,
} from '../../api/event/EventApi';
import { AxiosResponse } from 'axios';
import { EventResponse, SaveEventRequest } from '../../api/event/EventsTypes';

interface CalendarModalProps {
  eventId?: number; // Optional eventId to determine create or update mode
}

export const EventModal = forwardRef<HTMLDialogElement, CalendarModalProps>(
  ({ eventId }, ref) => {
    const [event, setEvent] = useState<SaveEventRequest>({
      title: '',
      tagId: undefined,
      hashtagIds: [],
      description: '',
      startDateTime: '',
      dueDateTime: '',
      location: '',
    });
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
      if (eventId) {
        setIsEditMode(true);
        fetchEvent(eventId);
      } else {
        setIsEditMode(false);
      }
    }, [eventId]);

    const fetchEvent = async (id: number) => {
      try {
        const response: AxiosResponse<EventResponse> = await getEventById(id);
        const eventData = response.data;

        setEvent({
          title: eventData.title,
          tagId: eventData.tag.id,
          hashtagIds: eventData.hashtags.map((hashtag) => hashtag.id),
          description: eventData.description,
          startDateTime: eventData.startDateTime,
          dueDateTime: eventData.dueDateTime,
          location: eventData.location,
        });
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    const handleSave = async () => {
      try {
        let response: AxiosResponse<EventResponse>;

        if (isEditMode && eventId) {
          response = await updateEvent(eventId, event);
        } else {
          response = await createEvent(event);
        }

        if (response.status === 200 || response.status === 201) {
          console.log(
            isEditMode
              ? 'Event successfully updated:'
              : 'Event successfully created:',
            response.data,
          );
          handleClose();
        } else {
          console.error('Failed to save event. Status:', response.status);
        }
      } catch (error) {
        console.error('Error saving event:', error);
      }
    };

    const handleClose = () => {
      if (ref && (ref as React.RefObject<HTMLDialogElement>).current) {
        (ref as React.RefObject<HTMLDialogElement>).current?.close();
      }
    };

    const handleChange = (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;
      setEvent((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

    const handleHashtagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const options = e.target.options;
      const selectedValues = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => parseInt(option.value));

      setEvent((prevState: SaveEventRequest) => ({
        ...prevState,
        hashtagIds: selectedValues,
      }));
    };

    return (
      <dialog ref={ref} className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">
            {isEditMode ? 'Edit Event' : 'Create Event'}
          </h3>

          <div className="modal-body">
            {/* Title */}
            <input
              type="text"
              name="title"
              value={event.title}
              onChange={handleChange}
              placeholder="Event Title"
              className="input input-bordered w-full mb-4"
            />

            {/* Tag ID */}
            {/*<select*/}
            {/*    name="tagId"*/}
            {/*    value={event.tagId}*/}
            {/*    onChange={handleChange}*/}
            {/*    className="select select-bordered w-full mb-4"*/}
            {/*>*/}
            {/*    <option value={undefined}>Select Tag</option>*/}
            {/*    /!* Replace with dynamic tag options *!/*/}
            {/*    <option value={1}>Tag 1</option>*/}
            {/*    <option value={2}>Tag 2</option>*/}
            {/*</select>*/}

            {/* Hashtags */}
            {/*<select*/}
            {/*    name="hashtagIds"*/}
            {/*    value={event.hashtagIds}*/}
            {/*    onChange={handleHashtagChange}*/}
            {/*    multiple*/}
            {/*    className="select select-bordered w-full mb-4"*/}
            {/*>*/}
            {/*    /!* Replace with dynamic hashtag options *!/*/}
            {/*    <option value={1}>Hashtag 1</option>*/}
            {/*    <option value={2}>Hashtag 2</option>*/}
            {/*    <option value={3}>Hashtag 3</option>*/}
            {/*</select>*/}

            {/* Description */}
            <textarea
              name="description"
              value={event.description}
              onChange={handleChange}
              placeholder="Event Description"
              className="textarea textarea-bordered w-full mb-4"
            />

            {/* Start Date and Time */}
            <input
              type="datetime-local"
              name="startDateTime"
              value={event.startDateTime}
              onChange={handleChange}
              className="input input-bordered w-full mb-4"
            />

            {/* Due Date and Time */}
            <input
              type="datetime-local"
              name="dueDateTime"
              value={event.dueDateTime}
              onChange={handleChange}
              className="input input-bordered w-full mb-4"
            />

            {/* Location */}
            <input
              type="text"
              name="location"
              value={event.location}
              onChange={handleChange}
              placeholder="Event Location"
              className="input input-bordered w-full mb-4"
            />
          </div>

          <div className="modal-action">
            <button className="btn" onClick={handleClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              {isEditMode ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </dialog>
    );
  },
);
