"use client";

import { Topic } from "../types";
import { TopicCard } from "./TopicCard";
import { CommentCard } from "./CommentCard";

interface TopicThreadProps {
  topic: Topic;
}

export function TopicThread({ topic }: TopicThreadProps) {
  return (
    <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Main Topic */}
      <TopicCard topic={topic} />
      
      {/* Comments List */}
      {topic.Comments && topic.Comments.length > 0 && (
        <div className="mt-2">
          {topic.Comments.map((comment, index) => (
            <CommentCard 
              key={comment.Id} 
              comment={comment} 
              isLast={index === topic.Comments!.length - 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
