import React, { useState, useEffect } from 'react';
import { addCategory, addQuestion, getRandomCategories, getQuestionsByCategory, db } from '../db/database';

interface AdminPanelProps {
  onSimulateGame: (players: string[]) => void;
  logs: string[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onSimulateGame, logs }) => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [questions, setQuestions] = useState<{ id: number; question: string; answer: string; value: number }[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newQuestion, setNewQuestion] = useState({ question: '', answer: '', value: 100 });
  const [editingQuestion, setEditingQuestion] = useState<{ id: number; question: string; answer: string; value: number } | null>(null);
  const [message, setMessage] = useState('');
  const [simulationPlayers, setSimulationPlayers] = useState(['Player 1', 'Player 2']);
  const [activeTab, setActiveTab] = useState('categories'); // 'categories', 'simulation', or 'logs'

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory !== null) {
      loadQuestions(selectedCategory);
    }
  }, [selectedCategory]);

  const loadCategories = () => {
    const allCategories = db.exec('SELECT * FROM categories');
    setCategories(allCategories[0]?.values.map((row: any[]) => ({ id: row[0], name: row[1] })) || []);
  };

  const loadQuestions = (categoryId: number) => {
    setQuestions(getQuestionsByCategory(categoryId));
  };

  const handleAddCategory = () => {
    if (newCategory) {
      const newCategoryId = addCategory(newCategory);
      setMessage(`Category "${newCategory}" added with ID: ${newCategoryId}`);
      setNewCategory('');
      loadCategories();
    }
  };

  const handleDeleteCategory = (categoryId: number) => {
    db.run('DELETE FROM questions WHERE category_id = ?', [categoryId]);
    db.run('DELETE FROM categories WHERE id = ?', [categoryId]);
    setMessage('Category deleted successfully');
    loadCategories();
    setSelectedCategory(null);
  };

  const handleAddQuestion = () => {
    if (selectedCategory !== null && newQuestion.question && newQuestion.answer) {
      const newQuestionId = addQuestion(selectedCategory, newQuestion.question, newQuestion.answer, newQuestion.value);
      setMessage(`Question added with ID: ${newQuestionId}`);
      setNewQuestion({ question: '', answer: '', value: 100 });
      loadQuestions(selectedCategory);
    }
  };

  const handleEditQuestion = (question: { id: number; question: string; answer: string; value: number }) => {
    setEditingQuestion(question);
  };

  const handleUpdateQuestion = () => {
    if (editingQuestion) {
      db.run('UPDATE questions SET question = ?, answer = ?, value = ? WHERE id = ?', 
        [editingQuestion.question, editingQuestion.answer, editingQuestion.value, editingQuestion.id]);
      setMessage('Question updated successfully');
      loadQuestions(selectedCategory!);
      setEditingQuestion(null);
    }
  };

  const handleDeleteQuestion = (questionId: number) => {
    db.run('DELETE FROM questions WHERE id = ?', [questionId]);
    setMessage('Question deleted successfully');
    loadQuestions(selectedCategory!);
  };

  const handleSimulateGame = () => {
    onSimulateGame(simulationPlayers);
  };

  return (
    <div className="bg-blue-800 p-6 rounded-lg max-w-4xl mx-auto mt-8 overflow-auto max-h-[80vh]">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
      
      <div className="mb-4">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded mr-2 ${activeTab === 'categories' ? 'bg-yellow-500 text-blue-900' : 'bg-blue-700 text-white'}`}
        >
          Categories & Questions
        </button>
        <button
          onClick={() => setActiveTab('simulation')}
          className={`px-4 py-2 rounded mr-2 ${activeTab === 'simulation' ? 'bg-yellow-500 text-blue-900' : 'bg-blue-700 text-white'}`}
        >
          Simulation
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded ${activeTab === 'logs' ? 'bg-yellow-500 text-blue-900' : 'bg-blue-700 text-white'}`}
        >
          Logs
        </button>
      </div>

      {activeTab === 'categories' && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Categories</h3>
          <select 
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(Number(e.target.value))}
            className="w-full p-2 mb-2 text-black"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New Category Name"
            className="w-full p-2 mb-2 text-black"
          />
          <button onClick={handleAddCategory} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
            Add Category
          </button>
          {selectedCategory && (
            <button onClick={() => handleDeleteCategory(selectedCategory)} className="bg-red-500 text-white px-4 py-2 rounded">
              Delete Selected Category
            </button>
          )}

          {selectedCategory && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Questions</h3>
              {questions.map((q) => (
                <div key={q.id} className="mb-2 p-2 bg-blue-700 rounded">
                  <p><strong>Question:</strong> {q.question}</p>
                  <p><strong>Answer:</strong> {q.answer}</p>
                  <p><strong>Value:</strong> ${q.value}</p>
                  <button onClick={() => handleEditQuestion(q)} className="bg-yellow-500 text-blue-900 px-2 py-1 rounded mr-2 mt-2">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteQuestion(q.id)} className="bg-red-500 text-white px-2 py-1 rounded mt-2">
                    Delete
                  </button>
                </div>
              ))}
              <h4 className="text-lg font-semibold mt-4 mb-2">Add New Question</h4>
              <input
                type="text"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                placeholder="Question"
                className="w-full p-2 mb-2 text-black"
              />
              <input
                type="text"
                value={newQuestion.answer}
                onChange={(e) => setNewQuestion({...newQuestion, answer: e.target.value})}
                placeholder="Answer"
                className="w-full p-2 mb-2 text-black"
              />
              <input
                type="number"
                value={newQuestion.value}
                onChange={(e) => setNewQuestion({...newQuestion, value: Number(e.target.value)})}
                placeholder="Value"
                className="w-full p-2 mb-2 text-black"
              />
              <button onClick={handleAddQuestion} className="bg-green-500 text-white px-4 py-2 rounded">
                Add Question
              </button>
            </div>
          )}

          {editingQuestion && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Edit Question</h3>
              <input
                type="text"
                value={editingQuestion.question}
                onChange={(e) => setEditingQuestion({...editingQuestion, question: e.target.value})}
                className="w-full p-2 mb-2 text-black"
              />
              <input
                type="text"
                value={editingQuestion.answer}
                onChange={(e) => setEditingQuestion({...editingQuestion, answer: e.target.value})}
                className="w-full p-2 mb-2 text-black"
              />
              <input
                type="number"
                value={editingQuestion.value}
                onChange={(e) => setEditingQuestion({...editingQuestion, value: Number(e.target.value)})}
                className="w-full p-2 mb-2 text-black"
              />
              <button onClick={handleUpdateQuestion} className="bg-yellow-500 text-blue-900 px-4 py-2 rounded">
                Update Question
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'simulation' && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Simulate Game</h3>
          {simulationPlayers.map((player, index) => (
            <input
              key={index}
              type="text"
              value={player}
              onChange={(e) => {
                const newPlayers = [...simulationPlayers];
                newPlayers[index] = e.target.value;
                setSimulationPlayers(newPlayers);
              }}
              className="w-full p-2 mb-2 text-black"
              placeholder={`Player ${index + 1}`}
            />
          ))}
          <button
            onClick={() => setSimulationPlayers([...simulationPlayers, `Player ${simulationPlayers.length + 1}`])}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            disabled={simulationPlayers.length >= 4}
          >
            Add Player
          </button>
          <button
            onClick={() => setSimulationPlayers(simulationPlayers.slice(0, -1))}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            disabled={simulationPlayers.length <= 2}
          >
            Remove Player
          </button>
          <button
            onClick={handleSimulateGame}
            className="bg-yellow-500 text-blue-900 px-4 py-2 rounded"
          >
            Start Simulation
          </button>
        </div>
      )}

      {activeTab === 'logs' && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Logs</h3>
          <div className="bg-gray-900 p-4 rounded max-h-96 overflow-auto">
            {logs.map((log, index) => (
              <p key={index} className="text-sm text-gray-300 mb-1">{log}</p>
            ))}
          </div>
        </div>
      )}

      {message && <p className="text-green-300 mt-4">{message}</p>}
    </div>
  );
};

export default AdminPanel;