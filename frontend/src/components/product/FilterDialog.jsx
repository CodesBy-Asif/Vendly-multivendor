import React from "react";

const FilterDialog = ({ isOpen, onClose, children }) => {

    if (!isOpen) return null;


    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 z-40"
                onClick={onClose}
            ></div>

            {/* Panel */}
            <div className="fixed inset-y-0 right-0 z-50 w-80 bg-default shadow-lg p-6 overflow-y-auto transition-transform duration-300 transform translate-x-0">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Filters</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-primary text-sm"
                    >
                        ✕
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </>
    );
};

export default FilterDialog;
