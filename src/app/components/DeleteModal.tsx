import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isFinalDeletion?: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isFinalDeletion,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-9 rounded-xl shadow-lg w-full max-w-[500px] min-h-[220px] flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Delete Review</h2>

        <div className="mb-6">
          Are you sure you want to delete this review?
          {isFinalDeletion && (
            <span className="text-red-500 italic">
              &nbsp;
              Since an admin has modified this review, you will not be able to
              create a new one on this booking.
            </span>
          )}
        </div>

        <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
          <Button onClick={onClose}>Cancel</Button>

          <Button variant="contained" color="error" onClick={onConfirm}>
            Delete
          </Button>
        </Box>
      </div>
    </div>
  );
}
