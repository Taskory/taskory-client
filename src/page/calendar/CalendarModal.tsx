import React, { forwardRef, useState, useEffect } from "react";
import { EventInterface } from "../../api/interface/EventInterface";
import { TagInterface } from "../../api/interface/TagInterface";
import { HashtagInterface } from "../../api/interface/HashtagInterface";

interface CalendarModalProps {
}

export const CalendarModal = forwardRef<HTMLDialogElement, CalendarModalProps>(({ } , ref) => {
    const [availableTags, setAvailableTags] = useState<TagInterface[]>([]);
    const [event, setEvent] = useState<EventInterface>({
        id: 0,
        title: "",
        tag: { id: 0, title: "", color: "" },
        hashtags: [],
        description: "",
        startDateTime: "",
        dueDateTime: "",
        location: "",
    });
    const [newHashtag, setNewHashtag] = useState<HashtagInterface>({ id: 0, title: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEvent(prevEvent => ({
            ...prevEvent,
            [name]: value
        }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEvent(prevEvent => ({
            ...prevEvent,
            [name === "startDate" ? "startDateTime" : "dueDateTime"]: `${value}T${name === "startDate" ? (event.startDateTime.split('T')[1] || "00:00") : (event.dueDateTime.split('T')[1] || "00:00")}`
        }));
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEvent(prevEvent => ({
            ...prevEvent,
            [name === "startTime" ? "startDateTime" : "dueDateTime"]: `${name === "startTime" ? (event.startDateTime.split('T')[0] || "") : (event.dueDateTime.split('T')[0] || "")}T${value}`
        }));
    };

    const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTag = availableTags.find(tag => tag.id === Number(e.target.value));
        if (selectedTag) {
            setEvent(prevEvent => ({
                ...prevEvent,
                tag: selectedTag
            }));
        }
    };

    const handleHashtagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewHashtag(prevHashtag => ({
            ...prevHashtag,
            [name]: value
        }));
    };

    const addHashtag = () => {
        setEvent(prevEvent => ({
            ...prevEvent,
            hashtags: [...prevEvent.hashtags, newHashtag]
        }));
        setNewHashtag({ id: 0, title: "" });
    };

    const handleSave = () => {
        console.log("Event saved:", event);
        // Implement saving logic here (e.g., update state or call API)
        handleClose();
    };

    const handleClose = () => {
        const inputs = document.querySelectorAll<HTMLInputElement>('.modal input');
        inputs.forEach(input => input.blur());
        if (ref && (ref as React.RefObject<HTMLDialogElement>).current) {
            (ref as React.RefObject<HTMLDialogElement>).current?.close();
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" || e.key === "Esc") {
                const activeElement = document.activeElement as HTMLElement;
                if (activeElement.tagName === "INPUT" && activeElement.getAttribute("type") === "date") {
                    (activeElement as HTMLInputElement).blur();
                    e.stopPropagation();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <dialog ref={ref} className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold text-lg">Create Event</h3>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={event.title}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            placeholder="Event Title"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Tag</label>
                        <select
                            name="tag"
                            value={event.tag.id}
                            onChange={handleTagChange}
                            className="select select-bordered w-full"
                        >
                            <option value="" disabled>Select Tag</option>
                            {availableTags.map(tag => (
                                <option key={tag.id} value={tag.id}>{tag.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            value={event.description}
                            onChange={handleChange}
                            className="textarea textarea-bordered w-full"
                            placeholder="Event Description"
                        ></textarea>
                        <div className="mt-2">
                            {event.hashtags.map((hashtag, index) => (
                                <span key={index} className="badge badge-ghost mr-2">#{hashtag.title}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Hashtags</label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                name="title"
                                value={newHashtag.title}
                                onChange={handleHashtagChange}
                                className="input input-bordered w-full"
                                placeholder="Hashtag Title"
                            />
                            <button type="button" className="btn btn-primary" onClick={addHashtag}>Add Hashtag</button>
                        </div>

                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Start Date & Time</label>
                            <div className="flex gap-4">
                                <input
                                    type="date"
                                    name="startDate"
                                    value={event.startDateTime.split('T')[0] || ""}
                                    onChange={handleDateChange}
                                    className="input input-bordered w-full"
                                />
                                <input
                                    type="time"
                                    name="startTime"
                                    value={event.startDateTime.split('T')[1] || ""}
                                    onChange={handleTimeChange}
                                    className="input input-bordered w-full"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Due Date & Time</label>
                            <div className="flex gap-4">
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={event.dueDateTime.split('T')[0] || ""}
                                    onChange={handleDateChange}
                                    className="input input-bordered w-full"
                                />
                                <input
                                    type="time"
                                    name="dueTime"
                                    value={event.dueDateTime.split('T')[1] || ""}
                                    onChange={handleTimeChange}
                                    className="input input-bordered w-full"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={event.location}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            placeholder="Event Location"
                        />
                    </div>
                </form>
                <div className="modal-action">
                    <button className="btn" onClick={handleClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSave}>Save</button>
                </div>
            </div>
        </dialog>
    );
});
