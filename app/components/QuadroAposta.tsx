'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import api from '../services/api';
import logo_dark from '../assets/logo-dark.svg';


export default function QuadroAposta({ tipo }: { tipo: string }) {
    const [valorPesq, setValorPesq] = useState('');
    const [valorMint, setValorMint] = useState('');
    const { nfts, setNfts, addNfts } = useAppContext();

    if (tipo !== 'multi') {
        return (
            <div
                className="min-h-[198px] w-full max-w-[370px] cursor-pointer"
                role="link"
                tabIndex={0}
                onClick={() => {
                    const w = window.open(
                        'https://triadfi.co/market/2673?question=will-the-price-of-a-ore-exceed-1-000-by-the-end-of-november',
                        '_blank'
                    );
                    if (w) w.opener = null;
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        const w = window.open(
                            'https://triadfi.co/market/2673?question=will-the-price-of-a-ore-exceed-1-000-by-the-end-of-november',
                            '_blank'
                        );
                        if (w) w.opener = null;
                    }
                }}
            >
                <div className="flex hover:shadow-md min-w-[341px] transition-all duration-200 ease-in hover:shadow-none w-full flex-col justify-between rounded-2xl border border-black/10 border-transparent px-3 pt-3 text-start bg-gray-800 h-[198px] pb-0">

                    <div className="flex h-auto w-full flex-col gap-y-2.5 lg:gap-y-3">
                        <div className="flex gap-x-2.5 items-start">
                            <img
                                width={40}
                                height={40}
                                className="size-[40px] min-w-[40px] max-w-[40px] rounded-lg object-cover"
                                alt="Parma vs AC Milan – Rodada 11 do Campeonato Italiano"
                                src="https://triad-bucket.nyc3.digitaloceanspaces.com/triad/2673.png"
                            />
                            <span className="flex">
                                <span className="text-sm font-semibold text-white line-clamp-2">
                                    Will the price of a ORE exceed $1.000 by the end of November?
                                </span>
                            </span>
                            <div className="ml-auto flex items-center gap-x-2">
                                <button className="flex size-7 items-center justify-center rounded-lg transition-colors hover:bg-white/5 hover:[&amp;_svg]:fill-[#f2be47]">
                                    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">

                                    </svg>
                                </button>
                                <div className="tooltip h-full cursor-pointer flex justify-center w-fit relative max-sm:pointer-events-none">
                                    <div className="flex size-full">
                                        <div className="flex size-7 items-center justify-center rounded-lg bg-white/5">
                                            <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="tooltip-content flex items-center justify-center rounded-[4px] absolute z-[50] max-w-[260px] lg:max-w-[268px] min-w-[230px] lg:min-w-max py-[7px] px-[14px] text-white bg-white/5 backdrop-blur-xl transition-opacity bottom mt-2 opacity-0 pointer-events-none" >
                                        <span className="flex lg:max-w-[220px] text-start whitespace-pre-wrap text-xs font-normal tracking-normal __className_f367f3">
                                            <span>Nov 09, 20:59</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="w-full">
                        <div className="mt-3 flex w-full flex-col items-center justify-center">
                            <div className="flex size-full h-10 flex-col items-center gap-y-2">
                                <div className="flex w-full items-center justify-between">
                                    <span className="font-semibold text-white">50%</span>
                                    <span className="text-xs font-medium text-gray-400">Chance</span>
                                    <span className="font-semibold text-white">50%</span>
                                </div>
                                <div className="relative z-10 flex w-full gap-x-0.5 rounded">
                                    <div className="h-1 rounded-l bg-green-200" style={{ width: '50.0%' }}></div>
                                    <div className="h-1 rounded-r bg-red-300" style={{ width: '50.0%' }}></div>
                                </div>
                            </div>
                            <div className="mt-1.5 flex w-full items-center gap-2">
                                <button className="w-full flex text-sm font-semibold gap-1 items-center justify-center rounded-lg h-[42px] flex-1 transition-all duration-300 ease-in-out __className_8b3a0b bg-green-200/10 text-green-200 hover:bg-green-200 hover:text-white">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth={2}></circle>
                                        <path d="M13.8302 7.31818V17.5H11.6775V9.36151H11.6178L9.28613 10.8232V8.91406L11.8067 7.31818H13.8302Z" fill="currentColor">
                                        </path></svg>Yes - 1.11x</button>
                                <button className="w-full flex text-sm font-semibold gap-1 items-center justify-center rounded-lg h-[42px] flex-1 transition-all duration-300 ease-in-out __className_8b3a0b bg-red-200/10 text-red-200 hover:bg-red-200 hover:text-white">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth={2}></circle>
                                        <path d="M8.4161 17.5V15.9489L12.0404 12.593C12.3486 12.2947 12.6072 12.0263 12.816 11.7876C13.0281 11.549 13.1888 11.3153 13.2982 11.0866C13.4076 10.8546 13.4623 10.6044 13.4623 10.3359C13.4623 10.0376 13.3943 9.78078 13.2584 9.56534C13.1225 9.34659 12.9369 9.17921 12.7016 9.06321C12.4663 8.94389 12.1995 8.88423 11.9012 8.88423C11.5896 8.88423 11.3179 8.94721 11.0858 9.07315C10.8538 9.1991 10.6749 9.37973 10.5489 9.61506C10.423 9.85038 10.36 10.1304 10.36 10.4553H8.31667C8.31667 9.78906 8.46748 9.2107 8.76909 8.72017C9.0707 8.22964 9.49328 7.85014 10.0368 7.58168C10.5804 7.31321 11.2068 7.17898 11.9161 7.17898C12.6453 7.17898 13.28 7.30824 13.8202 7.56676C14.3638 7.82197 14.7864 8.17661 15.088 8.63068C15.3896 9.08475 15.5404 9.60511 15.5404 10.1918C15.5404 10.5762 15.4642 10.9557 15.3117 11.3303C15.1626 11.7048 14.8957 12.1207 14.5113 12.5781C14.1268 13.0322 13.5849 13.5774 12.8856 14.2138L11.3991 15.6705V15.7401H15.6746V17.5H8.4161Z" fill="currentColor"></path>
                                    </svg>No - 1.25x
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="relative bottom-1 flex w-full flex-row justify-between font-semibold ">
                        <p className="w-1/2 text-nowrap text-center text-sm text-white">$10
                            <span className="text-white">-&gt;</span>
                            <span className="text-[#00B471]">$11</span>
                        </p>
                        <p className="w-1/2 text-nowrap text-center text-sm text-white">$10
                            <span className="text-white">-&gt;</span>
                            <span className="text-[#00B471]">$12</span>
                        </p>
                    </div>

                </div>
            </div>


        );

    }

    return (
        <div className="min-h-[198px] w-full max-w-[370px]">
            <div className="flex hover:shadow-md cursor-pointer min-w-[341px] transition-all duration-200 ease-in hover:shadow-none w-full flex-col justify-between rounded-2xl border border-black/10 border-transparent px-3 pt-3 text-start bg-gray-800 h-[198px] pb-0">
                <div className="flex h-auto w-full flex-col gap-y-2.5 lg:gap-y-3">
                    <div className="flex gap-x-2.5 items-start">
                        <img
                            width={40}
                            height={40}
                            className="size-[40px] min-w-[40px] max-w-[40px] rounded-lg object-cover"
                            alt="Quantos tokens há dentro da caixa do stand principal da ETH Latam?"
                            src="https://triad-bucket.nyc3.digitaloceanspaces.com/triad/pool-58.png"
                        />
                        <span className="flex">
                            <span className="text-sm font-semibold text-white line-clamp-2">
                                Quantos tokens há dentro da caixa do stand principal da ETH Latam?
                            </span>
                        </span>

                        <div className="ml-auto flex items-center gap-x-2">
                            <button className="flex size-7 items-center justify-center rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5 hover:[&_svg]:fill-[#f2be47]">
                                <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="https://triadfi.co/"
                                        stroke="#fff"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>

                            {/* tooltip / info button */}
                            <div className="tooltip h-full cursor-pointer flex justify-center w-fit relative max-sm:pointer-events-none">
                                <div className="flex size-full">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5">
                                        <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="https://triadfi.co/"
                                                stroke="#fff"
                                                strokeWidth={1}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="https://triadfi.co/"
                                                stroke="#fff"
                                                strokeWidth={1}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <div className="tooltip-content flex items-center justify-center rounded-[4px] absolute z-[50] max-w-[260px] lg:max-w-[268px] min-w-[230px] py-[7px] px-[14px] text-white bg-white/5 backdrop-blur-xl transition-opacity bottom mt-2 opacity-0 pointer-events-none" style={{ border: '0.5px solid rgba(255, 255, 255, 0.07)' }}>
                                    <span className="flex lg:max-w-[220px] text-start whitespace-pre-wrap text-xs font-normal tracking-normal">
                                        <span>Nov 09, 18:00</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>




                    <div className="w-full">
                        <div className="max-h-[135px] overflow-y-auto">
                            {/* Example list entries */}
                            <div className="flex size-full flex-col items-center justify-center gap-y-1">
                                <div className="relative h-8 w-full cursor-pointer rounded-md transition-all duration-300 ease-in-out">
                                    <div className="relative z-10 flex size-full items-center justify-between">
                                        <div className="flex w-4/12 items-center gap-1.5 lg:w-[40%]">
                                            <div className="flex max-h-5 min-h-5 min-w-5 max-w-5 items-center justify-center overflow-hidden rounded-full">
                                                <img alt="153" className="size-full object-cover" width={25} height={25} src="https://triad-bucket.nyc3.digitaloceanspaces.com/triad/2669.png" />
                                            </div>
                                            <h3 className="truncate whitespace-nowrap text-[13px] font-medium text-white">153</h3>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="flex items-center gap-x-1.5">
                                                <button className="gap-x-2 flex items-center justify-center outline-none py-1 rounded-lg h-[30px] transition-all duration-300 px-1.5 ease-in-out w-full whitespace-nowrap max-w-[93px] font-semibold text-xs bg-green-500 text-white hover:bg-green-300/10 hover:text-green-300">
                                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="min-w-3.5">
                                                    </svg>
                                                    <span>Yes 1.56x</span>
                                                </button>
                                                <button className="gap-x-2 flex items-center justify-center outline-none py-1 rounded-lg h-[30px] transition-all duration-300 px-1.5 ease-in-out w-full whitespace-nowrap max-w-[93px] font-semibold text-xs bg-red-300 text-red-700 hover:bg-red-500 hover:text-white">
                                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    </svg>
                                                    <span>No 1.05x</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative z-10 flex size-full items-center justify-between">
                                    <div className="flex w-4/12 items-center gap-1.5 lg:w-[40%]">
                                        <div className="flex max-h-5 min-h-5 min-w-5 max-w-5 items-center justify-center overflow-hidden rounded-full">
                                            <img alt="153" className="size-full object-cover" width={25} height={25} src="https://triad-bucket.nyc3.digitaloceanspaces.com/triad/2669.png" />
                                        </div>
                                        <h3 className="truncate whitespace-nowrap text-[13px] font-medium text-white">153</h3>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex items-center gap-x-1.5">
                                            <button className="gap-x-2 flex items-center justify-center outline-none py-1 rounded-lg h-[30px] transition-all duration-300 px-1.5 ease-in-out w-full whitespace-nowrap max-w-[93px] font-semibold text-xs bg-green-500 text-white hover:bg-green-300/10 hover:text-green-300">
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="min-w-3.5">
                                                </svg>
                                                <span>Yes 1.56x</span>
                                            </button>
                                            <button className="gap-x-2 flex items-center justify-center outline-none py-1 rounded-lg h-[30px] transition-all duration-300 px-1.5 ease-in-out w-full whitespace-nowrap max-w-[93px] font-semibold text-xs bg-red-300 text-red-700 hover:bg-red-500 hover:text-white">
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                </svg>
                                                <span>No 1.05x</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10 flex size-full items-center justify-between">
                                    <div className="flex w-4/12 items-center gap-1.5 lg:w-[40%]">
                                        <div className="flex max-h-5 min-h-5 min-w-5 max-w-5 items-center justify-center overflow-hidden rounded-full">
                                            <img alt="153" className="size-full object-cover" width={25} height={25} src="https://triad-bucket.nyc3.digitaloceanspaces.com/triad/2669.png" />
                                        </div>
                                        <h3 className="truncate whitespace-nowrap text-[13px] font-medium text-white">153</h3>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex items-center gap-x-1.5">
                                            <button className="gap-x-2 flex items-center justify-center outline-none py-1 rounded-lg h-[30px] transition-all duration-300 px-1.5 ease-in-out w-full whitespace-nowrap max-w-[93px] font-semibold text-xs bg-green-500 text-white hover:bg-green-300/10 hover:text-green-300">
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="min-w-3.5">
                                                </svg>
                                                <span>Yes 1.56x</span>
                                            </button>
                                            <button className="gap-x-2 flex items-center justify-center outline-none py-1 rounded-lg h-[30px] transition-all duration-300 px-1.5 ease-in-out w-full whitespace-nowrap max-w-[93px] font-semibold text-xs bg-red-300 text-red-700 hover:bg-red-500 hover:text-white">
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                </svg>
                                                <span>No 1.05x</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10 flex size-full items-center justify-between">
                                    <div className="flex w-4/12 items-center gap-1.5 lg:w-[40%]">
                                        <div className="flex max-h-5 min-h-5 min-w-5 max-w-5 items-center justify-center overflow-hidden rounded-full">
                                            <img alt="153" className="size-full object-cover" width={25} height={25} src="https://triad-bucket.nyc3.digitaloceanspaces.com/triad/2669.png" />
                                        </div>
                                        <h3 className="truncate whitespace-nowrap text-[13px] font-medium text-white">153</h3>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex items-center gap-x-1.5">
                                            <button className="gap-x-2 flex items-center justify-center outline-none py-1 rounded-lg h-[30px] transition-all duration-300 px-1.5 ease-in-out w-full whitespace-nowrap max-w-[93px] font-semibold text-xs bg-green-500 text-white hover:bg-green-300/10 hover:text-green-300">
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="min-w-3.5">
                                                </svg>
                                                <span>Yes 1.56x</span>
                                            </button>
                                            <button className="gap-x-2 flex items-center justify-center outline-none py-1 rounded-lg h-[30px] transition-all duration-300 px-1.5 ease-in-out w-full whitespace-nowrap max-w-[93px] font-semibold text-xs bg-red-300 text-red-700 hover:bg-red-500 hover:text-white">
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                </svg>
                                                <span>No 1.05x</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}