import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useBoard } from "@/provider/board.context";

interface DeleteBoardButtonProps {
  boardId: string;
  className?: string;
}

export const DeleteBoardButton = ({
  boardId,
  className = "",
}: DeleteBoardButtonProps) => {
  const { deleteBoard } = useBoard();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // evita seleccionar la pizarra al borrarla
    if (deleting) return;
    if (!window.confirm("¿Borrar esta pizarra? No se puede deshacer.")) return;

    setDeleting(true);
    try {
      await deleteBoard(boardId);
    } catch {
      alert("No se pudo borrar la pizarra");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      aria-label="Borrar pizarra"
      className={`flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {deleting ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Trash2 size={14} />
      )}
    </button>
  );
};
