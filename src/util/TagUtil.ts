import {TagColor} from "../api/tag/TagTypes";

export const getTagStringColor = (color: string | TagColor | null) => {
    if (color) {
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
            case TagColor.NONE:
                return 'text-white';
        }
    }
};

export const getTagBGColor = (color: string | TagColor | null) => {
    if (color) {
        switch (color) {
            case TagColor.RED:
                return 'bg-red-600';
            case TagColor.GREEN:
                return 'bg-green-600';
            case TagColor.BLUE:
                return 'bg-blue-600';
            case TagColor.YELLOW:
                return 'bg-yellow-600';
            case TagColor.ORANGE:
                return 'bg-orange-600';
            case TagColor.PURPLE:
                return 'bg-purple-600';
            case TagColor.BROWN:
                return 'bg-yellow-900';
            case TagColor.PINK:
                return 'bg-pink-600';
            case TagColor.CYAN:
                return 'bg-cyan-600';
            case TagColor.BLACK:
                return 'bg-black';
            case TagColor.NONE:
                return 'bg-white';
        }
    }
};

export const getTagColorStyle = (tagColor: string) => {
    switch (tagColor) {
        case TagColor.BLACK:
            return 'bg-black text-white';
        case TagColor.RED:
            return 'bg-red-100 text-red-800';
        case TagColor.GREEN:
            return 'bg-green-100 text-green-800';
        case TagColor.BLUE:
            return 'bg-blue-100 text-blue-800';
        case TagColor.YELLOW:
            return 'bg-yellow-100 text-yellow-800';
        case TagColor.ORANGE:
            return 'bg-orange-100 text-orange-800';
        case TagColor.PURPLE:
            return 'bg-purple-100 text-purple-800';
        case TagColor.BROWN:
            return 'bg-yellow-900 text-yellow-100';
        case TagColor.PINK:
            return 'bg-pink-100 text-pink-800';
        case TagColor.CYAN:
            return 'bg-cyan-100 text-cyan-800';
        case TagColor.NONE:
            return 'bg-white text-black';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export const getTagCheckBoxColor = (color: string | TagColor | null) => {
    // [--chkbg:theme(colors.indigo.600)] [--chkfg:orange]
    if (color) {
        switch (color) {
            case TagColor.RED:
                return 'bg-red-600 [--chkbg:theme(colors.red.600)] [--chkfg:white]';
            case TagColor.GREEN:
                return 'bg-green-600 [--chkbg:theme(colors.green.600)] [--chkfg:white]';
            case TagColor.BLUE:
                return 'bg-blue-600 [--chkbg:theme(colors.red.600)] [--chkfg:white]';
            case TagColor.YELLOW:
                return 'bg-yellow-600 [--chkbg:theme(colors.yellow.600)] [--chkfg:white]';
            case TagColor.ORANGE:
                return 'bg-orange-600 [--chkbg:theme(colors.orange.600)] [--chkfg:white]';
            case TagColor.PURPLE:
                return 'bg-purple-600 [--chkbg:theme(colors.purple.600)] [--chkfg:white]';
            case TagColor.BROWN:
                return 'bg-yellow-900 [--chkbg:theme(colors.yellow.900)] [--chkfg:white]';
            case TagColor.PINK:
                return 'bg-pink-600 [--chkbg:theme(colors.pink.600)] [--chkfg:white]';
            case TagColor.CYAN:
                return 'bg-cyan-600 [--chkbg:theme(colors.cyan.600)] [--chkfg:white]';
            case TagColor.BLACK:
                return 'bg-black [--chkbg:theme(colors.black)] [--chkfg:white]';
            case TagColor.NONE:
                return 'bg-white [--chkbg:theme(colors.white)] [--chkfg:black]';
        }
    }
};
