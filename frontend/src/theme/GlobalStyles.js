import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  body {
    background: linear-gradient(145deg, #F5F6FF, #FFFFFF);
    color: #333;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center; /* Center everything */
    justify-content: center;
    min-height: 100vh;
  }

  .container {
   width: 100%;
    max-width: 1440px;
    margin: 32px auto;
    padding: 40px;
    border-radius: 32px;
    box-shadow: 12px 12px 32px rgba(0, 0, 0, 0.06),
                -8px -8px 24px rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.7);

        &:hover {
        transform: translateY(-4px);
        box-shadow: 16px 16px 40px rgba(0, 0, 0, 0.1),
                    -12px -12px 32px rgba(255, 255, 255, 0.9);

    }
  }

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

@keyframes scaleIn {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.MuiButton-root {
  transition: all 0.3s ease!important;
}

img {
  transition: transform 0.3s ease;
}

.MuiButton-root {
  transition: all 0.3s ease!important;
}

img {
  transition: transform 0.3s ease;
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
  border-radius: 8px!important;
  border: none!important;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.1)!important;
  margin: 2px!important;
}

.fc-event:hover {
  transform: translateY(-2px);
  box-shadow: 4px 4px 12px rgba(0,0,0,0.15)!important;
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
    .MuiListItem-root {
    border-radius: 16px;
    margin: 8px 16px;
    transition: all 0.2s ease;
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.04),
                -2px -2px 8px rgba(255, 255, 255, 0.6);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 6px 6px 16px rgba(0, 0, 0, 0.06),
                  -4px -4px 12px rgba(255, 255, 255, 0.8);
    }
  }
`;

export default GlobalStyles;