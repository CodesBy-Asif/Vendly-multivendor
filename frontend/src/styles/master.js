// styles.js

// Tailwind CSS utility classes
export const buttonStyles = {
    primary: "bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition",
    secondary: "bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary-dark transition",
    outline: "border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition",
    danger: "bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition",
};

export const textStyles = {
    heading1: "text-3xl font-bold text-heading mb-4",
    heading2: "text-2xl font-semibold text-heading mb-3",
    paragraph: "text-base text-body mb-2",
    muted: "text-sm text-muted",
};

export const cardStyles = {
    base: "bg-white shadow-md rounded-xl p-4",
    withHover: "bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition",
};

export const inputStyles = {
    base: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary",
    error: "border-red-500 focus:ring-red-500",
};

export const layoutStyles = {
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    section: "py-4 sm:py-2 ",
};

export const iconButton = "p-2 rounded-full hover:bg-gray-100 transition";

// Utility classes
export const spacing = {
    marginY: "my-4",
    paddingX: "px-6",
};
