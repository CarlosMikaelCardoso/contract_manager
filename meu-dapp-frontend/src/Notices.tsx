import { useState, useEffect, useRef } from 'react';
import { hexToString } from 'viem';

interface Notice {
    id: string;
    payload: string;
    decodedPayload?: any;
}

interface NoticesProps {
    onNewNotice: () => void;
}

const GRAPHQL_URL = "http://localhost:8080/graphql";

export const Notices = ({ onNewNotice }: NoticesProps) => {
    const [notices, setNotices] = useState<Notice[]>([]);
    // Usamos uma referência para "lembrar" a contagem de notices entre renderizações
    const lastNoticeCount = useRef(0);

    useEffect(() => {
        const fetchNotices = async () => {
            const query = `{ notices { edges { node { id, payload } } } }`;
            try {
                const response = await fetch(GRAPHQL_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query }),
                });
                const result = await response.json();
                
                if (result.data && result.data.notices) {
                    const processedNotices: Notice[] = result.data.notices.edges.map((edge: any) => {
                        try {
                            const decodedPayload = hexToString(edge.node.payload);
                            return { ...edge.node, decodedPayload: JSON.parse(decodedPayload) };
                        } catch (e) {
                            return { ...edge.node, decodedPayload: null };
                        }
                    });

                    // LÓGICA DE ATUALIZAÇÃO REATIVA
                    if (processedNotices.length > lastNoticeCount.current) {
                        const newNotice = processedNotices[processedNotices.length - 1];
                        const method = newNotice?.decodedPayload?.method;

                        if (method === 'create_rental_success' || method === 'aluguel_sucesso') {
                            console.log("Novo evento de escrita detectado, atualizando a lista de imóveis...");
                            onNewNotice();
                        }
                    }
                    
                    // Atualiza a referência com a nova contagem
                    lastNoticeCount.current = processedNotices.length;
                    setNotices(processedNotices);
                }
            } catch (error) {
                // Erros de busca são normais, então não exibimos no console
            }
        };

        const interval = setInterval(fetchNotices, 3000); // Aumenta o intervalo para 3s
        return () => clearInterval(interval);
    }, [onNewNotice]); 

    return (
        <div>
            <h3>Log de Eventos (Notices)</h3>
            <ul>
                {notices.slice().reverse().map((notice) => (
                    <li key={notice.id}>
                       {notice.decodedPayload ? (
                           <pre style={{backgroundColor: '#282c34', padding: '10px', borderRadius: '5px', whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>
                               {JSON.stringify(notice.decodedPayload, null, 2)}
                           </pre>
                       ) : (
                           `Payload: ${notice.payload} (Hex não decodificado)`
                       )}
                    </li>
                ))}
            </ul>
        </div>
    );
};
