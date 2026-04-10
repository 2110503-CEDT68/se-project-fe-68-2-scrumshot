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

        <div className="flex gap-7 justify-end mt-auto">
          <button className="px-5 py-2 max-h-[45px] text-base font-medium leading-6 text-white bg-blue-600 hover:bg-blue-700 rounded-md cursor-pointer border-[nonepx]">Cancel</button>
          <button className="px-5 py-2 max-h-[45px] text-base font-medium leading-6 text-white bg-red-600 hover:bg-red-700 rounded-md cursor-pointer border-[nonepx]">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}