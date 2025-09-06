// tailwind.config.js
export const darkMode = 'class';
export const content = [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
    extend: {
        fontFamily: {
            lavishly: ["var(--font-lavishly-yours)"], // Next.js font variable
        },
    },
};
export const plugins = [];
