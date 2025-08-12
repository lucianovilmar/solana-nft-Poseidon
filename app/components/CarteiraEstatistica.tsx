
'use client';

import { useAppContext, Nft } from '../AppContext';
import backGround from '../assets/carteira_statistic.svg'


export default function CarteiraEstatistica() {
  const { viewPage, setViewPage, setNfts } = useAppContext();

  return (

    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-teal-900 via-cyan-800 to-blue-900 py-16">
        <div 
          className="abSOLute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url("${backGround.src}")`
          }}
        >
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Coleção de NFTs</h1>
          <p className="text-xl text-gray-200 mb-8">Gerencie e explore sua coleção de NFTs Poseidon</p>
        </div>
      </section>
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8 mb-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Estatísticas da Coleção</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                    <i className="ri-lightning-line text-white text-xl"></i>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-600">Mestre das Águas</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">72.900</h3>
                <p className="text-gray-600">Poder Total</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-coin-line text-white text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">178.9 SOL</h3>
                <p className="text-gray-600">Valor Total Investido</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-percent-line text-white text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">60.8%</h3>
                <p className="text-gray-600">Eficiência de Poder</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-trophy-line text-white text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">12</h3>
                <p className="text-gray-600">NFTs na Coleção</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Poder vs Coleção Total</h4>
                <div className="relative">
                  <div className="flex items-center justify-center h-32">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" stroke-width="3">
                        </path>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#gradient1)" stroke-width="3" stroke-dasharray="60.75000000000001, 100" stroke-linecap="round">
                        </path>
                        <defs>
                          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#8b5cf6"></stop>
                            <stop offset="100%" stop-color="#06b6d4"></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="abSOLute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-800">60.8%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">72.900 / 120.000 poder total</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Distribuição por Raridade</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-purple-100">
                      </div>
                      <span className="text-sm text-gray-700">Mítico</span>
                    </div>
                    <div className="flex items-center space-x-2"><div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-purple-100">
                      </div>
                    </div>
                      <span className="text-sm font-semibold text-gray-800 w-8">1</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-orange-100">
                      </div>
                      <span className="text-sm text-gray-700">Lendário</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-orange-100" >
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 w-8">2</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-100">
                      </div>
                      <span className="text-sm text-gray-700">Épico</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-blue-100" >
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 w-8">3</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-100">
                      </div>
                      <span className="text-sm text-gray-700">Raro</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-green-100" >
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 w-8">3</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-gray-100">
                      </div>
                      <span className="text-sm text-gray-700">Comum</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-gray-100" >
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 w-8">3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-96 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Top Power</h3>
              <span className="px-3 py-1 rounded-full text-sm font-semibold text-purple-600 bg-purple-100">Mítico</span>
            </div>
            <div className="relative mb-6">
              <img alt="Poseidon Emperor #001" className="w-full h-64 object-cover object-top rounded-xl" src="https://readdy.ai/api/search-image?query=Legendary%20Poseidon%20Emperor%20NFT%20artwork%2C%20divine%20sea%20god%20character%20with%20golden%20trident%20and%20crown%2C%20mythical%20underwater%20ruler%20with%20glowing%20blue%20aura%20and%20storm%20powers%2C%20premium%20digital%20collectible%20art%20with%20intricate%20details%20and%20celestial%20lighting%2C%20epic%20fantasy%20emperor%20design%2C%20clean%20dark%20ocean%20background&amp;width=400&amp;height=400&amp;seq=best-nft-emperor&amp;orientation=squarish" />
              <div className="abSOLute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">#001
              </div>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-lg font-bold text-gray-800">Poseidon Emperor #001</h4>
                <p className="text-gray-600">Poseidon Guardians</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500">Poder</span>
                  <div className="text-2xl font-bold text-purple-600">9.850
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">Valor</span>
                  <div className="text-xl font-bold text-gray-800">45.7 SOL
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h5 className="font-semibold text-gray-800">Atributos</h5>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">Força
                  </div>
                  <div className="text-sm text-gray-600">Divina
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-purple-600">0.1%
                  </div>
                  <div className="text-xs text-gray-500">raridade
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">Elemento
                  </div>
                  <div className="text-sm text-gray-600">Água Celestial
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-purple-600">0.3%
                  </div>
                  <div className="text-xs text-gray-500">raridade
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">Arma
                  </div>
                  <div className="text-sm text-gray-600">Tridente Supremo
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-purple-600">0.2%
                  </div>
                  <div className="text-xs text-gray-500">raridade
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">Armadura
                  </div>
                  <div className="text-sm text-gray-600">Escamas Douradas
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-purple-600">0.5%
                  </div>
                  <div className="text-xs text-gray-500">raridade
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">Aura
                  </div>
                  <div className="text-sm text-gray-600">Tempestade Eterna
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-purple-600">0.1%
                  </div>
                  <div className="text-xs text-gray-500">raridade
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">Rank
                  </div>
                  <div className="text-sm text-gray-600">Imperador
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-purple-600">0.05%
                  </div>
                  <div className="text-xs text-gray-500">raridade
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Coleção Completa</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors">
                  <i className="ri-wallet-3-line text-gray-600"></i>
                  <span>Carteiras (3)</span>
                  <i className="ri-arrow-down-s-line transition-transform "></i>
                </button>
              </div>
              <select className="p-3 pr-8 bg-gray-100 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none">
                <option value="poder">Maior Poder</option>
                <option value="raridade">Raridade</option>
                <option value="numero">Número</option>
                <option value="valor">Maior Valor</option>
                <option value="tempo">Tempo de Aquisição</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
              <div className="relative">
                <img alt="Poseidon Emperor #001" className="w-full h-40 object-cover object-top group-hover:scale-105 transition-transform duration-300" src="https://readdy.ai/api/search-image?query=Poseidon%20NFT%20collection%20character%20with%20ocean%20theme%2C%20mythical%20sea%20creature%20warrior%20with%20trident%20and%20armor%2C%20fantasy%20digital%20art%20with%20underwater%20background%2C%20premium%20collectible%20artwork%20with%20detailed%20design%20and%20magical%20aura%2C%20teal%20and%20blue%20color%20palette%2C%20high-quality%20NFT%20illustration&amp;width=400&amp;height=300&amp;seq=nft-1&amp;orientation=squarish" />
                <div className="abSOLute top-3 right-3">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold text-purple-600 bg-purple-100">Mítico</span>
                </div>
                <div className="abSOLute top-3 left-3 bg-white/90 rounded-full px-2 py-1">
                  <span className="text-xs font-bold text-gray-800">#001</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">Poseidon Emperor #001</h3>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs text-gray-500">Poder</span>
                    <div className="text-sm font-bold text-purple-600">9.850
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">Valor</span>
                    <div className="text-xs font-bold text-gray-800">45.7 SOL
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>Carteira Principal</span>
                  <span>14/01/2024</span>
                </div>
                <button className="w-full py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-sm font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 whitespace-nowrap">Ver Detalhes</button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
              <div className="relative">
                <img alt="Sea Guardian #128" className="w-full h-40 object-cover object-top group-hover:scale-105 transition-transform duration-300" src="https://readdy.ai/api/search-image?query=Poseidon%20NFT%20collection%20character%20with%20ocean%20theme%2C%20mythical%20sea%20creature%20warrior%20with%20trident%20and%20armor%2C%20fantasy%20digital%20art%20with%20underwater%20background%2C%20premium%20collectible%20artwork%20with%20detailed%20design%20and%20magical%20aura%2C%20teal%20and%20blue%20color%20palette%2C%20high-quality%20NFT%20illustration&amp;width=400&amp;height=300&amp;seq=nft-2&amp;orientation=squarish" />
                <div className="abSOLute top-3 right-3">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold text-orange-600 bg-orange-100">Lendário</span>
                </div>
                <div className="abSOLute top-3 left-3 bg-white/90 rounded-full px-2 py-1">
                  <span className="text-xs font-bold text-gray-800">#128</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">Sea Guardian #128</h3>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs text-gray-500">Poder</span>
                    <div className="text-sm font-bold text-purple-600">8.750
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">Valor</span>
                    <div className="text-xs font-bold text-gray-800">32.1 SOL
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>Carteira Principal</span>
                  <span>09/02/2024</span>
                </div>
                <button className="w-full py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-sm font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 whitespace-nowrap">Ver Detalhes</button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
              <div className="relative">
                <img alt="Ocean Warrior #256" className="w-full h-40 object-cover object-top group-hover:scale-105 transition-transform duration-300" src="https://readdy.ai/api/search-image?query=Poseidon%20NFT%20collection%20character%20with%20ocean%20theme%2C%20mythical%20sea%20creature%20warrior%20with%20trident%20and%20armor%2C%20fantasy%20digital%20art%20with%20underwater%20background%2C%20premium%20collectible%20artwork%20with%20detailed%20design%20and%20magical%20aura%2C%20teal%20and%20blue%20color%20palette%2C%20high-quality%20NFT%20illustration&amp;width=400&amp;height=300&amp;seq=nft-3&amp;orientation=squarish" />
                <div className="abSOLute top-3 right-3">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold text-orange-600 bg-orange-100">Lendário</span>
                </div>
                <div className="abSOLute top-3 left-3 bg-white/90 rounded-full px-2 py-1">
                  <span className="text-xs font-bold text-gray-800">#256</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">Ocean Warrior #256</h3>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs text-gray-500">Poder</span>
                    <div className="text-sm font-bold text-purple-600">7.890
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">Valor</span>
                    <div className="text-xs font-bold text-gray-800">28.4 SOL
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>Carteira Secundária</span>
                  <span>27/01/2024</span>
                </div>
                <button className="w-full py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-sm font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 whitespace-nowrap">Ver Detalhes</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}