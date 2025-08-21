import React, { useState, useEffect, useRef, useMemo, FormEvent, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

//==============================================================================
// 1. TYPE DEFINITIONS
//==============================================================================

export interface Database {
  id: string;
  db_name: string;
  config: {
    host: string;
    user: string;
  };
}

export interface LlmResponseData {
  rows_returned: number;
  inferred_table: string;
  inferred_db_name: string;
  source: 'cache' | 'llm' | 'intent_detection' | 'semantic_cache' | 'llm_fallback';
  sql_query: string;
  data: Record<string, any>[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string | LlmResponseData;
}

export interface ChatMessageProps {
  message: ChatMessage;
}

export interface DbConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (config: DbConfigSubmit) => void;
}

export interface InteractiveTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Record<string, any>[];
}

export interface DbConfigSubmit {
  db_name: string;
  db_host: string;
  db_database: string;
  db_user: string;
  db_password: string;
  db_port: number;
}


//==============================================================================
// 2. API HELPER FUNCTIONS (MOCKED)
//==============================================================================

if (!localStorage.getItem('accessToken')) {
    localStorage.setItem('accessToken', 'mock-auth-token-for-development');
}

export const getUserDatabases = async (token: string): Promise<Database[]> => {
    console.log("Mocking getUserDatabases call...");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return [
        { id: '1', db_name: 'Production DB', config: { host: 'prod.db.server.com', user: 'admin' } },
        { id: '2', db_name: 'Staging Environment', config: { host: 'staging.db.server.com', user: 'dev' } },
        { id: '3', db_name: 'Analytics Warehouse', config: { host: 'analytics.db.server.com', user: 'analyst' } },
    ];
};

export const saveDbConfig = async (token: string, config: DbConfigSubmit): Promise<boolean> => {
    console.log("Mocking saveDbConfig call with:", config);
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
};

export const askLlm = async (token: string, prompt: string, history: ChatMessage[]): Promise<LlmResponseData> => {
    console.log("Mocking askLlm call with prompt:", prompt);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const sampleData = [
        { id: 101, name: 'Alice Johnson', email: 'alice.j@example.com', created_at: '2023-10-26', status: 'active' },
        { id: 102, name: 'Bob Williams', email: 'bob.w@example.com', created_at: '2023-10-25', status: 'inactive' },
        { id: 103, name: 'Charlie Brown', email: 'charlie.b@example.com', created_at: '2023-10-24', status: 'active' },
        { id: 104, name: 'Diana Prince', email: 'diana.p@example.com', created_at: '2023-11-01', status: 'active' },
        { id: 105, name: 'Ethan Hunt', email: 'ethan.h@example.com', created_at: '2023-09-15', status: 'pending' },
        { id: 106, name: 'Fiona Glenanne', email: 'fiona.g@example.com', created_at: '2023-11-05', status: 'active' },
    ];
    return {
        rows_returned: sampleData.length,
        inferred_table: 'users',
        inferred_db_name: 'Production DB',
        source: 'llm',
        sql_query: `SELECT id, name, email, created_at, status FROM users ORDER BY created_at DESC;`,
        data: sampleData,
    };
};


//==============================================================================
// 3. SVG ICONS & STATIC COMPONENTS
//==============================================================================

const ApiLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 text-white"><path d="M4 7V17M12 7V17M8 4L8 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 12L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const LogoutIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const CodeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const DatabaseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0"><ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const AddIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const DownloadIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const SearchIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ExpandIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const SortIcon = ({ direction }: { direction: 'ascending' | 'descending' | 'none' }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block ml-1 opacity-50">
        <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={direction === 'ascending' ? 'opacity-100' : 'opacity-30'} />
        <path d="M17 10l-5-5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={direction === 'ascending' ? 'opacity-100' : 'opacity-30'} />
        <path d="M12 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={direction === 'descending' ? 'opacity-100' : 'opacity-30'} />
        <path d="M7 14l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={direction === 'descending' ? 'opacity-100' : 'opacity-30'} />
    </svg>
);


//==============================================================================
// 4. MAIN DASHBOARD COMPONENT
//==============================================================================
interface DashboardPageProps {
  onLogout: () => void;
}

const WelcomeMessage = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
        <motion.div 
            className="bg-white/10 p-4 rounded-full mb-4"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
        >
            <ApiLogo />
        </motion.div>
        <motion.h2 
            className="text-2xl font-semibold text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
        >
            How can I help you today?
        </motion.h2>
    </div>
);

