// src/Notices.tsx
import { useState, useEffect } from 'react';

// Definindo a estrutura de um Notice
interface Notice {
    id: string;
    payload: string;
}

// URL da API GraphQL do nó Cartesi rodando localmente
const GRAPHQL_URL = "http://localhost:8080/graphql";

export const Notices = () => {
    const [notices, setNotices] = useState<Notice[]>([]);

    useEffect(() => {
        // Função para buscar os notices
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

            const response = await fetch(GRAPHQL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });
            const result = await response.json();
            setNotices(result.data.notices.edges.map((edge: any) => edge.node));
        };

        // Busca notices a cada 3 segundos
        const interval = setInterval(fetchNotices, 3000);
        return () => clearInterval(interval); // Limpa o intervalo ao sair
    }, []);

    return (
        <div>
            <h3>Respostas do DApp (Notices)</h3>
            <ul>
                {notices.map((notice) => (
                    <li key={notice.id}>
                       Payload: {notice.payload} (Hex)
                    </li>
                ))}
            </ul>
        </div>
    );
};