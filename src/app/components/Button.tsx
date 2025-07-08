import React from 'react';
import { MoveRight } from 'lucide-react';

interface ArrowButtonProps {
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
   type?: 'button' | 'submit' | 'reset';
}

const ArrowButton: React.FC<ArrowButtonProps> = ({ text, onClick,  type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="self-stretch px-2.5 py-4 bg-rose-200 rounded-[10px] inline-flex justify-center items-center gap-2.5 cursor-pointer"
    >
      <span className="text-zinc-900 text-base font-extrabold font-['Minork_Sans_']">
        {text}
      </span>
      <span className="w-4 h-5 relative origin-top-left overflow-hidden flex items-center justify-center">
        <MoveRight
          className=" text-zinc-900"
        //   style={{ transform: 'rotate(0deg)' }}
        />
      </span>
    </button>
  );
};

export default ArrowButton;
