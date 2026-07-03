import { createBoardApi, getAllBoardApi, getBoardApi } from "@/api/board";
import type { Board, BoardDetail } from "@/interfaces/board";
import Cookies from "js-cookie";
import { createContext, useContext, useState } from "react";



interface BoardContextType {

    getBoard: (boardId: string) => Promise<BoardDetail>;
    createBoard: () => Promise<BoardDetail>;
    getAllBoard: () => Promise<Board[]>;
    board: BoardDetail | null;
    boards: Board[];
    loading: boolean;
    loadingBoards: boolean;
}

const BoardContext = createContext<BoardContextType | undefined>(
  undefined
);

export const BoardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

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
            if (!token) {
                throw new Error("No token found");
            }
            const boardData = await getBoardApi(boardId, token);
            console.log("boardData", boardData);
            setBoard(boardData);
            return boardData;
        } catch (error) {
            console.error("Error fetching board:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const createBoard = async (title: string = "Untitled"): Promise<BoardDetail> => {
        setLoading(true);
        try {
            const token = Cookies.get("token");
            if (!token) {
                throw new Error("No token found");
            }
            console.log("Creating board with title:", title);
            const newBoard = await createBoardApi(title, token);
            setBoard(newBoard);
            return newBoard;
        } catch (error) {
            console.error("Error creating board:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return (
        <BoardContext.Provider value={{ getBoard, createBoard, getAllBoard, board, loading, boards, loadingBoards }}>
            {children}
        </BoardContext.Provider>
    );

}

export const useBoard = () => {
    const context = useContext(BoardContext);
    if (context === undefined) {
        throw new Error("useBoard must be used within a BoardProvider");
    }
    return context;
}