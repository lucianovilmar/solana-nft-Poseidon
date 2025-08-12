'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAppContext } from '../AppContext'; // Descomentar se o arquivo estiver em um diretório diferente
import { motion, AnimatePresence } from 'framer-motion';
import profile_image_padrao from '../assets/profile_image_padrao.svg'

export function ProfileModal() {
  const { userProfile, setUserProfile, setIsProfileModalOpen } = useAppContext();
  const [localName, setLocalName] = useState(userProfile.name);
  const [localImage, setLocalImage] = useState(userProfile.image);
  const [localWallets, setLocalWallets] = useState(userProfile.wallets);
  const [newWallet, setNewWallet] = useState('');

  const handleSave = () => {
    // Salva as alterações no estado global
    setUserProfile({
      name: localName,
      image: localImage,
      wallets: localWallets,
    });
    // Fecha o modal
    setIsProfileModalOpen(false);
  };

  const handleAddWallet = () => {
    if (newWallet.trim() !== '') {
      setLocalWallets([...localWallets, newWallet.trim()]);
      setNewWallet('');
    }
  };

  const handleRemoveWallet = (indexToRemove) => {
    setLocalWallets(localWallets.filter((_, index) => index !== indexToRemove));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalImage(reader.result);
      };
      reader.readAsDataURL(file);
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
          className="bg-gray-800 text-white p-8 rounded-3xl shadow-2xl max-w-2xl w-full mx-auto"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-teal-400">Editar Perfil</h2>
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          {/* Seção de Dados do Perfil */}
          <div className="space-y-6">
            {/* Campo para editar o nome */}
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
                <img src={localImage} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-gray-600" onError={(e) => e.target.src = 'https://placehold.co/100x100/1e88e5/ffffff?text=U'} />
                <label className="flex-1 p-3 bg-gray-700 rounded-xl border border-gray-600 focus-within:ring-2 focus-within:ring-cyan-500 cursor-pointer text-gray-400">
                  <input
                    type="file"
                    id="profile-image"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <span className="truncate block">
                    {localImage.startsWith('data:image') ? 'Imagem carregada' : 'Clique para selecionar um arquivo'}
                  </span>
                </label>
              </div>
            </div>




            {/* Seção para adicionar e remover carteiras */}
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
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newWallet}
                  onChange={(e) => setNewWallet(e.target.value)}
                  className="flex-1 p-3 bg-gray-700 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Adicionar novo endereço de carteira..."
                />
                <button
                  onClick={handleAddWallet}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>

          {/* Botão de Salvar */}
          <div className="mt-8 text-right">
            <button
              onClick={handleSave}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Salvar Alterações
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}