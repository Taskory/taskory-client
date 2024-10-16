import {TagColor} from "../api/tag/TagTypes";

export const getTagColorClass = (color: string) => {
    switch (color) {
        case TagColor.RED:
            return 'text-red-600';
        case TagColor.GREEN:
            return 'text-green-600';
        case TagColor.BLUE:
            return 'text-blue-600';
        case TagColor.YELLOW:
            return 'text-yellow-600';
        case TagColor.ORANGE:
            return 'text-orange-600';
        case TagColor.PURPLE:
            return 'text-purple-600';
        case TagColor.BROWN:
            return 'text-yellow-900';
        case TagColor.PINK:
            return 'text-pink-600';
        case TagColor.CYAN:
            return 'text-cyan-600';
        case TagColor.BLACK:
            return 'text-black';
        default:
            return 'text-gray-600';
    }
};