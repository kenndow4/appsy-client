import { createContext, useContext } from "react";
import type { Board, BoardDetail } from "@/interfaces/board";

export interface BoardContextType {
  getBoard: (boardId: string) => Promise<BoardDetail>;
  createBoard: (title?: string) => Promise<BoardDetail>;
  getAllBoard: () => Promise<Board[]>;
  deleteBoard: (boardId: string) => Promise<void>;
  renameBoard: (boardId: string, title: string) => Promise<void>;
  board: BoardDetail | null;
  boards: Board[];
  loading: boolean;
  loadingBoards: boolean;
}

export const BoardContext = createContext<BoardContextType | undefined>(
  undefined,
);

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
};
