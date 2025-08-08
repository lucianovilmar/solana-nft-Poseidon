'use client';
import { useAppContext } from '../AppContext';
import backGround from '../assets/backGround_venda.svg'
import tempFigura from '../assets/exemplo.svg'

// Este componente é apenas um exemplo de como sua página LojaTemp pode ser.
// Ele foi corrigido para resolver problemas de sintaxe no JSX.
export default function LojaTemp() {
  const { viewPage, setViewPage, setNfts } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-teal-900 via-cyan-800 to-blue-900 py-16 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" 
          style={{
            backgroundImage: `url("${backGround.src}")`
          }}
        ></div>         
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Mercado de Poseidon</h1>
          <p className="text-xl text-gray-200 mb-8">Descubra artefatos divinos e tesouros das profundezas oceânicas</p>
          <div className="max-w-2xl mx-auto relative">
            {/* Corrigido o aninhamento do input e do ícone de busca */}
            <input placeholder="Buscar produtos..." className="w-full p-4 pl-12 pr-4 rounded-lg border border-gray-200 focus:border-purple-500 focus:outline-none text-gray-700" type="text" />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center">
              <i className="ri-search-line text-gray-400"></i>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          <div className="w-80 bg-white rounded-2xl shadow-lg p-6 h-fit">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Categorias</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-apps-line"></i>
                </div>
                <span className="font-medium">Todos os Produtos</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left text-gray-700 hover:bg-gray-100">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-sword-line"></i>
                </div>
                <span className="font-medium">Armas Divinas</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left text-gray-700 hover:bg-gray-100">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-shield-line"></i>
                </div>
                <span className="font-medium">Armaduras</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left text-gray-700 hover:bg-gray-100">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-gem-line"></i>
                </div>
                <span className="font-medium">Joias do Mar</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left text-gray-700 hover:bg-gray-100">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-flask-line"></i>
                </div>
                <span className="font-medium">Poções Místicas</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left text-gray-700 hover:bg-gray-100">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-treasure-map-line"></i>
                </div>
                <span className="font-medium">Relíquias</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left text-gray-700 hover:bg-gray-100">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-riding-line"></i>
                </div>
                <span className="font-medium">Montarias</span>
              </button>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h4>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Raridade</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" type="checkbox" />
                    <span className="text-sm text-gray-600">Mítico</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" type="checkbox" />
                    <span className="text-sm text-gray-600">Lendário</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" type="checkbox" />
                    <span className="text-sm text-gray-600">Épico</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" type="checkbox" />
                    <span className="text-sm text-gray-600">Raro</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" type="checkbox" />
                    <span className="text-sm text-gray-600">Comum</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Preço (ETH)</label>
                <div className="flex space-x-2">
                  {/* Corrigido o aninhamento dos inputs de preço */}
                  <input placeholder="Min" className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:border-teal-500 focus:outline-none" type="number" />
                  <input placeholder="Max" className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:border-teal-500 focus:outline-none" type="number" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Todos os Produtos</h2>
                <p className="text-gray-600 mt-1">8 produtos encontrados</p>
              </div>
              <select className="p-3 pr-8 bg-white border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none">
                <option value="relevancia">Relevância</option>
                <option value="preco_menor">Menor Preço</option>
                <option value="preco_maior">Maior Preço</option>
                <option value="raridade">Raridade</option>
                <option value="nome">Nome</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card de produto de exemplo - Tridente */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative">
                  {/* Corrigido o fechamento da tag <img> */}
                  <img alt="Tridente de Poseidon" 
                  className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-300" 
                  src={tempFigura.src} 
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold text-orange-600 bg-orange-100">Lendário</span>
                  </div>
                  <button className="absolute top-3 left-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-heart-line text-gray-600"></i>
                    </div>
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">Tridente de Poseidon</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-gray-800">15.8 ETH</div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-star-fill text-yellow-400"></i>
                      </div>
                      <span className="text-sm text-gray-600">4.6</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 whitespace-nowrap">Comprar Agora</button>
                    <button className="px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className="ri-shopping-cart-line"></i>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card de produto de exemplo - Armadura */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative">
                  {/* Corrigido o fechamento da tag <img> */}
                  <img alt="Armadura das Profundezas" 
                  className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-300" 
                  src={tempFigura.src}
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold text-blue-600 bg-blue-100">Épico</span>
                  </div>
                  <button className="absolute top-3 left-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-heart-line text-gray-600"></i>
                    </div>
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors">Armadura das Profundezas</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-gray-800">12.3 ETH</div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <i className="ri-star-fill text-yellow-400"></i>
                      </div>
                      <span className="text-sm text-gray-600">4.3</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 whitespace-nowrap">Comprar Agora</button>
                    <button className="px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className="ri-shopping-cart-line"></i>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-arrow-left-line text-gray-600"></i>
                  </div>
                </button>
                <button className="px-4 py-2 rounded-lg transition-colors whitespace-nowrap bg-teal-600 text-white">1</button>
                <button className="px-4 py-2 rounded-lg transition-colors whitespace-nowrap border border-gray-300 text-gray-700 hover:bg-gray-50">2</button>
                <button className="px-4 py-2 rounded-lg transition-colors whitespace-nowrap border border-gray-300 text-gray-700 hover:bg-gray-50">3</button>
                <button className="px-4 py-2 rounded-lg transition-colors whitespace-nowrap border border-gray-300 text-gray-700 hover:bg-gray-50">4</button>
                <button className="px-4 py-2 rounded-lg transition-colors whitespace-nowrap border border-gray-300 text-gray-700 hover:bg-gray-50">5</button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-arrow-right-line text-gray-600"></i>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
