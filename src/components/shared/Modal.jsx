import React from "react";
import { motion } from "framer-motion";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/50 p-4 sm:p-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full max-w-lg rounded-lg bg-[#FFFFFF] shadow-lg sm:max-w-xl"
      >
        <div className="flex items-center justify-between border-b border-b-yellow-500 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-[#212529] sm:text-xl">{title}</h2>
          <button
            className="text-2xl text-gray-500 transition-colors hover:text-gray-800"
            onClick={onClose}
            type="button"
          >
            &times;
          </button>
        </div>
        <div className="px-5 py-6 sm:px-6">{children}</div>
      </motion.div>
    </motion.div>
  );
};

export default Modal;
