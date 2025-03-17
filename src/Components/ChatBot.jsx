import { useState } from 'react';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { 
  MainContainer, 
  ChatContainer, 
  MessageList, 
  Message, 
  MessageInput, 
  TypingIndicator 
} from '@chatscope/chat-ui-kit-react';

const AZURE_API_KEY = "0b9c53361dc945f4a866356180073582";
const AZURE_ENDPOINT = "https://iwmi-chat-demo.openai.azure.com/";
const AZURE_API_VERSION = "2024-02-15-preview";
const AZURE_DEPLOYMENT_NAME = "iwmi-gpt-4o";

const systemMessage = {
  "role": "system",
  "content": `You are a helpful assistant. Your name is NexusAssistant. 
  Currently, we focus on the University of Kelaniya. Below are details about club activities:

  **SESA Club**  
  The Software Engineering Students' Association (SESA) is the official student society for Software Engineering undergraduates at the Faculty of Science, University of Kelaniya. It fosters technical and soft skills, promotes collaboration, and unites students through educational and community initiatives. Key events include RealHack (hackathon), Junior Hack (for junior students), Inceptio (final-year celebrations), Node Fall (social event), beach cleaning programs, and outbound leadership training.

  **Gavel Club**  
  Established on October 21, 2004, the Gavel Club at the University of Kelaniya is the first Gavel Club in South Asia, affiliated with Toastmasters International USA. It helps undergraduates enhance public speaking, English language, and leadership skills. Key events include the Best Speaker Contest (inter-university), Inter-School Best Speaker Contest, and collaborative meetings with other university Gavel Clubs.`
};

function ChatBot() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm NexusAssistant! Ask me anything!",
      sentTime: "just now",
      sender: "NexusAssistant"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);

    await processMessageToAzure(newMessages);
  };

  async function processMessageToAzure(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "NexusAssistant" ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      "messages": [systemMessage, ...apiMessages],
      "temperature": 0.7,
      "max_tokens": 500
    };

    await fetch(`${AZURE_ENDPOINT}openai/deployments/${AZURE_DEPLOYMENT_NAME}/chat/completions?api-version=${AZURE_API_VERSION}`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${AZURE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then(response => response.json())
      .then(data => {
        if (data.choices && data.choices.length > 0) {
          setMessages([...chatMessages, {
            message: data.choices[0].message.content,
            sender: "NexusAssistant"
          }]);
        }
        setIsTyping(false);
      }).catch(error => {
        console.error("Error fetching response:", error);
        setIsTyping(false);
      });
  }

  return (
    <div className="App">
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList 
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="NexusAssistant is typing..." /> : null}
            >
              {messages.map((message, i) => (
                <Message key={i} model={message} />
              ))}
            </MessageList>
            <MessageInput placeholder="Type a message here..." onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default ChatBot;
