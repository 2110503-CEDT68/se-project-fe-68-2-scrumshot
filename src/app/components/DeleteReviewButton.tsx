import Button from "@mui/material/Button"

type ButtonProps = {
    onClick?: () => void;
}

export default function DeleteReviewButton({
    onClick,
}  : ButtonProps) {
    return (
        <Button
            variant="contained"
            color="error"
            onClick={onClick}
        >
            Delete
        </Button>
    );
}