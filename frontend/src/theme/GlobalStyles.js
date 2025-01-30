import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: "Roboto", sans-serif;
    background-color: #f5f5f5;
    color: #333;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center; /* Center everything */
    justify-content: center;
    min-height: 100vh;
  }

 #root {
    width: 100%;
    max-width: 1200px; /* Ensures content doesn't overflow */
    margin: 0 auto;
  }


  .MuiToolbar-root {
    min-height: 76px;
    backdrop-filter: blur(8px);
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: color 0.2s ease;
    
    &:hover {
      color: #6366f1;
    }
  }

  button {
    font-family: inherit;
    transition: all 0.2s ease;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    color: #121315;
  }

  p, span, button, input, textarea {
    font-size: 1rem;
    line-height: 1.6;
  }

  .container {
    width: 100%;
    max-width: 1440px;
    margin: 32px auto;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
      box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
    }
  }

  .centered-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
  }

  .justified-text {
    text-align: justify;
    text-justify: inter-word;
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
  }

  .full-width {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
  }
    
  .fc {
    font-family: "Inter", sans-serif;
  }

  .fc-toolbar-title {
    font-size: 1.75rem;
    font-weight: 700;
  }

  .fc-event {
    font-size: 0.9rem;
    border-radius: 8px;
    padding: 6px;
  }

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
