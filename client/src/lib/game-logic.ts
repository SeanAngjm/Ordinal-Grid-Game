import { type GameQuestion, type QuestionType } from "@shared/schema";

// Generates a descriptive string for the question
export function getQuestionText(q: GameQuestion): string {
  if (q.type === 'linear') {
    if (q.direction === 'left') return `第 ${q.targetIndex + 1} 个`;
    if (q.direction === 'right') return `倒数第 ${q.totalItems - q.targetIndex} 个`;
  }
  if (q.type === 'grid') {
    return `第 ${q.targetRow! + 1} 行，第 ${q.targetCol! + 1} 列`;
  }
  return "";
}

export function getSpokenText(q: GameQuestion): string {
  if (q.type === 'linear') {
    const dir = q.direction === 'left' ? "左" : "右";
    const num = q.direction === 'left' ? q.targetIndex + 1 : q.totalItems - q.targetIndex;
    return `请找出，从${dir}数，第${num}个`;
  }
  if (q.type === 'grid') {
    return `请找出，第${q.targetRow! + 1}行，第${q.targetCol! + 1}列`;
  }
  return "";
}

export function generateQuestions(count: number, difficulty: 'warmup' | 'advanced'): GameQuestion[] {
  const questions: GameQuestion[] = [];
  
  for (let i = 0; i < count; i++) {
    const type: QuestionType = difficulty === 'warmup' ? 'linear' : 'grid';
    const id = Math.random().toString(36).substr(2, 9);
    
    if (type === 'linear') {
      const totalItems = 5 + Math.floor(Math.random() * 3); // 5 to 7 items
      const targetIndex = Math.floor(Math.random() * totalItems);
      const direction = Math.random() > 0.5 ? 'left' : 'right';
      
      questions.push({
        id,
        type,
        totalItems,
        targetIndex,
        direction,
        description: `Find item ${targetIndex + 1} from ${direction}`
      });
    } else {
      // Grid mode (Advanced)
      const rows = 3;
      const cols = 3; // 3x3 grid for simplicity on screens
      const targetRow = Math.floor(Math.random() * rows);
      const targetCol = Math.floor(Math.random() * cols);
      const targetIndex = targetRow * cols + targetCol;
      
      questions.push({
        id,
        type,
        totalItems: rows * cols,
        rows,
        cols,
        targetRow,
        targetCol,
        targetIndex,
        direction: 'top', // Default for grid usually starts top-left
        description: `Find Row ${targetRow + 1}, Col ${targetCol + 1}`
      });
    }
  }
  
  return questions;
}
