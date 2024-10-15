interface Question {
  question: string;
  answer: string;
}

interface Category {
  name: string;
  questions: Question[];
}

export const jeopardyData: Category[] = [
  {
    name: "History",
    questions: [
      { question: "Who was the first President of the United States?", answer: "George Washington" },
      { question: "In which year did World War II end?", answer: "1945" },
      { question: "Who was known as the 'Maid of Orleans'?", answer: "Joan of Arc" },
      { question: "Which empire was ruled by Genghis Khan?", answer: "The Mongol Empire" },
      { question: "What was the ancient Egyptian writing system called?", answer: "Hieroglyphics" }
    ]
  },
  {
    name: "Science",
    questions: [
      { question: "What planet is known as the Red Planet?", answer: "Mars" },
      { question: "What is the chemical symbol for water?", answer: "H₂O" },
      { question: "What gas do plants absorb from the atmosphere?", answer: "Carbon Dioxide" },
      { question: "What is the hardest natural substance on Earth?", answer: "Diamond" },
      { question: "What is the powerhouse of the cell?", answer: "Mitochondria" }
    ]
  },
  {
    name: "Literature",
    questions: [
      { question: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare" },
      { question: "Who is the author of '1984'?", answer: "George Orwell" },
      { question: "Who wrote 'Pride and Prejudice'?", answer: "Jane Austen" },
      { question: "Who is the Greek goddess of wisdom?", answer: "Athena" },
      { question: "Who wrote 'The Divine Comedy'?", answer: "Dante Alighieri" }
    ]
  },
  {
    name: "Geography",
    questions: [
      { question: "What is the capital of France?", answer: "Paris" },
      { question: "Which country has the largest population?", answer: "China" },
      { question: "What is the smallest country in the world?", answer: "Vatican City" },
      { question: "Which desert is the largest in the world?", answer: "Sahara Desert" },
      { question: "Which river is the longest in the world?", answer: "Nile River" }
    ]
  },
  {
    name: "Sports",
    questions: [
      { question: "In which sport is the term 'home run' used?", answer: "Baseball" },
      { question: "Which sport uses a shuttlecock?", answer: "Badminton" },
      { question: "In which sport can you score a 'hat trick'?", answer: "Hockey or Soccer" },
      { question: "In which sport is the 'Vince Lombardi Trophy' awarded?", answer: "American Football (NFL Super Bowl)" },
      { question: "In which sport is the term 'slam dunk' used?", answer: "Basketball" }
    ]
  },
  {
    name: "Movies",
    questions: [
      { question: "Who directed the movie 'Jaws'?", answer: "Steven Spielberg" },
      { question: "What is the highest-grossing film of all time?", answer: "Avatar" },
      { question: "Who played Jack Dawson in the movie 'Titanic'?", answer: "Leonardo DiCaprio" },
      { question: "What is the name of the fictional country in 'Black Panther'?", answer: "Wakanda" },
      { question: "Which actor has won the most Academy Awards for Best Actor?", answer: "Daniel Day-Lewis" }
    ]
  },
  {
    name: "Music",
    questions: [
      { question: "Who is known as the 'King of Pop'?", answer: "Michael Jackson" },
      { question: "Which band performed the song 'Bohemian Rhapsody'?", answer: "Queen" },
      { question: "What instrument does Yo-Yo Ma play?", answer: "Cello" },
      { question: "Who wrote the opera 'The Magic Flute'?", answer: "Wolfgang Amadeus Mozart" },
      { question: "Which female artist has won the most Grammy Awards?", answer: "Beyoncé" }
    ]
  }
];

export function getRandomCategories(count: number): Category[] {
  const shuffled = [...jeopardyData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}