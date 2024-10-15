import React from 'react';
import QuestionCell from './QuestionCell';
import { getQuestionsByCategory } from '../db/database';

interface JeopardyBoardProps {
  setModalData: (data: { question: string; answer: string; value: number }) => void;
  categories: { id: number; name: string }[];
}

const JeopardyBoard: React.FC<JeopardyBoardProps> = ({ setModalData, categories }) => {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-5 gap-4">
        {categories.map((category) => {
          const questions = getQuestionsByCategory(category.id);
          return (
            <div key={category.id} className="flex flex-col gap-4">
              <div className="bg-blue-800 p-4 text-center font-bold h-16 flex items-center justify-center">
                {category.name}
              </div>
              {questions.map((q) => (
                <QuestionCell
                  key={q.id}
                  value={q.value}
                  question={q.question}
                  answer={q.answer}
                  setModalData={setModalData}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JeopardyBoard;