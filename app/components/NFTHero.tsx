
'use client';
import { useAppContext } from '../AppContext';



export default function NFTHero() {
  const { viewPage, setViewPage, setNfts } = useAppContext();

  return (
    <div 
      className="relative h-96 bg-cover bg-center bg-gray-900"
      style={{
        backgroundImage: 'url(https://readdy.ai/api/search-image?query=majestic%20Poseidon%20god%20of%20the%20sea%20with%20golden%20trident%20rising%20from%20ocean%20waves%2C%20ancient%20Greek%20mythology%20digital%20art%2C%20underwater%20palace%20with%20coral%20reefs%20and%20sea%20creatures%2C%20royal%20blue%20and%20turquoise%20colors%20with%20golden%20accents%2C%20epic%20divine%20atmosphere%2C%20mystical%20underwater%20kingdom%20background%20perfect%20for%20text%20overlay&width=1400&height=400&seq=poseidon-hero-bg&orientation=landscape)'
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
        <div className="text-white max-w-2xl">
          <h1 className="text-5xl font-bold mb-6">
            Descubra o Poder das Profundezas
            <span className="text-purple-400 block">do seu Poseidons</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Explore, analise e invista em NFTs mais valiosos do mercado com nossa plataforma avançada de pesquisa
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => {setViewPage('carteira');setNfts([])}}
              className={` ${viewPage === 'carteira' ? 'bg-purple-600 hover:bg-purple-700' : 'border-2 border-white hover:bg-white hover:text-gray-900'} px-8 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer`}>
              Carteiras
            </button>
            <button 
              onClick={() => {setViewPage('mint');setNfts([])}}
              className={` ${viewPage === 'carteira' ? 'border-2 border-white hover:bg-white hover:text-gray-900' : 'bg-purple-600 hover:bg-purple-700'} px-8 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer`}>
              Nº raridade e Mint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
