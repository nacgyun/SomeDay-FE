import { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = ({ label, id, className = '', ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-white/70">
          {label}
        </label>
      )}
      <input
        id={id}
        className={[
          'bg-white/[0.07] border border-white/[0.12] rounded-xl px-4 py-[14px]',
          'text-white text-[15px] outline-none font-sans',
          'placeholder:text-white/30',
          'transition-all duration-200',
          'focus:border-brand-purple/60 focus:bg-white/10',
          className,
        ].join(' ')}
        {...props}
      />
    </div>
  );
};

export default Input;
