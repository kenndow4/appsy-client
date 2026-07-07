import { create } from "zustand";
import { debounce } from "lodash";
import Cookies from "js-cookie";
import { updateBoardApi } from "./api/board";
import type { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";

export interface BoardContent {
   elements: readonly OrderedExcalidrawElement[];
}

interface BoardStore {
  updateBoard: (boardId: string, board: BoardContent) => void;
  flushPending: () => void;
}

const debouncedUpdate = debounce(
  async (boardId: string, board: BoardContent) => {
    const token = Cookies.get("token");

    if (!boardId || !token) return;

    try {
      await updateBoardApi(boardId, board, token);
      console.log("✅ Guardado en servidor");
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  },
  3000
);

const useBoardStore = create<BoardStore>(() => ({
  updateBoard: (boardId, board) => {
    localStorage.setItem(
      `board-${boardId}`,
      JSON.stringify(board)
    );

    debouncedUpdate(boardId, board);
  },

  flushPending: () => {
    debouncedUpdate.flush();
  },
}));

export default useBoardStore;