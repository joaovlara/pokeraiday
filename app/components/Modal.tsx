"use client";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal = ({ title, children, onClose }: ModalProps) => {
  return (
    <section className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="relative bg-neutral-800 p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>
        <div className="text-lg text-gray-200">{children}</div>
        <button
          className="btn-secondary mt-6 w-full cursor-pointer"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </section>
  );
};

export default Modal;
