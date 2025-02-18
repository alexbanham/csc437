import { useRef } from "react";

function Modal({ headerLabel, isOpen, onCloseRequested, children }) {
    const modalRef = useRef(null);

    if (!isOpen) return null; // Hide modal when not open

    const handleOverlayClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onCloseRequested();
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            onClick={handleOverlayClick}
        >
            <div
                ref={modalRef}
                className="bg-white p-5 rounded-lg shadow-lg w-96 relative"
            >
                {/* Header with Close Button */}
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h2 className="text-lg font-bold">{headerLabel}</h2>
                    <button
                        onClick={onCloseRequested}
                        aria-label="Close"
                        className="text-gray-500 hover:text-red-500"
                    >
                        ✖
                    </button>
                </div>

                {/* Modal Content */}
                {children}
            </div>
        </div>
    );
}

export default Modal;
