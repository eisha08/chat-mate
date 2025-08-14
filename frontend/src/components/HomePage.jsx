import React, { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { FiExternalLink } from "react-icons/fi";

function HomePage() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [homePage, setHomePage] = useState(true);

  const chatEndRef = useRef(null);

  const suggestions = [
    { question: "What is the tallest mountain in the world?", link: "https://en.wikipedia.org/wiki/Mount_Everest" },
    { question: "How does solar energy work?", link: "https://en.wikipedia.org/wiki/Solar_power" },
    { question: "What is quantum computing?", link: "https://en.wikipedia.org/wiki/Quantum_computing" },
    { question: "Explain black holes in simple terms", link: "https://en.wikipedia.org/wiki/Black_hole" },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  const getGeminiResponse = async (prompt) => {
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Backend API error:", data);
        return `Error: ${data.error?.message || "Unknown error"}`;
      }

      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    } catch (err) {
      console.error(err);
      return "Error generating response.";
    }
  };

  const handleSend = async () => {
    const userMsg = message.trim();
    if (!userMsg) return;

    setChatHistory((prev) => [...prev, { sender: "user", text: userMsg }]);
    setMessage("");
    setLoading(true);

    const botReply = await getGeminiResponse(userMsg);
    setChatHistory((prev) => [...prev, { sender: "bot", text: botReply }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center mt-10 gap-y-16 px-4 font-mono">
      {homePage ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {suggestions.map((item, index) => (
              <div
                key={index}
                className="bg-[#7b73a8] hover:-translate-y-2 cursor-pointer w-48 h-48 rounded-xl shadow-lg p-4 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-lg font-semibold">{item.question}</div>
                <button
                  onClick={() => window.open(item.link, "_blank")}
                  className="self-end p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                >
                  <FiExternalLink size={20} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setHomePage(false)}
            className="mt-6 px-10 font-mono py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Chat
          </button>
        </>
      ) : (
        <div className="flex flex-col w-full max-w-4xl bg-[#342680] rounded-xl shadow-lg overflow-hidden">
          {/* Back Button */}
          <div className="p-4 bg-[#2a2064] flex justify-between items-center">
            <h2 className="text-white text-lg font-semibold">Chat</h2>
            <button
              onClick={() => setHomePage(true)}
              className="px-3 py-1 bg-blue-900 text-white rounded hover:bg-blue-600"
            >
              Back to Home
            </button>
          </div>

          {/* Chat Messages */}
          <div
            className="flex-1 p-4 overflow-y-auto space-y-4"
            style={{ height: "60vh", scrollbarWidth: "thin", scrollbarColor: "#888 #2e2e2e" }}
          >
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs whitespace-pre-wrap break-words ${
                    msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="flex justify-center text-gray-400 italic">Thinking...</div>}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-2 p-4">
            <input
              className="bg-transparent flex-1 p-4 h-[5vh] border-2 border-gray-600 rounded-xl focus:outline-none text-white"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            {message && (
              <button
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                onClick={handleSend}
              >
                <IoSend size={20} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
