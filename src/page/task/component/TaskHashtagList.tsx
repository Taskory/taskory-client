import React from "react";
import {HashtagResponse} from "../../../api/hashtag/HashtagTypes";

export const TaskHashtagList: React.FC<{hashtags: HashtagResponse[]}> = ({hashtags}) => {
	return (
		<>
			<div className="flex flex-wrap gap-1 w-full">
				{hashtags.length > 0 ? (
					hashtags.map((hashtag) => (
						<span key={hashtag.id}
						      className="badge badge-secondary text-[10px] py-0.5 px-2 rounded-full"
						>
									#{hashtag.title}
								</span>
					))
				) : (
					<span className="bg-gray-100 text-gray-600 rounded px-2 py-0.5 text-xs">
								No Hashtags
							</span>
				)}
			</div>
		</>
	);
};