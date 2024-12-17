import React, { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { TaskStatus } from "../../api/task/TaskTypes";
import { StatusBadge } from "../../component/StatusBadge";

// Props for the StatusSelectBox Component
interface StatusSelectBoxProps {
	status: TaskStatus; // Current selected status
	setStatus: Dispatch<SetStateAction<TaskStatus>>; // Function to update status
}

export const StatusSelectBox: React.FC<StatusSelectBoxProps> = ({ status, setStatus }) => {
	// State to manage dropdown visibility
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	// Dropdown position for rendering outside the flow
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

	/**
	 * Toggle the dropdown visibility
	 */
	const toggleDropdown = () => {
		setIsDropdownOpen((prev) => !prev);
	};

	/**
	 * Handle status selection and close dropdown
	 * @param selectedStatus - Newly selected status
	 */
	const handleSelect = (selectedStatus: TaskStatus) => {
		setStatus(selectedStatus);
		setIsDropdownOpen(false);
	};

	/**
	 * Calculate and set dropdown position relative to the trigger element
	 */
	useEffect(() => {
		if (isDropdownOpen && dropdownRef.current) {
			const rect = dropdownRef.current.getBoundingClientRect();
			setDropdownPosition({
				top: rect.bottom + window.scrollY, // Position below the trigger element
				left: rect.left + window.scrollX,  // Align with the trigger's left edge
			});
		}
	}, [isDropdownOpen]);

	return (
		<div className="relative w-20" ref={dropdownRef}>
			{/* Dropdown Trigger */}
			<div
				role="button"
				onClick={toggleDropdown}
				className="flex justify-end items-center gap-1 rounded px-1 py-0.5 cursor-pointer transition duration-200 hover:bg-gray-100"
			>
				<StatusBadge status={status} />
			</div>

			{/* Dropdown List - rendered via Portal to prevent overflow issues */}
			{isDropdownOpen &&
				ReactDOM.createPortal(
					<ul
						className="absolute bg-white border rounded-lg shadow-lg z-[9999] w-20 overflow-y-auto"
						style={{ position: "absolute", top: dropdownPosition.top, left: dropdownPosition.left }}
					>
						{/* Render all possible status options */}
						{Object.values(TaskStatus).map((option) => (
							<li
								key={option}
								className="p-0.5 hover:bg-gray-100 cursor-pointer flex justify-end"
								onClick={() => handleSelect(option)}
							>
								<StatusBadge status={option} />
							</li>
						))}
					</ul>,
					document.body // Render dropdown directly into the body element
				)}
		</div>
	);
};
