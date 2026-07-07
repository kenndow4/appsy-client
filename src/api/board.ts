import type { Board } from "@/interfaces/board";
import { Api } from "@/lib/api";
import type { BoardContent } from "@/store";

export const getBoardApi = async (boardId: string, token: string): Promise<any> => {
    try {
        const res = await Api.get(`/boards/${boardId}`, token);
        return res;
    }catch (error) {
        console.error("Error fetching board:", error);
        throw error;
    }
}

export const getAllBoardApi = async ( token: string): Promise<Board[]> => {
    try {
        const res = await Api.get(`/boards/my-boards/`, token);
        return res;
    }catch (error) {
        console.error("Error fetching board:", error);
        throw error;
    }
}
export const createBoardApi = async (title:string,token: string): Promise<any> => {
    try {
        console.log("createBoardApi called with title:", title, "and token:", token);
        const res = await Api.post(`/boards`, { title }, token);
        console.log("createBoardApi res:", res);
        return res;
    }catch (error) {
        console.error("Error creating board:", error);
        throw error;
    }
}

export const iaApi = async (boardId: string, msg: string, token: string): Promise<any> => {
    try {
        const res = await Api.post(`/ia/${boardId}`, { msg }, token);
        return res;
    }catch (error) {
        console.error("Error sending message to IA:", error);
        throw error;
    }   
}

export const updateBoardApi = async (boardId: string, board: BoardContent, token: string): Promise<any> => {
    try {
        const res = await Api.put(`/boards/${boardId}`, board, token);
        return res;
    }catch (error) {
        console.error("Error updating board:", error);
        throw error;
    }
}