const DashboardPage: FC<DashboardPageProps> = ({ onLogout }) => {
    const [databases, setDatabases] = useState<Database[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const [authToken] = useState(() => localStorage.getItem('accessToken'));

    useEffect(() => {
        const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!authToken) {
                console.error("No auth token found.");
                return;
            }
            const dbs = await getUserDatabases(authToken);
            setDatabases(dbs);
        };
        fetchData();
    }, [authToken]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleNewDbSubmit = async (config: DbConfigSubmit) => {
        if (!authToken) return;
        const success = await saveDbConfig(authToken, config);
        if (success) {
            const dbs = await getUserDatabases(authToken);
            setDatabases(dbs);
        }
    };

    const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading || !authToken) return;

        const newMessages: ChatMessage[] = [...messages, { role: 'user', content: prompt }];
        setMessages(newMessages);
        setPrompt('');
        setIsLoading(true);

        const history = newMessages.slice(-5);
        const response = await askLlm(authToken, prompt, history);
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        setIsLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        onLogout();
    };

    const sidebarVariants = {
        open: { width: '20rem' },
        closed: { width: '68px' }, 
    };
    
    const itemVariants = {
        open: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
        closed: { opacity: 0, x: -20, transition: { duration: 0.2 } },
    };

    const MotionButton = ({ children, onClick, className = '' }) => (
        <motion.button
            onClick={onClick}
            className={`w-full flex items-center justify-center text-sm font-semibold rounded-full px-4 py-3 transition-colors ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.button>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#050011] to-[#140034] font-sans text-gray-300 flex relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-50" style={{ backgroundImage: `radial-gradient(circle at 20% 30%, #ffffff11, transparent 1px), radial-gradient(circle at 80% 40%, #ffffff11, transparent 1px), radial-gradient(circle at 50% 70%, #ffffff08, transparent 1px), radial-gradient(circle at 90% 10%, #ffffff08, transparent 1px)`, backgroundSize: '2px 2px' }} />
            
            <div className="relative flex w-full h-screen">
                <motion.aside
                    variants={sidebarVariants}
                    initial={false}
                    animate={isSidebarOpen ? 'open' : 'closed'}
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }} 
                    className="bg-black/20 backdrop-blur-xl border-r border-white/5 flex-shrink-0 flex flex-col z-30 h-full"
                >
                    <div className={`p-4 flex items-center overflow-hidden h-16 ${isSidebarOpen ? 'space-x-4' : 'justify-center'}`}>
                        <ApiLogo />
                        <AnimatePresence>
                        {isSidebarOpen && <motion.span variants={itemVariants} className="font-semibold text-lg text-white whitespace-nowrap">ConnectDB</motion.span>}
                        </AnimatePresence>
                    </div>
                    <div className="p-4 flex-grow overflow-y-auto overflow-x-hidden">
                        <div className={`mb-4 flex items-center ${isSidebarOpen ? 'space-x-3' : 'justify-center'}`}>
                            <DatabaseIcon />
                            <AnimatePresence>
                                {isSidebarOpen && <motion.h2 variants={itemVariants} className="text-xl font-bold text-white whitespace-nowrap">Databases</motion.h2>}
                            </AnimatePresence>
                        </div>
                        <div className="space-y-2">
                            {databases.map((db, i) => (
                                <motion.div 
                                    key={db.id || db.db_name} 
                                    className={`bg-white/5 border border-transparent p-3 rounded-2xl flex items-center cursor-pointer ${isSidebarOpen ? 'space-x-3' : 'justify-center'}`}
                                    initial={{ opacity: 0, y: 20 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="flex-shrink-0 w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.5)]"></div>
                                    <AnimatePresence>
                                        {isSidebarOpen && (
                                            <motion.div variants={itemVariants} className="overflow-hidden">
                                                <h3 className="font-semibold text-white whitespace-nowrap">{db.db_name}</h3>
                                                <p className="text-xs text-gray-400 whitespace-nowrap">User: {db.config.user}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <div className="p-4 space-y-3">
                        <MotionButton onClick={() => setIsModalOpen(true)} className={`text-white bg-white/10 hover:bg-white/20 ${isSidebarOpen ? 'space-x-3' : ''}`}>
                            <AddIcon />
                            <AnimatePresence>
                                {isSidebarOpen && <motion.span variants={itemVariants} className="whitespace-nowrap">Connect Database</motion.span>}
                            </AnimatePresence>
                        </MotionButton>
                        <MotionButton onClick={handleLogout} className={`text-gray-400 bg-black/20 hover:bg-black/40 ${isSidebarOpen ? 'space-x-3' : ''}`}>
                            <LogoutIcon />
                            <AnimatePresence>
                                {isSidebarOpen && <motion.span variants={itemVariants} className="whitespace-nowrap">Logout</motion.span>}
                            </AnimatePresence>
                        </MotionButton>
                    </div>
                </motion.aside>

                <main className="flex-1 flex flex-col h-screen max-h-screen bg-black/10">
                    <header className="bg-black/20 backdrop-blur-lg p-4 flex items-center z-10 flex-shrink-0 h-16">
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10">
                            <MenuIcon />
                        </motion.button>
                        <h1 className="text-xl font-bold text-white">Chat with your Data</h1>
                    </header>
                    
                    <div className="flex-grow p-4 overflow-y-auto">
                        <div className="max-w-4xl mx-auto space-y-6 h-full">
                            <AnimatePresence>
                                {messages.length === 0 && !isLoading && (
                                    <motion.div
                                        key="welcome-message"
                                        className="h-full"
                                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    >
                                        <WelcomeMessage />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {messages.map((msg, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, type: 'spring' }}>
                                    <ChatMessage message={msg} />
                                </motion.div>
                            ))}
                            {isLoading && messages.length > 0 && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-900/50 rounded-lg p-3 max-w-2xl">
                                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                                            <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-pulse"></div>
                                            <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                            <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    </div>

                    <div className="p-4 bg-black/20 backdrop-blur-lg flex-shrink-0">
                        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center space-x-3">
                            <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask a question about your data..."
                                className="flex-grow bg-gray-900/50 border border-white/10 text-white text-sm rounded-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full p-3.5 px-6 placeholder-gray-500 transition"/>
                            <motion.button type="submit" disabled={isLoading} className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-purple-500/30" whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>
                                <SendIcon />
                            </motion.button>
                        </form>
                    </div>
                </main>
            </div>
            <DbConnectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleNewDbSubmit} />
        </div>
    );
};

//==============================================================================
// 5. SUB-COMPONENTS
//==============================================================================

const DbConnectionModal: FC<DbConnectionModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [config, setConfig] = useState<DbConfigSubmit>({
        db_name: '', db_host: 'localhost', db_database: '', db_user: '', db_password: '', db_port: 5432
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setConfig(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) : value }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(config);
        onClose();
        setConfig({ db_name: '', db_host: 'localhost', db_database: '', db_user: '', db_password: '', db_port: 5432 });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} transition={{type: 'spring', damping: 20, stiffness: 200}} onClick={(e) => e.stopPropagation()} className="bg-[#10012B] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl shadow-purple-500/20">
                        <div className="p-6 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">New Connection</h2>
                            <motion.button whileTap={{scale: 0.9}} onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"><CloseIcon /></motion.button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
                            <input name="db_name" type="text" placeholder="Connection Name" value={config.db_name} onChange={handleChange} required className="w-full bg-black/30 border-white/10 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                            <input name="db_host" type="text" placeholder="Host" value={config.db_host} onChange={handleChange} required className="w-full bg-black/30 border-white/10 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                            <input name="db_database" type="text" placeholder="Database Name" value={config.db_database} onChange={handleChange} required className="w-full bg-black/30 border-white/10 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                            <input name="db_user" type="text" placeholder="User" value={config.db_user} onChange={handleChange} required className="w-full bg-black/30 border-white/10 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                            <input name="db_password" type="password" placeholder="Password" value={config.db_password} onChange={handleChange} required className="w-full bg-black/30 border-white/10 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                            <input name="db_port" type="number" placeholder="Port" value={config.db_port} onChange={handleChange} required className="w-full bg-black/30 border-white/10 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                            <div className="flex justify-end space-x-3 pt-4">
                                <motion.button type="button" onClick={onClose} className="text-sm font-semibold text-gray-300 bg-white/10 hover:bg-white/20 rounded-full px-5 py-2.5 transition-colors" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>Cancel</motion.button>
                                <motion.button type="submit" className="text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-full px-5 py-2.5 transition-colors" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>Save Connection</motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === 'user';
    const isComplex = typeof message.content === 'object';
    const [isTableModalOpen, setIsTableModalOpen] = useState(false);

    if (isUser) {
        return (
            <div className="flex justify-end">
                <div className="bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white rounded-2xl rounded-br-lg p-3.5 max-w-2xl"><p>{message.content as string}</p></div>
            </div>
        );
    }

    const contentData = message.content as LlmResponseData;

    return (
        <>
            <div className="flex justify-start">
                <div className="bg-gray-900/50 border border-white/10 rounded-2xl rounded-bl-lg p-4 max-w-2xl w-full space-y-4">
                    {isComplex ? (
                        <>
                            <p>
                                I found <strong>{contentData.rows_returned}</strong> results from the 
                                <code className="bg-black/30 text-purple-300 px-1.5 py-1 rounded-md mx-1 font-mono text-xs"> {contentData.inferred_table} </code> table.
                                {contentData.source.includes('cache') && <span className="text-purple-400 text-xs ml-2 inline-flex items-center">⚡️ Cached</span>}
                            </p>
                            <motion.div>
                                <h4 className="text-sm font-semibold flex items-center space-x-2 mb-2 text-gray-400"><CodeIcon /><span>Generated SQL</span></h4>
                                <pre className="bg-black/50 p-3 rounded-lg text-xs text-gray-300 overflow-x-auto font-mono"><code>{contentData.sql_query}</code></pre>
                            </motion.div>
                            {contentData.data && contentData.data.length > 0 && (
                                <div className="w-full overflow-hidden border border-white/10 rounded-lg">
                                    <div className="overflow-x-auto max-h-60">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-white/5 sticky top-0 backdrop-blur-sm"><tr>{Object.keys(contentData.data[0]).map(key => <th key={key} className="p-3 font-semibold">{key}</th>)}</tr></thead>
                                            <tbody>
                                                {contentData.data.slice(0, 5).map((row, i) => (
                                                    <tr key={i} className="border-t border-white/10">{Object.values(row).map((val, j) => <td key={j} className="p-3 whitespace-nowrap">{String(val)}</td>)}</tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-end pt-2">
                                <motion.button onClick={() => setIsTableModalOpen(true)} className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center space-x-1" whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}><ExpandIcon /><span>View Full Table</span></motion.button>
                            </div>
                        </>
                    ) : ( <p>{message.content as string}</p> )}
                </div>
            </div>
            {isComplex && contentData.data && contentData.data.length > 0 && <InteractiveTableModal data={contentData.data} isOpen={isTableModalOpen} onClose={() => setIsTableModalOpen(false)} />}
        </>
    );
};

const InteractiveTableModal: FC<InteractiveTableModalProps> = ({ data, isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const sortedAndFilteredData = useMemo(() => {
        let sortedData = [...data];
        if (sortConfig !== null) {
            sortedData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortedData.filter(row => 
            Object.values(row).some(value => 
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [data, searchTerm, sortConfig]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return sortedAndFilteredData.slice(startIndex, startIndex + rowsPerPage);
    }, [sortedAndFilteredData, currentPage, rowsPerPage]);

    const totalPages = Math.ceil(sortedAndFilteredData.length / rowsPerPage);

    const requestSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const downloadCSV = () => {
        if (sortedAndFilteredData.length === 0) return;
        const headers = Object.keys(sortedAndFilteredData[0]);
        const csvRows = [headers.join(','), ...sortedAndFilteredData.map(row => headers.map(fieldName => JSON.stringify(row[fieldName])).join(','))];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'query_results.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} transition={{type: 'spring', damping: 20, stiffness: 200}} onClick={(e) => e.stopPropagation()} className="bg-[#10012B] border border-white/10 rounded-3xl w-full max-w-5xl h-[90%] shadow-2xl shadow-purple-500/20 flex flex-col">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <input type="text" placeholder="Search table..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-black/30 border-white/10 rounded-full p-2.5 pl-10 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                                    <div className="absolute left-3.5 top-3.5 text-gray-400"><SearchIcon /></div>
                                </div>
                                <motion.button onClick={downloadCSV} className="flex items-center space-x-2 text-sm bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-full transition-colors" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}><DownloadIcon /><span>Download CSV</span></motion.button>
                            </div>
                            <motion.button whileTap={{scale: 0.9}} onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"><CloseIcon /></motion.button>
                        </div>
                        <div className="flex-grow overflow-auto">
                            <table className="w-full text-left text-sm table-auto">
                                <thead className="bg-[#18033b] sticky top-0 backdrop-blur-sm">
                                    <tr>
                                        {Object.keys(data[0] || {}).map(key => (
                                            <th key={key} className="p-3 font-semibold whitespace-nowrap cursor-pointer" onClick={() => requestSort(key)}>
                                                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                <SortIcon direction={sortConfig?.key === key ? sortConfig.direction : 'none'} />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.map((row, i) => (
                                        <tr key={i} className="border-t border-white/10 hover:bg-white/5">
                                            {Object.values(row).map((val, j) => <td key={j} className="p-3 whitespace-nowrap">{String(val)}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-white/10 flex justify-between items-center flex-shrink-0">
                            <span className="text-xs text-gray-400">Showing {paginatedData.length} of {sortedAndFilteredData.length} results</span>
                            <div className="flex items-center space-x-2">
                                <motion.button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-white/10 rounded-md disabled:opacity-50" whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>Prev</motion.button>
                                <span className="text-xs text-gray-400">Page {currentPage} of {totalPages}</span>
                                <motion.button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-white/10 rounded-md disabled:opacity-50" whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}>Next</motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default DashboardPage;
