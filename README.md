# SecureCheck — Frontend (Vite + React)

Aplicação frontend para verificação de vazamentos de e-mail (UI do projeto MVP). Interface simples que consulta a API pública (por padrão `https://api.xposedornot.com`) e persiste histórico em um backend local (porta 5000).

- Código de inicialização: [src/index.tsx](src/index.tsx)  
- Layout global: [src/global.css](src/global.css)

## Rodando localmente

Requisitos: Node 20+/npm

1. Instalar dependências:
```bash
npm install
```

2. Rodar em modo desenvolvimento:
```bash
npm run dev
```

3. Build de produção:
```bash
npm run build
npm run preview
```

Scripts definidos em: [package.json](package.json)

## Usando com Docker / Docker Compose

O repositório inclui suporte para desenvolvimento com Docker:

- Frontend: [Dockerfile](Dockerfile)  
- Orquestração (frontend + backend local esperado em ../backendMVP2): [docker-compose.yml](docker-compose.yml)

Obs.: o serviço backend é esperado na pasta ../backendMVP2 (veja `docker-compose.yml`).

## Variáveis de ambiente

- `VITE_EXPOSED_API` — sobrescreve o endpoint externo usado pelo hook. (Padrão em código: `https://api.xposedornot.com`) — ver: [`useBreachManager`](src/hooks/useBreachManager.ts) / [src/hooks/useBreachManager.ts](src/hooks/useBreachManager.ts)

O frontend também tenta falar com o backend local em `http://localhost:5000` para persistência (GET/POST/PATCH/DELETE em `/breaches`) — implementado em [`useBreachManager`](src/hooks/useBreachManager.ts).

## Arquitetura e componentes principais

- Hook de negócio / API: [`useBreachManager`](src/hooks/useBreachManager.ts) — lógica de consulta, persistência local, edição e remoção.
- Componentes React:
  - Cabeçalho: [`Header`](src/components/header/Header.tsx) — [src/components/header/Header.tsx](src/components/header/Header.tsx)
  - Área principal / formulário: [`MainAplication`](src/components/main/Main.tsx) — [src/components/main/Main.tsx](src/components/main/Main.tsx)
  - Cartão de resultado: [`BreachCard`](src/components/main/BreachCard.tsx) — [src/components/main/BreachCard.tsx](src/components/main/BreachCard.tsx)
  - Rodapé: [`Footer`](src/components/footer/Footer.tsx) — [src/components/footer/Footer.tsx](src/components/footer/Footer.tsx)

## Endpoints usados (frontend)

- Externa: `${VITE_EXPOSED_API || 'https://api.xposedornot.com'}/v1/check-email/:email` — definido em [`useBreachManager`](src/hooks/useBreachManager.ts).
- Backend local para histórico: `http://localhost:5000/breaches` — usado para GET/POST/PATCH/DELETE em [`useBreachManager`](src/hooks/useBreachManager.ts).

## Estrutura do projeto (resumo)
- public/  
- src/
  - assets/
  - components/
    - header/, main/, footer/
  - hooks/
    - [src/hooks/useBreachManager.ts](src/hooks/useBreachManager.ts)
  - [src/index.tsx](src/index.tsx)

