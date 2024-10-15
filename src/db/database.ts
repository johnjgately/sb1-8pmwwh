import initSqlJs from 'sql.js';
import { jeopardyData } from '../data/jeopardyData';

let db: any;
let dbInitialized = false;

export async function initDatabase() {
  if (dbInitialized) return;

  const SQL = await initSqlJs({
    locateFile: file => `https://sql.js.org/dist/${file}`
  });
  db = new SQL.Database();

  // Initialize the database schema
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      value INTEGER NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories (id)
    );
  `);

  initializeDatabase();
  dbInitialized = true;
}

function initializeDatabase() {
  jeopardyData.forEach((category) => {
    const categoryId = addCategory(category.name);
    category.questions.forEach((q, index) => {
      addQuestion(categoryId, q.question, q.answer, (index + 1) * 100);
    });
  });
}

export function getRandomCategories(count: number): { id: number; name: string }[] {
  if (!dbInitialized) {
    throw new Error("Database not initialized");
  }
  const result = db.exec('SELECT * FROM categories ORDER BY RANDOM() LIMIT ?', [count]);
  return result[0]?.values.map((row: any[]) => ({
    id: row[0],
    name: row[1]
  })) || [];
}

export function getQuestionsByCategory(categoryId: number): { id: number; question: string; answer: string; value: number }[] {
  if (!dbInitialized) {
    throw new Error("Database not initialized");
  }
  const result = db.exec('SELECT id, question, answer, value FROM questions WHERE category_id = ? ORDER BY value', [categoryId]);
  return result[0]?.values.map((row: any[]) => ({
    id: row[0],
    question: row[1],
    answer: row[2],
    value: row[3]
  })) || [];
}

export function addCategory(name: string): number {
  const stmt = db.prepare('INSERT INTO categories (name) VALUES (?)');
  stmt.run([name]);
  stmt.free();
  return db.exec('SELECT last_insert_rowid()')[0].values[0][0];
}

export function addQuestion(categoryId: number, question: string, answer: string, value: number): number {
  const stmt = db.prepare('INSERT INTO questions (category_id, question, answer, value) VALUES (?, ?, ?, ?)');
  stmt.run([categoryId, question, answer, value]);
  stmt.free();
  return db.exec('SELECT last_insert_rowid()')[0].values[0][0];
}

export { db, dbInitialized };