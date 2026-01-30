import { GoogleGenAI } from "@google/genai";
import { SudokuGrid, KakuroGrid, AkariGrid } from "../types";

// Note: In a real production app, you would proxy this through a backend.
// For this demo, we use the key from environment as per instructions.

export const getSudokuHint = async (grid: SudokuGrid): Promise<string> => {
  if (!process.env.API_KEY) return "Please configure API Key to use this feature.";

  // FIX: Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const gridString = grid.map(row => row.map(c => c.value === 0 ? '.' : c.value).join(' ')).join('\n');

  const prompt = `
    You are a Sudoku expert. Here is the current board state (dots are empty cells):
    
    ${gridString}
    
    Please provide ONE logical next step or a reasoning hint.
    Requirements:
    1. DO NOT provide the full solution.
    2. Only give a hint for a specific cell or region.
    3. Explain the logic (e.g., "In row 3, number 5 can only be in cell... because...").
    4. Answer in English, concise and easy to understand.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    // FIX: Access .text property directly (not a method)
    return response.text || "No hint found.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI. Please try again.";
  }
};

export const getKakuroHint = async (grid: KakuroGrid): Promise<string> => {
  if (!process.env.API_KEY) return "Please configure API Key to use this feature.";

  // FIX: Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Simplify grid for AI context
  const gridRepresentation = grid.map(row => 
    row.map(c => {
      if (c.type === 'WALL') return '#';
      if (c.type === 'CLUE') {
        const d = c.downSum ? `D${c.downSum}` : '';
        const r = c.rightSum ? `R${c.rightSum}` : '';
        return `[${d}${d&&r?'/':''}${r}]`;
      }
      return c.value === 0 ? '.' : c.value;
    }).join(' | ')
  ).join('\n');

  const prompt = `
    You are a Kakuro (Sum Cross) expert. 
    Rules:
    1. Fill numbers 1-9 in empty cells.
    2. Sum of numbers in a horizontal run must match the clue to the left (R).
    3. Sum of numbers in a vertical run must match the clue above (D).
    4. NO duplicate numbers allowed in the same run.

    Current board state:
    - '#' is a wall.
    - '[Dxx/Ryy]' is a clue cell (D=Down, R=Right).
    - '.' is an empty cell.
    
    State:
    ${gridRepresentation}
    
    Find ONE logical next step based on the most constrained cells (e.g., sum of 3 in 2 cells can only be 1,2).
    Answer in English, concise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    // FIX: Access .text property directly (not a method)
    return response.text || "No hint found.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI. Please try again.";
  }
};

export const getAkariHint = async (grid: AkariGrid): Promise<string> => {
  if (!process.env.API_KEY) return "Please configure API Key to use this feature.";

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const gridRepresentation = grid.map(row => 
    row.map(c => {
      if (c.type === 'WALL') return c.value !== null ? `[${c.value}]` : '[#]';
      if (c.state === 'BULB') return 'B';
      if (c.isLit) return '*';
      return '.';
    }).join(' ')
  ).join('\n');

  const prompt = `
    You are an Akari (Light Up) expert.
    Rules:
    1. Place bulbs (B) in white cells to light up the entire grid.
    2. A bulb lights up its row and column until hitting a wall ([#] or [number]).
    3. Two bulbs cannot shine on each other.
    4. A numbered wall indicates exactly how many bulbs are adjacent to it (orthogonally).

    Current State:
    - '[#]' wall no number.
    - '[n]' wall with number n.
    - 'B' bulb placed.
    - '*' lit cell.
    - '.' unlit empty cell.

    Grid:
    ${gridRepresentation}

    Find ONE logical next step (e.g., a wall with 4 must have 4 bulbs around it).
    Answer in English, concise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || "No hint found.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI. Please try again.";
  }
};