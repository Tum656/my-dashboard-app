export default function Backdrop({
                                     isOpen,
                                     onClose,
                                 }: {
    isOpen: boolean;
    onClose: () => void;
}) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={onClose}
        ></div>
    );
}
