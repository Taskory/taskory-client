import React from 'react';

const colors = [
    'slate',
    'gray',
    'neutral',
    'stone',
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
    'zinc',
];

const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

export const Temp: React.FC = () => {
    return (
        <div className="p-4 space-y-4">
            {colors.map((color) => (
                <div key={color} className="flex items-center space-x-2">
                    <div className="w-20 font-bold">{color}</div>
                    {shades.map((shade) => {
                        const textColor = parseInt(shade, 10) < 500 ? 'text-black' : 'text-white';
                        return (
                            <div
                                key={`${color}-${shade}`}
                                className={`w-10 h-10 rounded-lg bg-${color}-${shade} ${textColor} flex items-center justify-center`}
                            >
                                {shade}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};
