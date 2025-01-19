import React from "react";
import sendIcon from "../assets/images/ai.png";
import MDEditor from '@uiw/react-md-editor';


function ChatResponse({ question, answer }) {
  return (
    <div className="w-full h-fit border-b-2 border-[#f5f5f5] min-h-14 flex-col items-center p-2 mb-5">
      <div className="flex">
        <img src={sendIcon} className="h-full w-10" alt="send icon" />
        <div className="ms-5 my-auto w-full break-words font-bold">{question}</div>
      </div>

      <div className="flex">
        <div className="h-full w-10 p-2"></div>

        <div className="ms-5 h-full w-full break-words">
          {/* Render markdown */}
          <MDEditor.Markdown source={answer} style={{ backgroundColor:"white" , color:"black"}} />     </div>
      </div>
    </div>
  );
}

export default ChatResponse;
