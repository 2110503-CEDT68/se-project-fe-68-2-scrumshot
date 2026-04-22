"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { deleteCampground } from "@/libs/campgrounds";
import DeleteCampgroundModal from "./DeleteCampgroundModal";
import Button from "@mui/material/Button";

interface DeleteCampgroundButtonProps {
  campgroundId: string;
}

export default function DeleteCampgroundButton({
  campgroundId,
}: DeleteCampgroundButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!(session?.user as any)?.backendToken) return;

    const result = await deleteCampground(campgroundId, (session?.user as any).backendToken as string);

    if (result.success) {
      router.push("/campgrounds");
      router.refresh();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  if ((session?.user as any)?.role !== "admin") {
    return null;
  }

  return (
    <>
      <Button
        variant="contained"
        color="error"
        onClick={() => setIsModalOpen(true)}
        sx={{ ml: 2 }}
      >
        Delete Campground
      </Button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <DeleteCampgroundModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
      />
    </>
  );
}
