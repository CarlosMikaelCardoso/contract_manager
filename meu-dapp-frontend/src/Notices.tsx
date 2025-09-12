// src/Notices.tsx
import { useState, useEffect } from 'react';
import { hexToString } from 'viem';

// Definindo a estrutura de um Notice com o payload decodificado opcional
interface Notice {
    id: string;
    payload: string;
    decodedPayload?: any;
}

// URL da API GraphQL do nó Cartesi rodando localmente
const GRAPHQL_URL = "http://localhost:8080/graphql";

export const Notices = () => {
    const [notices, setNotices] = useState<Notice[]>([]);

    useEffect(() => {
        const fetchNotices = async () => {
            const query = `{
                notices {
                    edges {
                        node {
                            id
                            payload
                        }
                    }
                }
            }`;

            try {
                const response = await fetch(GRAPHQL_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query }),
                });
                const result = await response.json();
                
                if (result.data && result.data.notices) {
                    const processedNotices: Notice[] = result.data.notices.edges.map((edge: any): Notice => {
                        const node = edge.node;
                        try {
                            const decodedPayload = hexToString(node.payload);
                            return { ...node, decodedPayload: JSON.parse(decodedPayload) };
                        } catch (e) {
                            return { ...node, decodedPayload: null }; // Retorna null se a decodificação falhar
                        }
                    });
                    setNotices(processedNotices);
                }
            } catch (error) {
                console.error("Erro ao buscar notices:", error);
            }
        };

        const interval = setInterval(fetchNotices, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h3>Respostas do DApp (Notices)</h3>
            <ul>
                {notices.map((notice) => (
                    <li key={notice.id}>
                       {notice.decodedPayload ? (
                           <pre>{JSON.stringify(notice.decodedPayload, null, 2)}</pre>
                       ) : (
                           `Payload: ${notice.payload} (Hex não decodificado)`
                       )}
                    </li>
                ))}
            </ul>
        </div>
    );
};