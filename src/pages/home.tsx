import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { Nav } from "@/components/navigator";
import { useBoard } from "@/provider/board.context";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { SiderBarComponent } from "@/components/sidebar.component";
import useBoardStore from "@/store";

function Home() {
  const { loading, board, getBoard, createBoard, getAllBoard } = useBoard();
  const boardId = Cookies.get("boardId");
  const { updateBoard, flushPending } = useBoardStore();

  useEffect(() => {
    const handleBeforeUnload = () => {
      flushPending();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      flushPending();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [flushPending]);

  useEffect(() => {
    const handleBoardInit = async () => {
      const getBoardAll = await getAllBoard();
      if (getBoardAll === null || getBoardAll.length === 0) {
        const newBoard = await createBoard();
        Cookies.set("boardId", newBoard.id);
      } else {
        const firstBoard = getBoardAll[0];
        Cookies.set("boardId", firstBoard.id);
        await getBoard(firstBoard.id);
      }
    };

    if (boardId) {
      getBoard(boardId);
    } else {
      handleBoardInit();
    }
    // Solo depende de boardId: las funciones del provider se recrean en cada
    // render y listarlas aquí provocaría un bucle infinito de peticiones.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  return (
    <div className="flex h-screen bg-[#f8f9fa]">
      {/* SIDEBAR */}
      <SiderBarComponent />

      {/* MAIN COLUMN */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* TOPBAR */}
        <Nav />

        {/* CANVAS */}
        <main className="relative flex-1">
          {loading ? (
            <div className="absolute top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-white bg-opacity-50">
              <div className="text-gray-500 text-lg">Cargando...</div>
            </div>
          ) : (
            <Excalidraw
              key={board?.id}
              initialData={board}
              onChange={(elements) => {
                if (!board) return;

                updateBoard(board.id, {
                  ...board,
                  elements,
                });
              }}
            />
          )}
        </main>

        {/* FOOTER */}
        <footer className="flex h-9 items-center justify-between border-t border-gray-200 bg-white px-6">
          <div className="flex gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              Listo
            </span>
            <span>100%</span>
          </div>

          <span className="text-xs text-gray-500">Sketra v1.0</span>
        </footer>
      </div>
    </div>
  );
}

export default Home;
