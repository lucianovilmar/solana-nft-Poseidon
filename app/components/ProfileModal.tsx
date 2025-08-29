'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAppContext } from '../AppContext'; // Descomentar se o arquivo estiver em um diretório diferente
import { PublicKey } from '@solana/web3.js';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import profile_image_padrao from '../assets/profile_image_padrao.svg'

export function ProfileModal() {
  const { userProfile, setUserProfile, setIsProfileModalOpen } = useAppContext();
  const { publicKey } = useWallet();
  const [localName, setLocalName] = useState(userProfile.name);
  const [localImage, setLocalImage] = useState(userProfile.image);
  const [localWallets, setLocalWallets] = useState(userProfile.wallets);
  const [newWallet, setNewWallet] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Pega as carteiras pendentes do localStorage
    const pendingWalletsRaw = localStorage.getItem('pendingWallets');
    const pendingWallets = pendingWalletsRaw ? JSON.parse(pendingWalletsRaw) : [];

    // 2. Pega o endereço da carteira conectada
    const connectedWalletAddress = publicKey ? [publicKey.toBase58()] : [];

    // 3. Combina todas as novas carteiras (pendentes + conectada)
    const allNewWallets = [...pendingWallets, ...connectedWalletAddress];

    // 4. Se houver carteiras a adicionar, combina com a lista existente sem duplicatas
    if (allNewWallets.length > 0) {
      const combinedWallets = [...new Set([...localWallets, ...allNewWallets])];
      setLocalWallets(combinedWallets);
    }

    // 5. Limpa o localStorage para não adicionar novamente
    if (pendingWallets.length > 0) {
      localStorage.removeItem('pendingWallets');
    }
  }, []); // O array vazio [] garante que isso rode apenas uma vez, quando o modal é montado


  const handleSave = async () => {
    try {
      setError(null); // Limpa erros anteriores
      // 1. Monta o payload com o formato esperado pela API
      const userPayload = {
        name: localName,
        avatar: localImage, // Mapeando localImage para o campo 'avatar' da API
        wallets: localWallets,

      };

      // 2. Envia os dados para a API para criar/atualizar o usuário.
      // A rota '/users' é um exemplo, ajuste para o seu endpoint correto.
      await api.post('/users/', userPayload);

      // 3. Salva as alterações no estado global da aplicação (usando a chave 'image')
      setUserProfile({ name: localName, image: localImage, wallets: localWallets });

      // 4. Fecha o modal
      setIsProfileModalOpen(false);
    } catch (error) {
      console.error("Erro 500 - Falha no servidor ao salvar o perfil:", error);
      setError("Não foi possível salvar o perfil. Tente novamente mais tarde.");
      // Opcional: Adicionar um alerta ou notificação para o usuário sobre o erro.
    }
  };

  const handleAddWallet = () => {
    if (newWallet.trim() !== '') {
      setLocalWallets([...localWallets, newWallet.trim()]);
      setNewWallet('');
    }
  };

  const handleRemoveWallet = (indexToRemove: number) => {
    setLocalWallets(localWallets.filter((_, index) => index !== indexToRemove));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLocalImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
      <AnimatePresence>
        <motion.div
          className="bg-gray-800 text-white p-8 rounded-3xl shadow-2xl max-w-2xl w-full mx-auto flex flex-col max-h-[90vh]"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header do modal */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-teal-400">Editar Perfil</h2>
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          {/* Conteúdo com rolagem */}
          <div className="space-y-6 overflow-y-auto pr-2 flex-1">
            {/* Campo nome */}
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium text-gray-400 mb-2">Nome</label>
              <input
                type="text"
                id="profile-name"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Campo para adicionar imagem
            <div>
              <label htmlFor="profile-image" className="block text-sm font-medium text-gray-400 mb-2">URL da Imagem de Perfil</label>
              <div className="flex items-center space-x-4">
                <img src={localImage} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-gray-600" onError={(e) => e.target.src = 'https://placehold.co/100x100/1e88e5/ffffff?text=U'} />
                <input
                  type="text"
                  id="profile-image"
                  value={localImage}
                  onChange={(e) => setLocalImage(e.target.value)}
                  className="flex-1 p-3 bg-gray-700 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="https://exemplo.com/sua-imagem.png"
                />
              </div>
            </div>
 */}

            <div>
              <label htmlFor="profile-image" className="block text-sm font-medium text-gray-400 mb-2">Carregar Imagem de Perfil</label>
              <div className="flex items-center space-x-4">
                <img src={localImage || profile_image_padrao.src}
                  alt="Preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                  onError={(e) => (e.target as HTMLImageElement).src = profile_image_padrao.src}
                />
                <label className="flex-1 p-3 bg-gray-700 rounded-xl border border-gray-600 focus-within:ring-2 focus-within:ring-cyan-500 cursor-pointer text-gray-400">
                  <input
                    type="file"
                    id="profile-image"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <span className="truncate block">
                    {localImage && localImage.startsWith('data:image') ? 'Imagem carregada' : 'Clique para selecionar um arquivo'}
                  </span>
                </label>
              </div>
            </div>




            {/* Carteiras */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Carteiras Conectadas</label>
              <div className="space-y-3 mb-4">
                {localWallets.map((wallet, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-xl border border-gray-600">
                    <span className="text-sm font-mono text-gray-300 break-all">{wallet}</span>
                    <button
                      onClick={() => handleRemoveWallet(index)}
                      className="ml-4 text-red-400 hover:text-red-500 transition-colors"
                    >
                      <i className="ri-delete-bin-line"></i> Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Botões fixos */}
          <div className="mt-6 flex justify-end items-center space-x-4 pt-4 border-t border-gray-700">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-300"
            >
              Fechar
            </button>
            <button
              onClick={handleSave}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Salvar Alterações
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-4 text-right">{error}</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}