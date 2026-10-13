# Susana AI Visualizer — Observatório 3D do Fluxo RAG

Dashboard 3D interativo para visualização espacial do fluxo de processamento de inteligência artificial da **Susana**, assistente virtual para localização e acesso aos serviços públicos de saúde do Distrito Federal (SES-DF).

---

## 1. Visão Geral e Propósito

O **Susana AI Visualizer** foi desenvolvido para feiras de ciências, apresentações acadêmicas e divulgação científica. Ele responde visualmente à questão central do projeto de pesquisa:

> *"Como sistemas de inteligência artificial podem ajudar as pessoas a avaliar a confiabilidade de informações sem substituir seu pensamento crítico?"*

Em vez de uma caixa-preta opaca ou de um chatbot convencional, o visitante observa um **campus 3D isométrico multi-nível** com 6 estações interligadas, acompanhando cada etapa do processamento com dados determinísticos e auditoria de fontes primárias.

---

## 2. Inovações Visuais da Fase 2 (Excelência Visual & Experiência Imersiva)

1. **Recomposição Espacial & Platô Multi-Nível**:
   - Plataforma arquitetônica com praças dedicadas para cada estação em alturas diferenciadas.
   - Vias de circulação pavimentadas e guias de pedra integrando visualmente todo o campus.
   - Fim da sensação de maquete isolada em superfície cinza vazia.
2. **Arquitetura 3D Reconhecível**:
   - **Estação 1 (Entrada)**: Portal de recepção em mármore técnico com colunas chanfradas, verga luminosa, console de atendimento e beacon rotativo.
   - **Estação 2 (Controle de Escopo)**: Base octogonal com colunas de escaneamento clínico, escudo ético de validação e arcos de segurança.
   - **Estação 3 (Base de Conhecimento RAG)**: Biblioteca modular com 3 monólitos de dados, slats horizontais de 768 dimensões e módulo de busca vetorial que se eleva dinamicamente.
   - **Estação 4 (Núcleo de Linguagem Llama 3.2)**: Rotunda central com trilho circular, 4 torres de resfriamento e núcleo dodecaédrico pulsante com gaiola icosaédrica e iluminação pontual.
   - **Estação 5 (Evidências & Referências)**: Deck de auditoria com monólitos de confronto documental, prisma de citação e canal de ligação holográfico.
   - **Estação 6 (Saída da Resposta)**: Terminal de recepção com antena de transmissão, display receptor de alta definição e halo de status.
3. **Etiquetas Contextuais Inteligentes**:
   - Eliminação da sobreposição visual no enquadramento.
   - Estações inativas mostram chips circulares compactos e discretos (`[1]`, `[2]`, etc.).
   - Estações sob hover exibem identificação limpa.
   - Estações selecionadas ou ativas expandem com título completo, subtítulo e indicador pulsante.
4. **Dutos de Dados Elevados de Alta Tecnologia**:
   - Dutos estruturais com núcleo óptico emissivo e suportes verticais de sustentação.
   - Diferenciação semântica: disponível (translúcido), ativo (pulso azul-esverdeado), concluído (esmeralda), desvio ético (âmbar dourado), recuperação insuficiente (âmbar) e erro técnico (rosa/vermelho).
5. **Partícula Balística com Easing Natural**:
   - Transição suave entre as estações utilizando interpolação cúbica com elevação em arco balístico e anel orbital giroscópico.
6. **Modo de Exploração Guiada ("Visita Guiada")**:
   - Experiência passo a passo automatizada de ~2-3 minutos ideal para feiras de ciências.
   - Câmera focaliza suavemente cada estação durante sua explicação.
   - Controles de reprodução: Pausar, Continuar, Próximo, Anterior e Sair para Modo Livre.

---

## 3. As 6 Estações no Mundo 3D

1. **1. Entrada da Pergunta (`input`)**: Portal de recepção que recebe a mensagem em linguagem natural do cidadão, gera o identificador de sessão e prepara o pacote de dados.
2. **2. Controle de Escopo (`scope`)**: Guarda ética que avalia se a dúvida diz respeito a serviços públicos de saúde do DF. Se o usuário solicitar diagnósticos clínicos ou prescrição de remédios, o fluxo é desviado imediatamente para acolhimento preventivo.
3. **3. Base de Conhecimento & RAG (`retrieval`)**: Módulo de biblioteca vetorial (PostgreSQL + pgvector com modelo `nomic-embed-text:latest` de 768 dimensões). Busca trechos oficiais com maior proximidade semântica.
4. **4. Núcleo de Linguagem (`generation`)**: Instância local do modelo `llama3.2:3b` (via Ollama) que recebe o prompt aumentado com os trechos oficiais recuperados para sintetizar uma resposta clara sem inventar dados.
5. **5. Evidências & Referências (`evidence`)**: Módulo de auditoria que vincula e cita as fontes oficiais (portais da SES-DF e IgesDF), reforçando que similaridade técnica não substitui a verificação crítica.
6. **6. Saída da Resposta (`output`)**: Terminal de entrega ao cidadão que exibe a resposta acompanhada do selo de fontes associadas e síntese da execução.

