/**
 * Cenários demonstrativos determinísticos do Susana AI Visualizer
 * Cada cenário representa um fluxo de processamento de saúde pública do DF
 */

export const DEMO_SCENARIOS = [
  {
    id: 'scenario-a',
    title: 'Cenário A — Recuperação Bem-sucedida',
    tag: 'RAG Completo com Evidências',
    type: 'success',
    question: 'Onde fica a UPA de Samambaia e qual é o horário de atendimento?',
    expectedStatus: 'answered',
    description: 'Pergunta dentro do escopo com documentos oficiais encontrados na base vetorial. O modelo sintetiza a resposta sustentada por fontes verificadas.',
    stages: ['input', 'scope', 'retrieval', 'generation', 'evidence', 'output'],
    metrics: {
      docsRetrieved: 3,
      durationMs: 1420,
      embeddingModel: 'nomic-embed-text:latest (768d)',
      llmModel: 'llama3.2:3b',
      avgSimilarity: 0.892,
    },
    scopeResult: {
      allowed: true,
      category: 'Localização e Horários de Serviços SUS-DF',
      confidence: 0.98,
      notes: 'Solicitação legítima de endereço e funcionamento da rede de urgência pública do DF.'
    },
    retrievalResult: {
      status: 'found',
      count: 3,
      documents: [
        {
          id: 'doc-01',
          title: 'Unidade de Pronto Atendimento (UPA) - Samambaia',
          source: 'Secretaria de Saúde do DF (SES-DF)',
          url: 'https://www.saude.df.gov.br/upa-samambaia',
          updatedAt: '2025-08-14',
          score: 0.941,
          excerpt: 'A UPA Samambaia está localizada na QS 107, Conjunto 01, Área Especial 01, Samambaia Sul. Atendimento ininterrupto 24 horas por dia para urgências e emergências clínicas e pediátricas.',
          tags: ['UPA', 'Samambaia', '24 Horas', 'Endereço Oficial']
        },
        {
          id: 'doc-02',
          title: 'Guia da Rede de Urgência e Emergência do DF',
          source: 'Portal DF Saúde / IgesDF',
          url: 'https://igesdf.org.br/upas/',
          updatedAt: '2025-06-20',
          score: 0.884,
          excerpt: 'As Unidades de Pronto Atendimento funcionam em regime de plantão 24h, acolhendo pacientes pelo Protocolo de Manchester (classificação de risco).',
          tags: ['Classificação de Risco', 'Urgência', 'Acolhimento']
        },
        {
          id: 'doc-03',
          title: 'Linhas de Transporte Público - Acesso UPA Samambaia',
          source: 'Semob-DF / DF no Ponto',
          url: 'https://dfnoponto.semob.df.gov.br',
          updatedAt: '2025-05-10',
          score: 0.851,
          excerpt: 'Acesso facilitado pelas vias centrais de Samambaia Sul, próximo à 2ª Delegacia de Polícia e com paradas de ônibus nas linhas circulares 0.053 e 0.394.',
          tags: ['Acesso', 'Transporte', 'Referência']
        }
      ]
    },
    generationResult: {
      model: 'llama3.2:3b (Ollama local)',
      promptTokens: 412,
      outputTokens: 98,
      durationMs: 780,
      systemDirective: 'Responda estritamente com base nos trechos recuperados. Indique o endereço exato e ressalte o plantão 24h.'
    },
    evidenceResult: {
      verified: true,
      citedSourcesCount: 2,
      citations: ['Secretaria de Saúde do DF (SES-DF)', 'Portal DF Saúde / IgesDF'],
      disclaimer: 'As fontes listadas foram extraídas dos portais oficiais da SES-DF e IgesDF. A presença de referências documentais não substitui a confirmação pelo cidadão em situações atípicas.'
    },
    outputResult: {
      status: 'answered',
      statusBadge: 'Fontes Associadas',
      text: 'A Unidade de Pronto Atendimento (UPA) de Samambaia fica na QS 107, Conjunto 01, Área Especial 01, em Samambaia Sul (próximo à 2ª DP). O atendimento funciona 24 horas por dia, todos os dias, para casos de urgência e emergência adulta e pediátrica, com acolhimento por classificação de risco.',
      summary: 'Endereço e horário confirmados com 3 documentos oficiais recuperados.'
    }
  },

  {
    id: 'scenario-b',
    title: 'Cenário B — Recuperação Insuficiente',
    tag: 'Ausência de Evidências Oficiais',
    type: 'warning',
    question: 'Qual médico especialista estará no plantão da UBS 2 de Taguatinga amanhã às 14h?',
    expectedStatus: 'no_evidence',
    description: 'Pergunta válida sobre a rede, porém dados voláteis de escala médica nominal em tempo real não estão cadastrados na base estática. O sistema se recusa a inventar nomes.',
    stages: ['input', 'scope', 'retrieval', 'generation', 'output'],
    metrics: {
      docsRetrieved: 0,
      durationMs: 980,
      embeddingModel: 'nomic-embed-text:latest (768d)',
      llmModel: 'llama3.2:3b',
      avgSimilarity: 0.312,
    },
    scopeResult: {
      allowed: true,
      category: 'Consulta de Escala Nominal / Plantão Específico',
      confidence: 0.92,
      notes: 'Dentro do tema de saúde do DF, mas requer dados operacionais dinâmicos em tempo real.'
    },
    retrievalResult: {
      status: 'insufficient',
      count: 0,
      similarityThreshold: 0.70,
      maxFoundScore: 0.41,
      documents: [],
      reason: 'A base documental da Susana contém endereços, horários gerais de funcionamento e cartas de serviços. Escalas nominais de médicos variam diariamente e não possuem evidências atualizadas cadastradas no repositório.'
    },
    generationResult: {
      model: 'llama3.2:3b (Ollama local)',
      promptTokens: 210,
      outputTokens: 72,
      durationMs: 430,
      systemDirective: 'Evidências insuficientes detectadas. NÃO invente nomes de médicos ou horários de plantão. Recomende canais oficiais de confirmação.'
    },
    evidenceResult: {
      verified: false,
      citedSourcesCount: 0,
      citations: [],
      disclaimer: 'Sem documentos correspondentes com similaridade suficiente para assegurar factualidade.'
    },
    outputResult: {
      status: 'no_evidence',
      statusBadge: 'Evidências Insuficientes',
      text: 'Não foram encontradas informações oficiais verificadas sobre a escala nominal de médicos para a UBS 2 de Taguatinga na data solicitada. Como escalas de profissionais podem sofrer alterações diárias, a Susana não inventa dados operacionais. Por favor, confirme diretamente pelo telefone da gerência da UBS (61 3352-0000) ou pelo portal oficial da SES-DF antes de se deslocar.',
      summary: 'Abstenção responsável: O modelo não alucina escalas ou nomes ausentes na base.'
    }
  },

  {
    id: 'scenario-c',
    title: 'Cenário C — Fora do Escopo Clínico',
    tag: 'Filtro de Segurança & Ética Médica',
    type: 'alert',
    question: 'Estou com muita dor de cabeça e febre há 3 dias. Qual antibiótico ou remédio forte devo tomar?',
    expectedStatus: 'out_of_scope',
    description: 'Pergunta de autodiagnóstico ou prescrição medicamentosa. O controle de escopo intercepta a requisição para não substituir profissionais de saúde nem diagnosticar.',
    stages: ['input', 'scope', 'output'],
    metrics: {
      docsRetrieved: 0,
      durationMs: 410,
      embeddingModel: 'N/A (Desvio Imediato)',
      llmModel: 'llama3.2:3b (Guarda de Segurança)',
      avgSimilarity: 0.0,
    },
    scopeResult: {
      allowed: false,
      category: 'Solicitação de Prescrição / Diagnóstico Clínico',
      confidence: 0.99,
      notes: 'VIOLAÇÃO DE DIRETRIZ: Susana tem finalidade estrita de orientação de acesso a serviços públicos, não realizando diagnóstico, dosagem ou indicação terapêutica.'
    },
    retrievalResult: {
      status: 'skipped',
      count: 0,
      documents: [],
      reason: 'Etapa de recuperação documental ignorada porque a pergunta violou a política de segurança clínica na triagem de escopo.'
    },
    generationResult: {
      model: 'Modelo de Triagem Pré-definido',
      promptTokens: 110,
      outputTokens: 65,
      durationMs: 120,
      systemDirective: 'Recusa polida imediata + orientação para busca de atendimento profissional no SUS.'
    },
    evidenceResult: {
      verified: false,
      citedSourcesCount: 0,
      citations: [],
      disclaimer: 'O sistema Susana não emite prescrições médicas em nenhuma circunstância.'
    },
    outputResult: {
      status: 'out_of_scope',
      statusBadge: 'Fora do Escopo Clínico',
      text: 'A Susana é uma assistente para localização e compreensão dos serviços públicos de saúde do DF e não diagnostica doenças nem receita medicamentos. Como você está com dor de cabeça e febre persistentes por 3 dias, procure atendimento em uma Unidade Básica de Saúde (UBS) ou UPA mais próxima para avaliação presencial por um profissional habilitado.',
      summary: 'Proteção ética: interceptação no controle de escopo sem alucinação medicamentosa.'
    }
  }
];

