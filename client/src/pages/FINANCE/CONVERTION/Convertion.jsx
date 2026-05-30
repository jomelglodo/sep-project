import React, { useState, useRef } from "react";
import "../../../assets/styles/FINANCE/CONVERTION/Convertion.css";

export default function Convertion() {
  const [number, setNumber] = useState("");
  const [text, setText] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const selectRef = useRef(null);
  const numberRef = useRef(null);

  const convertNumberToText = (num) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];

    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    num = parseInt(num);

    if (isNaN(num)) return "";

    if (num === 0) return "Zero";

    if (num < 10) return ones[num];

    if (num < 20) return teens[num - 10];

    if (num < 100) {
      return tens[Math.floor(num / 10)] + " " + ones[num % 10];
    }

    if (num < 1000) {
      return (
        ones[Math.floor(num / 100)] +
        " Hundred " +
        convertNumberToText(num % 100)
      );
    }

    if (num < 1000000) {
      return (
        convertNumberToText(Math.floor(num / 1000)) +
        " Thousand " +
        convertNumberToText(num % 1000)
      );
    }

    if (num < 10000000) {
      const millions = Math.floor(num / 1000000);
      const remainder = num % 1000000;

      let result = "";

      if (millions === 10) {
        result = "Ten Million";
      } else {
        result = convertNumberToText(millions) + " Million";
      }

      if (remainder > 0) {
        result += " " + convertNumberToText(remainder);
      }
      return result;
    }

    return "Number too large";
  };

  const handleConvert = () => {
    if (!number) {
      alert("Please enter a number!");
      numberRef.current.focus();
      return;
    }

    if (!selectedCurrency) {
      alert("Please select the currency!");
      selectRef.current.focus();
      return;
    }

    setText(convertNumberToText(number) + " " + selectedCurrency);
  };

  /* copy converted text */
  function copyConvertedText() {
    const copyText = document.querySelector(".converted-text").innerText;

    navigator.clipboard
      .writeText(copyText)
      .then(() => {
        alert("Copied to Clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  }

  return (
    <div className="convertion-page">
      <div className="convertion-card">
        <div className="card-header">
          <h2>Number to Text Converter</h2>
          <p>Convert numerical values into readable text format</p>
        </div>

        <div className="converter-body">
          <div className="input-group">
            <label>Enter a Number</label>
            <input
              type="number"
              value={number}
              ref={numberRef}
              onChange={(e) => setNumber(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  {
                    handleConvert();
                  }
                }
              }}
              placeholder="Example: 1250"
            />
            <label>Select Currency</label>
            <select
              ref={selectRef}
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              <option value="" disabled>
                -- Choose --
              </option>
              <option value="Dollars">Dollars</option>
              <option value="Yen">Yen</option>
              <option value="Peso">Peso</option>
            </select>
          </div>

          <button className="convert-btn" onClick={handleConvert}>
            Convert
          </button>

          <div className="result-box">
            <div className="result-header">
              <label>Converted Text</label>
              <button className="btn-copy-text" onClick={copyConvertedText}>
                Copy Text
              </button>
            </div>

            <div className="result-text">
              <span className="converted-text">
                {text || "Converted result will appear here"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