---

## 4. Cenários Demonstrativos Determinísticos

A aplicação possui 3 cenários pré-configurados:

- **Cenário A — Recuperação Bem-sucedida**: Pergunta sobre endereço e funcionamento da UPA de Samambaia. Percorre todas as estações e recupera 3 documentos oficiais com citações diretas.
- **Cenário B — Recuperação Insuficiente**: Pergunta sobre escala médica nominal em tempo real na UBS 2 de Taguatinga. Mostra a recusa ética da IA em inventar nomes ausentes na base documental estática.
- **Cenário C — Fora do Escopo Clínico**: Pergunta com relato de sintomas pedindo indicação de antibióticos. Interceptada no Controle de Escopo, orientando atendimento presencial no SUS sem diagnóstico automatizado.

---

## 5. Como Executar o Projeto

### Pré-requisitos
- Node.js >= 18 (testado e validado no Node v24)
- npm >= 9

### Instalação das dependências
```bash
npm install
```

### Executar em modo de desenvolvimento
```bash
npm run dev
```
O servidor Vite será iniciado em `http://127.0.0.1:5173`.

### Executar testes de integridade do fluxo
```bash
npm test
```

### Compilar para produção
```bash
npm run build
```
Os arquivos otimizados serão gerados no diretório `dist/`.

---

## 6. Navegação e Controles da Câmera 3D

- **Girar / Orbitar**: Botão esquerdo do mouse + arrastar.
- **Zoom**: Roda do mouse (scroll) ou pinça no trackpad.
- **Mover (Pan)**: Botão direito do mouse + arrastar (ou Shift + arrastar).
- **Inspecionar Estação**: Clique diretamente em qualquer estação ou em seu chip para abrir o Inspetor lateral com métricas e trechos detalhados.
- **Restaurar Câmera**: Botão de bússola na barra superior desliza suavemente até a perspectiva isométrica inicial.
- **Exploração Guiada**: Botão no topo ativa o tour; a câmera desliza até cada estação e para assim que o visitante arrasta, dá zoom ou move a visão.

---

## 7. Modelo de movimento e câmera

- A rota de cada execução é um único `CurvePath` ([trajectory.js](src/scene/trajectory.js)); a partícula lê `getPointAt(progresso)`.
- O progresso (0..1) só é escrito dentro do `useFrame` de [FlowParticle.jsx](src/scene/FlowParticle.jsx), com velocidade em unidades de mundo por segundo e `delta`. A estação ativa é **derivada** da posição; mudar seleção, inspetor ou etapa não reposiciona a partícula.
- Pausa congela o progresso; continuar retoma do mesmo ponto; nova execução (novo `id`) reinicia.
- A câmera tem um único escritor ([CameraRig.jsx](src/scene/CameraRig.jsx)): só desliza por pedido explícito (foco do tour ou restaurar visão) e cede ao usuário na primeira interação.

## 8. Modo demonstração e modo ao vivo

- **Demonstração**: cenários determinísticos, funciona sem backend. Perguntas livres escolhem entre os cenários já existentes; os dados exibidos são os do cenário, não uma resposta real.
- **Ao vivo**: `POST {VITE_SUSANA_API_URL}/api/v1/chat` (padrão `http://localhost:8000`, ver `.env.example`). Resposta e referências vêm da API; campos que ela não informa (modelo, tokens, confiança) aparecem como "Indisponível". A API não emite eventos intermediários, então o percurso é uma **representação didática**: a partícula aguarda na geração até a resposta chegar. O tempo exibido é o medido no navegador (inclui rede).
- "Resposta com Referências" significa apenas que a API associou fontes; não há verificação factual independente.

## 9. Limitações conhecidas

- A inspeção visual em navegador não pôde ser automatizada neste ambiente (driver do Playwright indisponível); fluidez e layout precisam de conferência manual.
- A recomposição arquitetônica das estações 3D não foi refeita nesta rodada.
- Referências técnicas e decisões: [docs/visual-references.md](docs/visual-references.md).
