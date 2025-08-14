'use client';

export default function Doacao() {
    return (

        <section className="py-12 bg-gradient-to-r from-purple-50 to-cyan-50">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="ri-heart-fill text-white text-2xl"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Ajude a manter o site!</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">Se este conteúdo te ajudou, considere fazer uma doação em SOL para apoiar o projeto.</p>
                        </div>
                        <div className="flex flex-col lg:flex-row items-center gap-8">
                            <div className="flex-shrink-0">
                                <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-gray-100">
                                    <img alt="QR Code Solana Wallet" className="w-48 h-48" src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&amp;data=bZAucYLwqDCWpxEvpwdP7sX3z4EfLpbxyjNqtia9Z89" />
                                </div>
                                <p className="text-center text-sm text-gray-500 mt-2">Escaneie para doar</p>
                            </div>
                            <div className="flex-1">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                                            <div className="w-6 h-6 flex items-center justify-center mr-2">
                                                <i className="ri-wallet-3-line text-purple-600"></i>
                                            </div>Solana Wallet para doação
                                        </h4>
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <code className="text-sm font-mono text-gray-700 break-all">bZAucYLwqDCWpxEvpwdP7sX3z4EfLpbxyjNqtia9Z89</code>
                                                <button
                                                    className="ml-3 flex-shrink-0 p-2 text-gray-500 hover:text-purple-600 transition-colors cursor-pointer"
                                                    title="Copiar endereço"
                                                    onClick={() => navigator.clipboard.writeText('bZAucYLwqDCWpxEvpwdP7sX3z4EfLpbxyjNqtia9Z89')}
                                                >
                                                    <div className="w-5 h-5 flex items-center justify-center">
                                                        <i className="ri-file-copy-line"></i>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-200 whitespace-nowrap" >
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="w-5 h-5 flex items-center justify-center">
                                                    <i className="ri-external-link-line"></i>
                                                </div>
                                                <span>Abrir no Backpack</span>
                                            </div>
                                        </button>
                                        <button className="flex-1 py-3 px-6 border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all duration-200 whitespace-nowrap">
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="w-5 h-5 flex items-center justify-center">
                                                    <i className="ri-share-line">
                                                    </i>
                                                </div>
                                                <span>Compartilhar</span>
                                            </div>
                                        </button>
                                    </div>
                                    <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600 text-center">
                                            <span className="font-semibold"> Obrigado pelo apoio!</span>
                                            <br />Sua doação ajuda a manter esta plataforma funcionando e melhorando continuamente.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>


    )
}