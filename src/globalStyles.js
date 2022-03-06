import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

  body {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    background-color: gray;
  }

  

`;

export default GlobalStyle;
