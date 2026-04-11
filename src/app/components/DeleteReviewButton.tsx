type ButtonProps = {
    onClick?: () => void;
    className?: string ;
}

export default function DeleteReviewButton({
    onClick,
    className
}  : ButtonProps) {
    return (
        <button 
            onClick={onClick}
            className={`${className} px-5 py-2 max-h-[45px] text-base font-medium leading-6 text-white bg-red-600 hover:bg-red-700 rounded-md cursor-pointer border-[nonepx]`}>
            Delete
        </button>
    );
}