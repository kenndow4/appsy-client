import {
  createBoardApi,
  getAllBoardApi,
  getBoardApi,
  deleteBoardApi,
  renameBoardApi,
} from "@/api/board";
import type { Board, BoardDetail } from "@/interfaces/board";
import useBoardStore from "@/store";
import Cookies from "js-cookie";
import { useState } from "react";
import { BoardContext } from "./board.context";

export const BoardProvider = ({ children }: { children: React.ReactNode }) => {
  const [board, setBoard] = useState<BoardDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);

  const getAllBoard = async (): Promise<Board[]> => {
    setLoadingBoards(true);
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("No token found");

      const allBoards = await getAllBoardApi(token);
      setBoards(allBoards);
      return allBoards;
    } catch (error) {
      console.error("Error fetching all boards:", error);
      return [];
    } finally {
      setLoadingBoards(false);
    }
  };

  const getBoard = async (boardId: string): Promise<BoardDetail> => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("No token found");

      const boardData = await getBoardApi(boardId, token);
      setBoard(boardData);
      return boardData;
    } catch (error) {
      console.error("Error fetching board:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createBoard = async (
    title: string = "Untitled",
  ): Promise<BoardDetail> => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("No token found");

      const newBoard = await createBoardApi(title, token);
      setBoard(newBoard);
      return newBoard;
    } catch (error) {
      console.error("Error creating board:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const renameBoard = async (boardId: string, title: string): Promise<void> => {
    const newTitle = title.trim();
    if (!newTitle) return;

    const token = Cookies.get("token");
    if (!token) throw new Error("No token found");

    // Envía lo pendiente antes de renombrar, para que no pise el nombre
    useBoardStore.getState().flushPending();

    await renameBoardApi(boardId, newTitle, token);

    setBoards((prev) =>
      prev.map((b) => (b.id === boardId ? { ...b, title: newTitle } : b)),
    );
    // Importante: el autoguardado envía {...board, elements}, así que
    // board.title debe quedar con el nombre nuevo o el siguiente guardado lo revierte.
    setBoard((prev) =>
      prev?.id === boardId ? { ...prev, title: newTitle } : prev,
    );
  };

  const deleteBoard = async (boardId: string): Promise<void> => {
    setLoading(true);

    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("No token found");

      await deleteBoardApi(boardId, token);

      useBoardStore.getState().discardBoard(boardId);

      const remainingBoards = boards.filter((b) => b.id !== boardId);

      setBoards(remainingBoards);

      if (Cookies.get("boardId") === boardId) {
        Cookies.remove("boardId");
      }

      if (board?.id === boardId) {
        setBoard(null);

        if (remainingBoards.length > 0) {
          const nextBoard = await getBoard(remainingBoards[0].id);
          Cookies.set("boardId", nextBoard.id);
        } else {
          const newBoard = await createBoard();
          Cookies.set("boardId", newBoard.id);
          setBoards((prev) => [
            ...prev,
            {
              id: newBoard.id,
              userId: newBoard.userId,
              title: newBoard.title,
              createdAt: newBoard.createdAt,
              updatedAt: newBoard.updatedAt,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error deleting board:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <BoardContext.Provider
      value={{
        getBoard,
        createBoard,
        getAllBoard,
        renameBoard,
        deleteBoard,
        board,
        loading,
        boards,
        loadingBoards,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
