import ChatInit from "~/components/chat/chat-init";

export default function Home() {
  const handlePromptClick = (prompt: string) => {
    console.log("Selected prompt:", prompt);
  };

  return (
    <div className="container mx-auto h-screen">
      <ChatInit onPromptClick={handlePromptClick} />
    </div>
  );
}
