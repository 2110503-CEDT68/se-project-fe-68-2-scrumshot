import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

export default function DeleteModal() {
  return (
    <div
      className="fixed inset-0 backdrop-blur-xm bg-black/30 flex items-center justify-center"
    >
      <div
        className="bg-white p-9 rounded-xl shadow-lg w-full max-w-[500px] min-h-[220px] flex flex-col"
      >
        <h2 className="text-lg font-semibold mb-4">Delete Review</h2>

        <div className="mb-6">Are you sure you want to delete this review?</div>

        <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
          <Button>
            Cancle
          </Button>

          <Button
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </Box>
      </div>
    </div>
  );
}