// EventModal.tsx

import React, { useState } from 'react';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose }) => {
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');

    const handleSave = () => {
        if (eventName && eventDate) {
            // Logic to save the event
            console.log('Event saved:', { name: eventName, date: eventDate });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <dialog open={isOpen} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Create New Event</h3>
                <div className="py-4">
                    <input
                        type="text"
                        placeholder="Event Name"
                        className="input input-bordered w-full mb-2"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                    />
                    <input
                        type="date"
                        className="input input-bordered w-full mb-2"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                    />
                </div>
                <div className="modal-action">
                    <button className="btn" onClick={handleSave}>Save</button>
                    <button className="btn btn-error" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </dialog>
    );
};

export default EventModal;
