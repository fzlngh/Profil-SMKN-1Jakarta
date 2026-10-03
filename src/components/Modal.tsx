"use client";

export function Modal({
  title,
  onClose,
  children,
  footer
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 bg-[#131926]/50 flex items-center justify-center z-[100] p-5"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-[10px] w-full max-w-[560px] max-h-[88vh] overflow-auto shadow-2xl">
        <div className="px-5 py-4 border-b border-paper-line flex items-center justify-between">
          <h3 className="text-[16px]">{title}</h3>
          <button onClick={onClose} className="text-[19px] leading-none text-muted hover:text-ink">
            &times;
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer && <div className="px-5 py-3.5 border-t border-paper-line flex justify-end gap-2.5">{footer}</div>}
      </div>
    </div>
  );
}
