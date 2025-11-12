

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        }
      }
    },
  },
  plugins: [],
}














// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: {
//           50: '#f0f9ff',
//           100: '#e0f2fe',
//           500: '#0ea5e9',
//           600: '#0284c7',
//           700: '#0369a1',
//         },
//         success: {
//           50: '#f0fdf4',
//           500: '#22c55e',
//           600: '#16a34a',
//         },
//         warning: {
//           50: '#fffbeb',
//           500: '#f59e0b',
//           600: '#d97706',
//         }
//       }
//     },
//   },
//   plugins: [],
// }