import { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = ({ label, id, className = '', ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[13px] font-bold text-slate-600">
          {label}
        </label>
      )}
      <input
        id={id}
        className={[
          'bg-white border border-slate-200 rounded-xl px-4 py-[14px]',
          'text-slate-800 text-[15px] outline-none font-sans shadow-sm',
          'placeholder:text-slate-400',
          'transition-all duration-200',
          'focus:border-brand-orange/60 focus:ring-2 focus:ring-brand-orange/20',
          className,
        ].join(' ')}
        {...props}
      />
    </div>
  );
};

export default Input;
