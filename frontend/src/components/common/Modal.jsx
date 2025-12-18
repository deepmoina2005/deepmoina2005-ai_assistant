import { X } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal wrapper */}
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="relative w-full max-w-3xl bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-2xl rounded-2xl p-6 z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>

          {/* Modal header */}
          <div className="mb-6 pr-8">
            <h3 className="text-xl font-medium text-slate-900 tracking-tight">
              {title}
            </h3>
          </div>

          {/* Modal body */}
          <div className="max-h-[120vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
