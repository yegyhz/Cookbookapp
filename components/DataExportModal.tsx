import React, { useState } from 'react';
import { FileJson, X, Copy, Check, Database } from 'lucide-react';
import { Recipe } from '../types';

const DataExportModal: React.FC<{ isOpen: boolean; onClose: () => void; recipes: Recipe[] }> = ({ isOpen, onClose, recipes }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const dataStr = `export const INITIAL_RECIPES: Recipe[] = ${JSON.stringify(recipes, null, 2)};`;

    const handleCopy = () => {
        navigator.clipboard.writeText(dataStr);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full h-[80vh] flex flex-col transform transition-all animate-scale-in border border-stone-200">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-sky-100 p-3 rounded-full text-sky-600"><FileJson size={24} /></div>
                        <div>
                            <h3 className="font-serif text-2xl font-bold text-stone-900">Developer Data</h3>
                            <p className="text-xs text-stone-500 uppercase tracking-widest">Persist your changes</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full text-stone-500"><X size={24} /></button>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-amber-800">
                    <p className="font-bold mb-1 flex items-center gap-2"><Database size={14} /> How to save permanently:</p>
                    <p>Since this app uses local storage, changes are only saved on <strong>this device</strong>. To make your edits permanent for everyone on Vercel:</p>
                    <ol className="list-decimal list-inside mt-2 space-y-1 ml-2">
                        <li>Click <strong>Copy Code</strong> below.</li>
                        <li>Open your <code>data.ts</code> file in your code editor.</li>
                        <li>Replace the entire <code>INITIAL_RECIPES</code> constant with this code.</li>
                        <li>Commit and push to GitHub.</li>
                    </ol>
                </div>

                <div className="flex-1 bg-stone-900 rounded-xl p-4 overflow-hidden flex flex-col relative group">
                    <textarea
                        readOnly
                        className="w-full h-full bg-transparent text-stone-300 font-mono text-xs resize-none outline-none custom-scrollbar"
                        value={dataStr}
                    />
                    <button
                        onClick={handleCopy}
                        className="absolute top-4 right-4 bg-white/10 hover:bg-white text-white hover:text-stone-900 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border border-white/20"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataExportModal;
