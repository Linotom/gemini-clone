import React, { useState, useEffect } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
console.log("Loaded API KEY:", API_KEY);

const Main = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [typing, setTyping] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    setPrompt('');
    setDisplayedText('');
    setResponse('');
    setTyping(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);

      // ✅ Use correct model name - either "gemini-1.5-pro" or "gemini-2.5-pro"
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([prompt]);
    const text = await result.response.text();
    setResponse(text);
   
      setResponse(text);
    } catch (err) {
      console.error("Gemini API error:", err);
      setTyping(false);
      setDisplayedText("❌ Failed to fetch response from Gemini.");
    }
  };

  useEffect(() => {
    if (typing && response) {
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + response.charAt(index));
        index++;
        if (index >= response.length) {
          clearInterval(interval);
          setTyping(false);
        }
      }, 20);

      return () => clearInterval(interval);
    }
  }, [response, typing]);

  return (
    <div className='main'>
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="User Icon" />
      </div>

      <div className="main-container">
        <div className="greet">
          <p><span>Hello, Lino</span></p>
          <p>How can I help you today</p>
        </div>

        <div className="cards">
          <div className="card">
            <p>Suggest beautiful places to see on an upcoming road trip</p>
            <img src={assets.compass_icon} alt="Compass" />
          </div>
          <div className="card">
            <p>Briefly summarize the concept: urban planning</p>
            <img src={assets.bulb_icon} alt="Bulb" />
          </div>
          <div className="card">
            <p>Brainstorm team bonding activities for our work retreat</p>
            <img src={assets.message_icon} alt="Message" />
          </div>
          <div className="card">
            <p>Improve the readability of the following code</p>
            <img src={assets.code_icon} alt="Code" />
          </div>
        </div>

        <div className="main-bottom">
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter a prompt here"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <div onClick={handleSend}>
              <img src={assets.gallery_icon} alt="Gallery" />
              <img src={assets.mic_icon} alt="Mic" />
              <img src={assets.send_icon} alt="Send" />
            </div>
          </div>

          {displayedText && (
            <div className="output-box">
              <p><strong>Gemini: </strong> {displayedText}</p>
            </div>
          )}

          <p className="bootm-info">
            Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