export const STATIONS_METADATA = [
  {
    id: 'input',
    stepNumber: 1,
    name: '1. Entrada da Pergunta',
    shortName: 'Entrada',
    subtitle: 'Portal de Recepção & Ingestão',
    description: 'Ponto inicial por onde a pergunta do cidadão em linguagem natural entra no ecossistema da Susana.',
    details: 'Recebe o texto enviado pelo usuário ou aplicativo de chat, registra o identificador de sessão e prepara o pacote para validação de escopo e sanitização de dados.',
    tourNote: 'Aqui o cidadão envia a pergunta. A Susana recebe a mensagem em linguagem natural e inicia a sessão.',
    position: [-9.0, 0, 3.8],
    cameraTarget: [-9.0, 1.2, 3.8],
    color: '#0284c7', // Sky Blue
    icon: 'MessageSquare'
  },
  {
    id: 'scope',
    stepNumber: 2,
    name: '2. Controle de Escopo',
    shortName: 'Escopo',
    subtitle: 'Guarda Ética & Classificação de Intenção',
    description: 'Avalia se a consulta está dentro das diretrizes de saúde pública do DF e protege contra pedidos de diagnóstico ou prescrição.',
    details: 'Analisa intenção e segurança clínica. Se o usuário pedir diagnóstico médico ou remédios, o fluxo é desviado imediatamente para acolhimento preventivo sem invocar recuperação documental livre.',
    tourNote: 'Triagem de segurança: A Susana verifica se a dúvida é sobre acesso a serviços. Perguntas sobre diagnósticos ou remédios são barradas aqui por ética.',
    position: [-4.6, 0, 1.8],
    cameraTarget: [-4.6, 1.3, 1.8],
    color: '#0d9488', // Teal
    icon: 'ShieldCheck'
  },
  {
    id: 'retrieval',
    stepNumber: 3,
    name: '3. Base de Conhecimento & RAG',
    shortName: 'Base RAG',
    subtitle: 'Busca Vetorial & Biblioteca Oficial',
    description: 'Módulo central de recuperação de documentos oficiais da SES-DF e IgesDF indexados com embeddings vetoriais (dimensão 768).',
    details: 'Consulta o PostgreSQL + pgvector utilizando o modelo nomic-embed-text. Identifica trechos com maior proximidade semântica para embasar a resposta com evidências verificáveis.',
    tourNote: 'Busca semântica: O sistema localiza trechos em documentos oficiais da SES-DF. Se não houver evidências suficientes, a IA não inventará respostas.',
    position: [-2.0, 0, -4.2],
    cameraTarget: [-2.0, 1.5, -4.2],
    color: '#6366f1', // Indigo
    icon: 'Database'
  },
  {
    id: 'generation',
    stepNumber: 4,
    name: '4. Núcleo de Linguagem (LLM)',
    shortName: 'Núcleo LLM',
    subtitle: 'Processamento & Síntese Aumentada',
    description: 'Instância do modelo llama3.2:3b executada localmente via Ollama que sintetiza o texto a partir do contexto recuperado.',
    details: 'Recebe a pergunta original acrescida dos trechos de evidência recuperados (Prompt Aumentado). O modelo é instruído a não inventar dados e sintetizar a resposta com linguagem clara e acessível.',
    tourNote: 'Síntese aumentada: O modelo Llama 3.2 formula a resposta estritamente ancorado nos trechos recuperados na etapa anterior.',
    position: [2.4, 0, -0.4],
    cameraTarget: [2.4, 1.6, -0.4],
    color: '#8b5cf6', // Violet
    icon: 'Cpu'
  },
  {
    id: 'evidence',
    stepNumber: 5,
    name: '5. Evidências & Referências',
    shortName: 'Evidências',
    subtitle: 'Atribuição de Fontes & Citações',
    description: 'Etapa que associa as fontes oficiais recuperadas à resposta final para que o cidadão possa auditá-las criticamente.',
    details: 'Exibe URLs, títulos de documentos oficiais, órgãos emissores e trechos utilizados. Lembra o visitante de que ter referências não garante verdade absoluta e incentiva o pensamento crítico.',
    tourNote: 'Transparência de fontes: Os links e portais oficiais são vinculados para que o cidadão possa conferir e exercer seu pensamento crítico.',
    position: [6.0, 0, -3.6],
    cameraTarget: [6.0, 1.4, -3.6],
    color: '#10b981', // Emerald
    icon: 'BookOpenCheck'
  },
  {
    id: 'output',
    stepNumber: 6,
    name: '6. Saída da Resposta',
    shortName: 'Saída',
    subtitle: 'Terminal de Entrega ao Cidadão',
    description: 'Apresenta a resposta final ao usuário, categorizada claramente conforme o desfecho da execução.',
    details: 'Diferencia com precisão respostas fundamentadas, abstenções por falta de evidências oficiais, recusas éticas fora do escopo ou avisos de contingência.',
    tourNote: 'Entrega final: A resposta é apresentada com a indicação clara do seu desfecho (fontes associadas, evidências insuficientes ou fora de escopo).',
    position: [9.2, 0, 2.6],
    cameraTarget: [9.2, 1.3, 2.6],
    color: '#0f766e', // Deep Teal
    icon: 'Send'
  }
];
