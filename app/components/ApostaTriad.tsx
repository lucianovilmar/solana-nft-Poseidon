'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../AppContext';
import api from '../services/api';
import logo_dark from '../assets/logo-dark.svg';
import QuadroAposta from './QuadroAposta';



export default function ApostaTriad() {
    const [valorPesq, setValorPesq] = useState('');
    const [valorMint, setValorMint] = useState('');
    const { nfts, setNfts, addNfts } = useAppContext();

    // ref para o container que será rolado
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const SCROLL_AMOUNT = 300; // ajustar conforme necessidade

    // atualiza visibilidade das setas
    const updateScrollButtons = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollWidth > el.clientWidth + el.scrollLeft + 1);
    };

    useEffect(() => {
        updateScrollButtons();
        const el = scrollRef.current;
        if (!el) return;
        const handleScroll = () => updateScrollButtons();
        el.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', updateScrollButtons);
        return () => {
            el.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', updateScrollButtons);
        };
    }, []);

    const handleScrollLeft = () => {
        scrollRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
    };

    const handleScrollRight = () => {
        scrollRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
    };

    return (
        <div className="relative mt-2 rounded-[20px] bg-black py-4 dark:bg-black/[2%]  mb-6">
            <div className="flex items-center gap-x-3 px-4">
                <img
                    src={logo_dark.src}
                    alt="Triad"
                    className="w-82 h-30 rounded-lg mr-1 object-cover cursor-pointer"
                    onClick={() => {
                        const win = window.open('https://www.triadmarkets.app/', '_blank');
                        if (win) win.opener = null;
                    }}
                />
            </div>
            <div className="relative mt-4">
                {/* wrapper relativo para posicionar as setas */}
                <div className="relative">
                    {/* seta esquerda */}
                    <button
                        onClick={handleScrollLeft}
                        aria-hidden={!canScrollLeft}
                        className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-opacity duration-150 ${!canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        title="Scroll left"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline-block">
                            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </button>

                    {/* container rolável */}
                    <div
                        ref={scrollRef}
                        className="relative z-0 flex w-full gap-3.5 px-4 overflow-x-auto scroll-smooth no-scrollbar"
                        // onScroll handled in effect via ref listener but keep here for safety
                        onScroll={() => updateScrollButtons()}
                    >
                      <QuadroAposta tipo={"single"} />
                      <QuadroAposta tipo={"segundo"} />
                      <QuadroAposta tipo={"multi"} />
                      <QuadroAposta tipo={"single"} />
                      <QuadroAposta tipo={"multi"} />
                      <QuadroAposta tipo={"multi"} />
                      <QuadroAposta tipo={"multi"} />
                    </div>

                    {/* seta direita */}
                    <button
                        onClick={handleScrollRight}
                        aria-hidden={!canScrollRight}
                        className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-opacity duration-150 ${!canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        title="Scroll right"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline-block">
                            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );

}