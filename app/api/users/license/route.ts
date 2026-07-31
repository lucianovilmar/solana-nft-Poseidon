import { NextResponse } from 'next/server';
import { Connection } from '@solana/web3.js';
import { kvGet, kvSet } from '../../db';

const ADMIN_RECEIVER = 'bZAucYLwqDCWpxEvpwdP7sX3z4EfLpbxyjNqtia9Z89';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { walletAddress, signature, planType } = body;

        if (!walletAddress || !signature || !planType) {
            return NextResponse.json({ error: 'Parâmetros ausentes' }, { status: 400 });
        }

        if (planType !== 'daily' && planType !== 'monthly') {
            return NextResponse.json({ error: 'Tipo de plano inválido' }, { status: 400 });
        }

        // Chaves de API do Helius para conectar à Solana Mainnet
        const heliusKeys = [
            'ba5116a6-1395-4ecf-9081-ca08d8ddd92e',
            '4803b13b-13a1-4b1d-a845-d74d77c4368b',
            'b43e21d0-3dc1-4f47-92da-6557f7b215ed',
            'a3496de1-5fb1-42bc-9004-fe1fae336752',
            'f7dd9a38-451b-4fdf-82a8-f12fce11a103'
        ];
        const rpcUrl = `https://mainnet.helius-rpc.com/?api-key=${heliusKeys[0]}`;
        const connection = new Connection(rpcUrl, 'confirmed');

        // Busca os detalhes da transação na blockchain
        const tx = await connection.getParsedTransaction(signature, {
            maxSupportedTransactionVersion: 0
        });

        if (!tx) {
            return NextResponse.json({ error: 'Transação não encontrada na rede. Aguarde alguns segundos e tente novamente.' }, { status: 404 });
        }

        // Verifica se a transação falhou
        if (tx.meta?.err) {
            return NextResponse.json({ error: 'A transação falhou na blockchain' }, { status: 400 });
        }

        // Mapeia as contas envolvidas e verifica saldos
        const accountKeys = tx.transaction.message.accountKeys.map(k => k.pubkey.toBase58());
        const receiverIndex = accountKeys.indexOf(ADMIN_RECEIVER);
        const senderIndex = accountKeys.indexOf(walletAddress);

        if (receiverIndex === -1) {
            return NextResponse.json({ error: 'A transação não enviou fundos para a carteira de recebimento do site' }, { status: 400 });
        }

        if (senderIndex === -1) {
            return NextResponse.json({ error: 'A transação não envolve sua carteira conectada' }, { status: 400 });
        }

        // Calcula a variação de saldo da carteira administradora (Lamports)
        const preBalanceReceiver = tx.meta?.preBalances[receiverIndex] || 0;
        const postBalanceReceiver = tx.meta?.postBalances[receiverIndex] || 0;
        const amountTransferredLamports = postBalanceReceiver - preBalanceReceiver;

        // Planos em lamports (1 SOL = 1.000.000.000 lamports)
        // Diário: 0.01 SOL = 10.000.000 lamports
        // Mensal: 0.05 SOL = 50.000.000 lamports
        const expectedLamports = planType === 'daily' ? 10_000_000 : 50_000_000;

        if (amountTransferredLamports < expectedLamports) {
            return NextResponse.json({ 
                error: `Pagamento insuficiente. Esperado pelo menos ${expectedLamports / 1e9} SOL, recebido ${amountTransferredLamports / 1e9} SOL` 
            }, { status: 400 });
        }

        // Calcula a expiração com base no relógio do Servidor
        let paidUntil = 0;
        if (planType === 'daily') {
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            paidUntil = endOfDay.getTime();
        } else {
            paidUntil = Date.now() + 30 * 24 * 60 * 60 * 1000;
        }

        // Recupera o perfil existente ou inicializa um novo
        let userProfile: any = await kvGet(`user:${walletAddress}`);
        if (!userProfile) {
            userProfile = {
                id: Date.now(),
                name: 'Unnamed User',
                avatar: '',
                image: '',
                wallets: [walletAddress],
                isHolder: true
            };
        }

        // Grava o vencimento
        userProfile.paidUntil = paidUntil;

        // Persiste as alterações para todas as carteiras vinculadas a este perfil
        for (const w of userProfile.wallets) {
            await kvSet(`user:${w}`, userProfile);
        }

        return NextResponse.json({
            success: true,
            message: `Licença ativada com sucesso! Válida até ${new Date(paidUntil).toLocaleString('pt-BR')}`,
            userProfile
        }, { status: 200 });

    } catch (error: any) {
        console.error("POST license error:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
