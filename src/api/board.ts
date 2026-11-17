import type { Board } from "@/interfaces/board";
import { Api } from "@/lib/api";
import type { BoardContent } from "@/store";

export const getBoardApi = async (
  boardId: string,
  token: string,
): Promise<any> => {
  try {
    const res = await Api.get(`/boards/${boardId}`, token);
    return res;
  } catch (error) {
    console.error("Error fetching board:", error);
    throw error;
  }
};

export const getAllBoardApi = async (token: string): Promise<Board[]> => {
  try {
    const res = await Api.get(`/boards/my-boards/`, token);
    return res;
  } catch (error) {
    console.error("Error fetching board:", error);
    throw error;
  }
};

export const createBoardApi = async (
  title: string,
  token: string,
): Promise<any> => {
  try {
    const res = await Api.post(`/boards`, { title }, token);
    return res;
  } catch (error) {
    console.error("Error creating board:", error);
    throw error;
  }
};

export const iaApi = async (
  boardId: string,
  msg: string,
  token: string,
): Promise<any> => {
  try {
    const res = await Api.post(`/ia/${boardId}`, { msg }, token);
    return res;
  } catch (error) {
    console.error("Error sending message to IA:", error);
    throw error;
  }
};

export const updateBoardApi = async (
  boardId: string,
  board: BoardContent,
  token: string,
): Promise<any> => {
  try {
    const res = await Api.put(`/boards/${boardId}`, board, token);
    return res;
  } catch (error) {
    console.error("Error updating board:", error);
    throw error;
  }
};

export const deleteBoardApi = async (
  boardId: string,
  token: string,
): Promise<void> => {
  try {
    await Api.delete(`/boards/${boardId}`, token);
  } catch (error) {
    console.error("Error deleting board:", error);
    throw error;
  }
};
export const renameBoardApi = async (
  boardId: string,
  title: string,
  token: string,
) => {
  try {
    const res = await Api.put(`/boards/${boardId}/rename`, { title }, token);

    return res;
  } catch (error) {
    console.error("Error renaming board:", error);
    throw error;
  }
};
