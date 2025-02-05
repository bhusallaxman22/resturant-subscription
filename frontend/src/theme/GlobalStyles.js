// src/theme/GlobalStyles.js
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #7C83FD;
    --secondary-color: #96BAFF;
    --bg-gradient: linear-gradient(145deg, #F5F6FF, #FFFFFF);
    --text-color: #2D3142;
    --card-bg: rgba(255, 255, 255, 0.8);
    --card-border: rgba(255, 255, 255, 0.5);
  }

  /* Reset & smooth transitions */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  body {
    background: var(--bg-gradient);
    color: var(--text-color);
    font-family: 'Nunito Sans', sans-serif;
    line-height: 1.6;
    min-height: 100vh;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  img {
    display: block;
    max-width: 100%;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
`;

export default GlobalStyles;
