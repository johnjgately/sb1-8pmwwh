import React, { useState } from 'react';

interface QuestionCellProps {
  value: number;
  question: string;
  answer: string;
  setModalData: (data: { question: string; answer: string; value: number }) => void;
}

const QuestionCell: React.FC<QuestionCellProps> = ({ value, question, answer, setModalData }) => {
  const [used, setUsed] = useState(false);

  const handleClick = () => {
    if (!used) {
      setModalData({ question, answer, value });
      setUsed(true);
    }
  };

  return (
    <div
      className={`p-4 text-center cursor-pointer transition-colors duration-300 ${
        used ? 'bg-gray-800' : 'bg-blue-600 hover:bg-blue-700'
      }`}
      onClick={handleClick}
    >
      {used ? '' : `$${value}`}
    </div>
  );
};

export default QuestionCell;