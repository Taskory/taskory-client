import React, {useState} from 'react';
import {useDrag, useDragLayer, DndProvider, useDrop} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// 타입 정의
interface DragItem {
    id: string;
    text: string;
}

// DraggableItem 컴포넌트
export const DraggableItem: React.FC<{ id: string; text: string }> = ({ id, text }) => {
    const [, drag] = useDrag(() => ({
        type: 'ITEM',
        item: { id, text },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <>
            <div className="relative w-32 h-12">
                <button
                    className={`w-full h-full bg-blue-500 text-white rounded-lg opacity-100  duration-300 `}
                >
                    {text}
                </button>

                <button ref={drag} className={`absolute top-0 left-0 w-full h-full opacity-0`}/>
            </div>
        </>
    );
};

// CustomDragLayer 컴포넌트
export const CustomDragLayer: React.FC = () => {
    const {item, isDragging, currentOffset} = useDragLayer((monitor) => ({
        item: monitor.getItem() as DragItem,
        isDragging: monitor.isDragging(),
        currentOffset: monitor.getSourceClientOffset(),
    }));

    if (!isDragging || !currentOffset) return null;

    const layerStyle: React.CSSProperties = {
        position: 'fixed',
        pointerEvents: 'none',
        left: currentOffset.x,
        top: currentOffset.y,
        zIndex: 1000,
    };

    return (
        <div style={layerStyle}>
            <div className="bg-blue-500 text-white p-2 rounded shadow-lg">
                Dragging: {item.text}
            </div>
        </div>
    );
};

// Dropzone 컴포넌트
export const Dropzone: React.FC<{ onDrop: (item: DragItem) => void }> = ({ onDrop }) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: 'ITEM',
        drop: (item: DragItem) => {
            onDrop(item);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }));

    return (
        <div
            ref={drop}
            className={`w-64 h-32 border-2 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                isOver
                    ? canDrop
                        ? 'bg-green-200 border-green-500'
                        : 'bg-red-200 border-red-500'
                    : 'bg-gray-100 border-gray-300'
            }`}
        >
            {isOver ? (canDrop ? 'Release to drop' : 'Cannot drop here') : 'Drop items here'}
        </div>
    );
};
// Temp 컴포넌트
export const Temp: React.FC = () => {
    const [droppedItems, setDroppedItems] = useState<DragItem[]>([]);

    const handleDrop = (item: DragItem) => {
        setDroppedItems((prevItems) => [...prevItems, item]);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col items-center p-4 space-y-4">
                <h1 className="text-2xl font-bold mb-4">Drag and Drop with Custom DragLayer</h1>

                {/* Draggable Items */}
                <div className="flex space-x-4">
                    <DraggableItem id="1" text="Item 1" />
                    <DraggableItem id="2" text="Item 2" />
                    <DraggableItem id="3" text="Item 3" />
                </div>

                {/* Dropzone */}
                <Dropzone onDrop={handleDrop} />

                {/* Dropped Items */}
                <div className="mt-4">
                    <h2 className="text-lg font-semibold">Dropped Items:</h2>
                    <ul>
                        {droppedItems.map((item) => (
                            <li key={item.id} className="text-gray-700">
                                {item.text}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Custom Drag Layer */}
                <CustomDragLayer />
            </div>
        </DndProvider>
    );
};