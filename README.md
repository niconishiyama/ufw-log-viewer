# UFW Log Viewer - Visualizador de Logs do Firewall

## Descrição

O UFW Log Viewer é uma ferramenta web moderna e intuitiva para organizar e visualizar logs do firewall UFW (Uncomplicated Firewall) de forma clara e eficiente. A ferramenta transforma logs brutos e desorganizados em uma interface visual amigável com filtros, estatísticas e tabelas organizadas.

## Características Principais

### 🔍 **Parsing Inteligente de Logs**
- Análise automática de logs do UFW em formato bruto
- Suporte para IPv4 e IPv6
- Extração de todos os campos relevantes (timestamp, IPs, portas, protocolos, ações, etc.)
- Tratamento robusto de diferentes formatos de log

### 📊 **Estatísticas em Tempo Real**
- Total de eventos processados
- Contagem de eventos bloqueados, permitidos e negados
- Número de IPs únicos identificados
- Distribuição por protocolos

### 🎯 **Filtros Avançados**
- **Busca por IP ou Hostname**: Filtragem rápida por endereços IP ou nomes de host
- **Filtro por Ação**: BLOCK, ALLOW, DENY
- **Filtro por Protocolo**: TCP, UDP, ICMP
- Filtros combinados para análises específicas

### 📋 **Visualização Organizada**
- Tabela responsiva com todos os dados organizados
- Timestamps formatados em português brasileiro
- Identificação visual de IPv4 vs IPv6
- Códigos de cores para diferentes ações e protocolos
- Interface limpa e profissional

### 💻 **Interface Moderna**
- Design responsivo para desktop e mobile
- Tema claro e escuro
- Componentes UI modernos com Tailwind CSS
- Experiência de usuário intuitiva

## Como Usar

### 1. **Carregamento de Logs**
Você pode carregar logs do UFW de duas formas:
- **Upload de Arquivo**: Clique em "Choose File" e selecione seu arquivo de log (.log ou .txt)
- **Cole Diretamente**: Cole o conteúdo do log na área de texto

### 2. **Processamento**
- Clique no botão "Processar Logs" para analisar os dados
- A ferramenta automaticamente extrairá e organizará todas as informações

### 3. **Visualização e Análise**
- Visualize as estatísticas gerais no painel superior
- Use os filtros para focar em eventos específicos
- Analise os dados na tabela detalhada

### 4. **Filtros Disponíveis**
- **Busca**: Digite qualquer IP ou hostname para filtrar
- **Ação**: Selecione BLOCK, ALLOW ou DENY
- **Protocolo**: Filtre por TCP, UDP ou ICMP

## Estrutura dos Dados Processados

A ferramenta extrai e organiza os seguintes campos dos logs do UFW:

| Campo | Descrição |
|-------|-----------|
| **Timestamp** | Data e hora do evento (formatado em PT-BR) |
| **Ação** | Ação tomada pelo firewall (BLOCK/ALLOW/DENY) |
| **IP Origem** | Endereço IP de origem (com identificação IPv4/IPv6) |
| **IP Destino** | Endereço IP de destino (com identificação IPv4/IPv6) |
| **Protocolo** | Protocolo usado (TCP/UDP/ICMP) |
| **Porta Origem** | Porta de origem da conexão |
| **Porta Destino** | Porta de destino da conexão |
| **Interface** | Interface de rede (eth0, wlan0, etc.) |
| **Hostname** | Nome do host que gerou o log |

## Exemplos de Logs Suportados

A ferramenta suporta logs do UFW em formato padrão:

```
2025-08-17T13:20:14.572094-03:00 ubuntu-nsh kernel: [UFW BLOCK] IN=enp0s3 OUT= MAC= SRC=fd17:625c:f037:0002:0a00:27ff:fef7:5d44 DST=ff02:0000:0000:0000:0000:0000:0000:000c LEN=655 TC=0 HOPLIMIT=1 FLOWLBL=996454 PROTO=UDP SPT=34174 DPT=3702 LEN=615

2025-08-17T10:15:30.123456-03:00 firewall-server kernel: [UFW ALLOW] IN=eth0 OUT= MAC=aa:bb:cc:dd:ee:ff SRC=192.168.1.50 DST=192.168.1.1 LEN=84 TC=0 HOPLIMIT=64 PROTO=TCP SPT=443 DPT=22
```

## Tecnologias Utilizadas

### Frontend
- **React 18** - Framework JavaScript moderno
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI modernos
- **Lucide Icons** - Ícones vetoriais
- **Vite** - Build tool rápido

### Backend/Parsing
- **JavaScript** - Lógica de parsing dos logs
- **Regex** - Extração de dados estruturados
- **Modular Design** - Arquitetura componentizada

## Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou pnpm

### Passos para Execução

1. **Clone ou baixe o projeto**
```bash
cd ufw-log-viewer
```

2. **Instale as dependências**
```bash
npm install
# ou
pnpm install
```

3. **Execute o servidor de desenvolvimento**
```bash
npm run dev
# ou
pnpm run dev
```

4. **Acesse a aplicação**
Abra seu navegador em `http://localhost:5173`

### Build para Produção

```bash
npm run build
# ou
pnpm run build
```

Os arquivos de produção estarão na pasta `dist/`.

## Estrutura do Projeto

```
ufw-log-viewer/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes UI (shadcn/ui)
│   │   └── LogParser.js     # Lógica de parsing dos logs
│   ├── assets/              # Arquivos estáticos
│   ├── App.jsx              # Componente principal
│   ├── App.css              # Estilos principais
│   └── main.jsx             # Ponto de entrada
├── public/                  # Arquivos públicos
├── package.json             # Dependências e scripts
└── README.md               # Esta documentação
```

## Casos de Uso

### 1. **Análise de Segurança**
- Identificar tentativas de acesso não autorizadas
- Monitorar padrões de tráfego suspeito
- Analisar origens de ataques

### 2. **Troubleshooting de Rede**
- Verificar regras de firewall em ação
- Identificar conexões bloqueadas incorretamente
- Analisar tráfego por protocolo e porta

### 3. **Auditoria e Compliance**
- Gerar relatórios de atividade do firewall
- Documentar eventos de segurança
- Análise histórica de logs

### 4. **Monitoramento Operacional**
- Acompanhar atividade em tempo real
- Identificar interfaces mais ativas
- Monitorar distribuição de protocolos

## Benefícios

✅ **Organização Clara**: Transforma logs confusos em dados estruturados  
✅ **Análise Rápida**: Filtros e busca permitem análise focada  
✅ **Interface Intuitiva**: Não requer conhecimento técnico avançado  
✅ **Suporte Completo**: IPv4, IPv6, todos os protocolos principais  
✅ **Responsivo**: Funciona em desktop, tablet e mobile  
✅ **Sem Instalação**: Roda direto no navegador  
✅ **Código Aberto**: Pode ser customizado conforme necessário  

## Suporte e Contribuições

Esta ferramenta foi desenvolvida para facilitar a análise de logs do UFW. Para sugestões, melhorias ou reportar problemas, entre em contato ou contribua com o projeto.

## Licença

Este projeto é de código aberto e pode ser usado, modificado e distribuído livremente.

---

**UFW Log Viewer** - Transformando logs complexos em insights claros! 🛡️📊

