import React, {useState} from "react"
import './App.css';
import Button from './components/button/button.js';
import {evaluate} from "mathjs"

function App() {
  const[input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleclick= (value) => {
    setInput((prevInput) => prevInput + value)
  }

  const handleClear = () => {
    setInput("");
    setResult("");
  }

  const handleEqual = () => {
    try {
      setResult(evaluate(input).toString());
    } catch (error) {
      setResult("Invalid operation")
    }
  }

  return (
    <div className="calculator">
      <div className="display">
        <div className="input">{input}</div>
        <div className="result">{result}</div>
      </div>
      <div className="buttons">
        <Button className={"clear"} onClick={handleClear}>
          C
        </Button>
        <Button onClick={() => handleclick("(")}>(</Button>
        <Button onClick={() => handleclick(")")}>)</Button>
        <Button className={"operator"} onClick={() => handleclick("/")}>/</Button>
        <Button onClick={() => handleclick("7")}>7</Button>
        <Button onClick={() => handleclick("8")}>8</Button>
        <Button onClick={() => handleclick("9")}>9</Button>
        <Button className={"operator"} onClick={() => handleclick("*")}>*</Button>
        
        <Button onClick={() => handleclick("4")}>4</Button>
        <Button onClick={() => handleclick("5")}>5</Button>
        <Button onClick={() => handleclick("6")}>6</Button>
        <Button className={"operator"} onClick={() => handleclick("+")}>+</Button>
        
        <Button onClick={() => handleclick("1")}>1</Button>
        <Button onClick={() => handleclick("2")}>2</Button>
        <Button onClick={() => handleclick("3")}>3</Button>
        <Button className={"operator"} onClick={() => handleclick("-")}>-</Button>

        <Button onClick={() => handleclick(".")}>.</Button>
        <Button onClick={() => handleclick("0")}>0</Button>
        <Button className={"equal"} onClick={handleEqual}>=</Button>
      </div>
    </div>
  );
}

export default App;
