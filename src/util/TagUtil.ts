import {TagColor} from "../api/tag/TagTypes";

export const getTagStringColor = (color: TagColor | null) => {
    if (color) {
        switch (color) {
            case TagColor.RED:
                return 'text-red-600'; // Red 텍스트 (600)
            case TagColor.ORANGE:
                return 'text-orange-400'; // Orange 텍스트 (400)
            case TagColor.YELLOW:
                return 'text-yellow-300'; // Yellow 텍스트 (300)
            case TagColor.LIME:
                return 'text-lime-300'; // Lime 텍스트 (300)
            case TagColor.GREEN:
                return 'text-green-500'; // Green 텍스트 (500)
            case TagColor.CYAN:
                return 'text-cyan-300'; // Cyan 텍스트 (300)
            case TagColor.BLUE:
                return 'text-blue-600'; // Blue 텍스트 (600)
            case TagColor.PURPLE:
                return 'text-purple-500'; // Purple 텍스트 (500)
            case TagColor.PINK:
                return 'text-pink-300'; // Pink 텍스트 (300)
            default:
                return 'text-gray-300'; // 기본 Gray 텍스트
        }
    }
    return 'text-gray-300'; // 기본값 (null일 경우)
};


export const getTagBGColor = (color: TagColor | null) => {
    if (color) {
        switch (color) {
            case TagColor.RED:
                return 'bg-red-600'; // Red: 600
            case TagColor.ORANGE:
                return 'bg-orange-400'; // Orange: 400
            case TagColor.YELLOW:
                return 'bg-yellow-300'; // Yellow: 300
            case TagColor.LIME:
                return 'bg-lime-300'; // Lime: 300
            case TagColor.GREEN:
                return 'bg-green-500'; // Green: 500
            case TagColor.CYAN:
                return 'bg-cyan-300'; // Cyan: 300
            case TagColor.BLUE:
                return 'bg-blue-600'; // Blue: 600
            case TagColor.PURPLE:
                return 'bg-purple-500'; // Purple: 500
            case TagColor.PINK:
                return 'bg-pink-300'; // Pink: 300
            default:
                return 'bg-gray-200'; // 기본 값 (NONE)
        }
    }
    return 'bg-gray-200'; // 기본 값 (null)
};

export const getTagColorStyle = (color: TagColor) => {
    switch (color) {
        case TagColor.RED:
            return 'bg-red-100 text-red-700'; // 배경 연한 Red, 텍스트 진한 Red (600)
        case TagColor.ORANGE:
            return 'bg-orange-100 text-orange-500'; // 배경 연한 Orange, 텍스트 Orange (400)
        case TagColor.YELLOW:
            return 'bg-yellow-100 text-yellow-400'; // 배경 연한 Yellow, 텍스트 Yellow (300)
        case TagColor.LIME:
            return 'bg-lime-100 text-lime-400'; // 배경 연한 Lime, 텍스트 Lime (300)
        case TagColor.GREEN:
            return 'bg-green-100 text-green-600'; // 배경 연한 Green, 텍스트 Green (500)
        case TagColor.CYAN:
            return 'bg-cyan-100 text-cyan-400'; // 배경 연한 Cyan, 텍스트 Cyan (300)
        case TagColor.BLUE:
            return 'bg-blue-100 text-blue-700'; // 배경 연한 Blue, 텍스트 Blue (600)
        case TagColor.PURPLE:
            return 'bg-purple-100 text-purple-600'; // 배경 연한 Purple, 텍스트 Purple (500)
        case TagColor.PINK:
            return 'bg-pink-100 text-pink-400'; // 배경 연한 Pink, 텍스트 Pink (300)
        default:
            return 'bg-gray-100 text-gray-400'; // 기본 Gray 설정
    }
};

export const getTagCheckBoxColor = (color: TagColor | null) => {
    if (color) {
        switch (color) {
            case TagColor.RED:
                return 'bg-red-600 [--chkbg:theme(colors.red.600)] [--chkfg:white]';
            case TagColor.ORANGE:
                return 'bg-orange-400 [--chkbg:theme(colors.orange.400)] [--chkfg:white]';
            case TagColor.YELLOW:
                return 'bg-yellow-300 [--chkbg:theme(colors.yellow.300)] [--chkfg:white]';
            case TagColor.LIME:
                return 'bg-lime-300 [--chkbg:theme(colors.lime.300)] [--chkfg:white]';
            case TagColor.GREEN:
                return 'bg-green-500 [--chkbg:theme(colors.green.500)] [--chkfg:white]';
            case TagColor.CYAN:
                return 'bg-cyan-300 [--chkbg:theme(colors.cyan.300)] [--chkfg:white]';
            case TagColor.BLUE:
                return 'bg-blue-600 [--chkbg:theme(colors.blue.600)] [--chkfg:white]';
            case TagColor.PURPLE:
                return 'bg-purple-500 [--chkbg:theme(colors.purple.500)] [--chkfg:white]';
            case TagColor.PINK:
                return 'bg-pink-300 [--chkbg:theme(colors.pink.300)] [--chkfg:white]';
            default:
                return 'bg-gray-200 [--chkbg:theme(colors.gray.200)] [--chkfg:white]';
        }
    }
    return 'bg-gray-200 [--chkbg:theme(colors.gray.200)] [--chkfg:black]';
};

