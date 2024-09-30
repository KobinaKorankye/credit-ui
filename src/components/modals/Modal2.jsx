import React from 'react';
import ReactDOM from 'react-dom';


export default function Modal2({ isOpen, children }) {
    if (!isOpen) return null;

    const modalRoot = typeof document !== 'undefined' ? document.getElementById('modal-root-2') : null;
    if (!modalRoot) return null;

    return ReactDOM.createPortal(
        <div>
            {children}
        </div>,
        modalRoot
    );
};
