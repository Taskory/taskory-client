import React from 'react';

const ACard: React.FC = () => {
    return <div className="border p-2 rounded bg-white mb-2">A Card</div>;
};

const BCard: React.FC = () => {
    return <div className="border p-2 rounded bg-white mb-2">B Card</div>;
};

const ABoard: React.FC<{ cardsCount: number }> = ({ cardsCount = 20 }) => {
    return (
        <div className="overflow-auto border rounded-lg p-4 bg-base-200 max-h-full flex flex-col w-full">
            {Array.from({ length: cardsCount }, (_, index) => (
                <ACard key={index} />
            ))}
        </div>
    );
};

const BBoard: React.FC = () => {
    return (
        <div className="overflow-auto border rounded-lg p-4 bg-base-200 max-h-full">
            {Array.from({ length: 5 }, (_, index) => (
                <BCard key={index} />
            ))}
        </div>
    );
};

export const Temp: React.FC = () => {
    return (
        <div className="overflow-auto h-screen p-4">
            {/* 상단 컨테이너 */}
            <div className="flex gap-4 mb-4" style={{ minHeight: '50vh', maxHeight: '66.6667vh' }}>
                {/* 왼쪽 a 보드 */}
                <div className="flex-1 flex items-stretch min-w-0">
                    <ABoard cardsCount={3} />
                </div>

                {/* 오른쪽 a 보드 (왼쪽의 2배 가로폭) */}
                <div className="flex-[2] flex items-stretch min-w-0">
                    <ABoard cardsCount={20}/>
                </div>
            </div>

            {/* 하단 컨테이너 */}
            <div className="space-y-4">
                {/* 첫 번째 b 보드 */}
                <BBoard />

                {/* 두 번째 b 보드 */}
                <BBoard />
            </div>
        </div>
    );
};
