
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertTriangle, ShieldCheck, Users, Search, MessageSquare, ArrowLeft } from 'lucide-react';
import { User, Message } from '../types';

interface CityHallSectionProps {
  isDarkMode: boolean;
  currentUser: User;
  messages: Message[];
  onSendMessage: (recipient: string, text: string) => void;
  onReadMessages: (withUsername: string) => void;
}

type HallTab = 'Community';

const CityHallSection: React.FC<CityHallSectionProps> = ({ isDarkMode, currentUser, messages, onSendMessage, onReadMessages }) => {
  const [activeTab] = useState<HallTab>('Community');
  const [input, setInput] = useState('');

  // Community State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCitizen, setSelectedCitizen] = useState<User | null>(null);

  const allUsers: User[] = useMemo(() => {
    return JSON.parse(localStorage.getItem('mooderia_all_users') || '[]');
  }, []);

  const filteredCitizens = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return allUsers.filter(u => 
      u.username !== currentUser.username && 
      (u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
       u.username.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, allUsers, currentUser.username]);

  const conversationUsers = useMemo(() => {
    const userNames = new Set<string>();
    messages.forEach(m => {
      if (m.sender === currentUser.username) userNames.add(m.recipient);
      if (m.recipient === currentUser.username) userNames.add(m.sender);
    });
    return allUsers.filter(u => userNames.has(u.username));
  }, [messages, allUsers, currentUser.username]);

  const chatMessages = useMemo(() => {
    if (!selectedCitizen) return [];
    return messages.filter(m => 
      (m.sender === currentUser.username && m.recipient === selectedCitizen.username) ||
      (m.sender === selectedCitizen.username && m.recipient === currentUser.username)
    ).sort((a, b) => a.timestamp - b.timestamp);
  }, [messages, selectedCitizen, currentUser.username]);

  const unreadPerUser = useMemo(() => {
    const counts: Record<string, number> = {};
    messages.forEach(m => {
      if (m.recipient === currentUser.username && !m.read) {
        counts[m.sender] = (counts[m.sender] || 0) + 1;
      }
    });
    return counts;
  }, [messages, currentUser.username]);

  useEffect(() => {
    if (selectedCitizen && activeTab === 'Community') {
      onReadMessages(selectedCitizen.username);
    }
  }, [selectedCitizen, messages.length, activeTab]);

  // Community send uses the onSendMessage prop

  const handleCommunitySend = () => {
    if (!input.trim() || !selectedCitizen) return;
    onSendMessage(selectedCitizen.username, input);
    setInput('');
  };

  // simplify agent labels for community-only mode

  const getAgentTitle = () => {
    return 'Citizens Community';
  };

  const getAgentShortName = () => {
    return selectedCitizen?.displayName || 'Citizen';
  };

  return (
    <div className="flex flex-col h-[85vh] gap-4">

      <div className={`flex-1 flex flex-col md:flex-row rounded-3xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-2xl overflow-hidden border-4 border-gray-100 dark:border-slate-700`}>
        
        {/* Community Sidebar */}
        {activeTab === 'Community' && (
          <div className={`w-full md:w-72 border-r ${isDarkMode ? 'border-slate-700' : 'border-gray-100'} flex flex-col ${selectedCitizen ? 'hidden md:flex' : 'flex'}`}>
             <div className="p-4 border-b border-gray-100 dark:border-slate-700">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   placeholder="Search Citizens..."
                   className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-bold outline-none border-2 focus:border-blue-500 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-200 text-slate-900'}`}
                 />
               </div>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
               {searchTerm.trim() ? (
                 <>
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-2 px-2 mt-2">Search Results</p>
                   {filteredCitizens.map(u => (
                     <button 
                       key={u.username}
                       onClick={() => { setSelectedCitizen(u); setSearchTerm(''); }}
                       className={`w-full p-3 rounded-xl flex items-center gap-3 transition-colors ${selectedCitizen?.username === u.username ? 'bg-blue-500 text-white' : 'hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                     >
                       <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-slate-600 flex items-center justify-center text-[10px] font-black shrink-0">
                         {u.profilePic ? <img src={u.profilePic} className="w-full h-full object-cover rounded-full" /> : u.displayName[0]}
                       </div>
                       <div className="text-left truncate">
                         <p className="font-black text-[11px] truncate">{u.displayName}</p>
                         <p className={`text-[9px] font-bold ${selectedCitizen?.username === u.username ? 'text-white/60' : 'opacity-40'} truncate`}>@{u.username}</p>
                       </div>
                     </button>
                   ))}
                   {filteredCitizens.length === 0 && <p className="text-[10px] italic opacity-40 px-2">No citizens found.</p>}
                 </>
               ) : (
                 <>
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-2 px-2 mt-2">Active Conversations</p>
                   {conversationUsers.map(u => (
                     <button 
                       key={u.username}
                       onClick={() => setSelectedCitizen(u)}
                       className={`w-full p-3 rounded-xl flex items-center gap-3 transition-colors relative ${selectedCitizen?.username === u.username ? 'bg-blue-500 text-white' : 'hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                     >
                       <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-slate-600 flex items-center justify-center text-xs font-black shrink-0">
                         {u.profilePic ? <img src={u.profilePic} className="w-full h-full object-cover rounded-full" /> : u.displayName[0]}
                       </div>
                       <div className="text-left flex-1 min-w-0">
                         <p className="font-black text-xs truncate">{u.displayName}</p>
                         <p className={`text-[10px] font-bold ${selectedCitizen?.username === u.username ? 'text-white/60' : 'opacity-40'} truncate italic`}>{u.title || 'Citizen'}</p>
                       </div>
                       {unreadPerUser[u.username] > 0 && selectedCitizen?.username !== u.username && (
                         <span className="w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-black border-2 border-white dark:border-slate-800">
                           {unreadPerUser[u.username]}
                         </span>
                       )}
                     </button>
                   ))}
                   {conversationUsers.length === 0 && <p className="text-[10px] italic opacity-40 px-2 py-8 text-center">Your inbox is empty. Search for a citizen to start chatting!</p>}
                 </>
               )}
             </div>
          </div>
        )}

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col min-h-0 ${activeTab === 'Community' && !selectedCitizen ? 'hidden md:flex' : 'flex'}`}>
          <div className={`p-4 border-b ${isDarkMode ? 'bg-slate-700/50 border-slate-700' : 'bg-gray-50 border-gray-100'} flex items-center justify-between gap-3`}>
            <div className="flex items-center gap-3">
              {activeTab === 'Community' && selectedCitizen && (
                <button onClick={() => setSelectedCitizen(null)} className="md:hidden mr-1">
                  <ArrowLeft size={20} />
                </button>
              )}
              <MessageSquare className="text-blue-500" />
              <h3 className={`font-black italic uppercase text-[11px] md:text-sm truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                { !selectedCitizen ? 'Select a citizen to chat' : `Chat: ${getAgentShortName()}` }
              </h3>
            </div>
            <div className="flex items-center gap-2">
               <ShieldCheck size={14} className="text-green-500" />
               <span className="text-[9px] font-black text-green-500 uppercase tracking-tighter hidden sm:block">Secure Tunnel</span>
            </div>
          </div>
 

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
            {!selectedCitizen ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-30">
                <Users size={64} className="mb-4" />
                <p className="text-lg font-black uppercase italic">Community Messenger</p>
                <p className="text-xs font-bold max-w-xs">Talk with other citizens of Mooderia in real-time. Use the search bar to find people by name.</p>
              </div>
            ) : (
              <>
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <p className="font-black uppercase italic">New Connection</p>
                    <p className="text-[10px] font-bold mt-1">Say hello to @{selectedCitizen.username}!</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === currentUser.username ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 md:p-4 rounded-2xl text-xs md:text-sm font-semibold shadow-sm ${msg.sender === currentUser.username ? 'bg-[#1368ce] text-white rounded-tr-none' : 'bg-gray-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-tl-none border-b-2 border-gray-200 dark:border-slate-600'}`}>
                        {msg.text}
                        <p className={`text-[8px] mt-1 text-right font-black opacity-40 uppercase`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>

          {selectedCitizen && (
            <div className={`p-4 border-t ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-100 bg-white'}`}>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommunitySend()}
                  placeholder="Type a message..."
                  className={`flex-1 p-3 md:p-4 rounded-xl border-2 outline-none focus:border-blue-500 font-bold text-sm md:text-base ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-50 border-gray-100 text-slate-900'}`}
                />
                <button 
                  onClick={handleCommunitySend}
                  className={`p-4 rounded-xl text-white transition-transform active:scale-95 shadow-lg bg-[#1368ce]`}>
                  <Send size={24} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CityHallSection;
