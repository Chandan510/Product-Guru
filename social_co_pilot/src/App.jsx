import { useState, useRef, useEffect } from "react";
import "./App.css";
import "./index.css";
import "./assets/fonts/digital_desolation.ttf";
import sendIcon from "../src/assets/images/send-icon.svg";
import ChatResponse from "./components/ChatResponse.component";
import PropagateLoader from "react-spinners/PropagateLoader";


// import 'dotenv/config'

const LANGFLOW_URL = import.meta.env.VITE_LANGFLOW_API_URL;



function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState([]);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  
  }, [answer]);

  async function fetchAPI() {
    try {
      if (question != "") {
        setLoading(true);
        const url = `${LANGFLOW_URL}${question}`;
        const response_mid = await fetch(url);
        (url)
        const response = await response_mid.json();
        (response);
        if (response) {
          setAnswer([
            ...answer,
            { question: response.question, answer: response.answer },
          ]);
        }
        setLoading(false);
        setQuestion("");
      }
    } catch (error) {
      (error);
    }
  }



  return (
    <div className="min-h-screen w-full bg-[#f5f5f5] p-2">
      <div className="w-full h-[10vh]  flex text-center my-auto items-center p-2 ">
        <p className="font-bold font-inter_semibold text-2xl w-fit p-6 h-fit text-left ms-4 mt-5">
          Product{" "}
          <span className="bg-[#FF4D00] rounded-md text-white px-2 py-1 font-dd  ">
            Guru
          </span>{" "}
        </p>
      </div>

      {/* Main chat section */}
      <div className=" h-[80vh] mt-5 px-6  w-full  ">
        {/* <div className="absolute -inset-2 bg-gradient-to-r from-[#F9CE34] via-[#EE2A7B] to-[#6228D7] opacity-75 blur ">Hello</div> */}
        <div className=" h-[80vh] w-full p-2 ">
          <div className="chat-diaglog h-full w-full border-4  border-[#EEEEEE]  rounded-md bg-white relative shadow-lg">
            {/* Chat header */}
            <div className="chat-header  absolute w-full h-10 text-center font-semibold text-2xl my-3">
              Chat
            </div>

            {/* Chat body */}
            <div className="w-full  flex justify-center absolute top-14 bottom-24 ">
              <div
                className="w-4/5 overflow-y-auto no-scrollbar"
                ref={scrollRef}
              >
                {answer.length > 0 ? (
                  answer.map((ans, i) => (
                    <ChatResponse
                      key={i}
                      question={ans.question}
                      answer={ans.answer}
                    />
                  ))
                ) : (
                  <div className="h-full text-center flex items-center justify-center text-2xl font-semibold text-[#4a4747]">
                    How may I help you today?
                  </div>
                )}
              </div>
            </div>

            {/* Chat footer absolute*/}
            <div className="chat-footer w-full h-fit  flex flex-col  items-center justify-center py-4 f-fit  absolute bottom-0 ">
              <div className="border-2 mb-6">
                <PropagateLoader color="#5EBFD6" loading={loading} />
              </div>
              <div className="w-4/5 text-lg flex items-center border-2 border-black">
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="h-full w-full p-4 focus:outline-none"
                  placeholder="Write something here.."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") fetchAPI();
                  }}
                />
                <button className="send-icon px-6 ">
                  <img onClick={fetchAPI} src={sendIcon} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}

export default App;
