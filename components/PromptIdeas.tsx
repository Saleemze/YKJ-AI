import React from 'react';

interface PromptIdeasProps {
  ideas: string[];
  onSelectPrompt: (prompt: string) => void;
  title: string;
}

const PromptIdeas: React.FC<PromptIdeasProps> = ({ ideas, onSelectPrompt, title }) => {
  return (
    <div className="mt-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-slate-300 mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {ideas.map((idea, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(idea)}
            className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-full text-sm hover:bg-purple-600 hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 focus-visible:ring-purple-500"
            aria-label={`Use prompt: ${idea}`}
          >
            {idea}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptIdeas;
