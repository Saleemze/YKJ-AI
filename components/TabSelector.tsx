import React from 'react';
import { Tab } from '../types';

interface TabSelectorProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TabButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 px-4 text-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 focus-visible:ring-purple-500 text-sm sm:text-base ${
        isActive
          ? 'bg-purple-600 text-white shadow-lg'
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
      }`}
    >
      {label}
    </button>
  );
};

const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onTabChange }) => (
  <div className="mt-8 p-1.5 bg-slate-800 rounded-xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 max-w-4xl mx-auto">
    <TabButton
      label="Generate Video"
      isActive={activeTab === Tab.Video}
      onClick={() => onTabChange(Tab.Video)}
    />
    <TabButton
      label="Generate Photo"
      isActive={activeTab === Tab.Photo}
      onClick={() => onTabChange(Tab.Photo)}
    />
    <TabButton
      label="Image/Video"
      isActive={activeTab === Tab.ImageToVideo}
      onClick={() => onTabChange(Tab.ImageToVideo)}
    />
    <TabButton
      label="Edit Image"
      isActive={activeTab === Tab.EditImage}
      onClick={() => onTabChange(Tab.EditImage)}
    />
    <TabButton
      label="Edit Video"
      isActive={activeTab === Tab.EditVideo}
      onClick={() => onTabChange(Tab.EditVideo)}
    />
     <TabButton
      label="AI-CI"
      isActive={activeTab === Tab.AIChat}
      onClick={() => onTabChange(Tab.AIChat)}
    />
  </div>
);

export default TabSelector;