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
    stages: ['input', 'scope', 'entities', 'retrieval', 'generation', 'output'],
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
    entitiesResult: {
      resolved: true,
      unit: 'UPA Samambaia (Samambaia Sul)',
      region: 'Região de Saúde Sudoeste',
      specialties: ['Urgência e Emergência', 'Clínica Médica', 'Pediatria'],
      intent: 'Localização e Horário de Atendimento',
      entities: [
        { label: 'Equipamento SUS', value: 'Unidade de Pronto Atendimento (UPA)' },
        { label: 'Território DF', value: 'Samambaia Sul (QS 107)' },
        { label: 'Região de Saúde', value: 'Sudoeste (Samambaia / Taguatinga)' },
        { label: 'Regime de Plantão', value: 'Ininterrupto 24 Horas' }
      ]
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
    stages: ['input', 'scope', 'entities', 'retrieval', 'generation', 'output'],
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
    entitiesResult: {
      resolved: true,
      unit: 'UBS 2 Taguatinga',
      region: 'Região de Saúde Sudoeste',
      specialties: ['Atenção Primária', 'Escala Médica Nominal'],
      intent: 'Consulta de Plantão Específico em Tempo Real',
      entities: [
        { label: 'Equipamento SUS', value: 'Unidade Básica de Saúde (UBS 2)' },
        { label: 'Território DF', value: 'Taguatinga' },
        { label: 'Demanda Temporal', value: 'Amanhã às 14h' },
        { label: 'Tipo de Dado', value: 'Escala Médica Nominal (Volátil)' }
      ]
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
    entitiesResult: {
      resolved: false,
      interruptedAt: 'Triagem de Segurança (Guardrails Clínicos)',
      reason: 'Desvio preventivo: perguntas com risco clínico de prescrição não avançam para extração territorial.',
      entities: []
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
    name: '1. Entrada do Usuário & Sessão',
    shortName: 'Entrada & Sessão',
    subtitle: 'Recepção de Linguagem Natural & Sessão',
    description: 'Ponto inicial de recepção da pergunta do cidadão em linguagem natural e inicialização da sessão com telemetria.',
    details: 'Recebe o texto enviado pelo usuário ou aplicativo de chat, registra o identificador único de sessão, higieniza os dados de entrada e prepara o pacote para triagem.',
    tourNote: 'Aqui o cidadão envia a pergunta. A Susana recebe a mensagem em linguagem natural, inicializa a sessão e inicia o ciclo.',
    position: [-12.0, 0, 4.8],
    cameraTarget: [-12.0, 1.4, 4.8],
    color: '#0284c7', // Sky Blue
    icon: 'MessageSquare'
  },
  {
    id: 'scope',
    stepNumber: 2,
    name: '2. Triagem de Segurança',
    shortName: 'Triagem de Segurança',
    subtitle: 'Guardrails Clínicos & Escopo',
    description: 'Avalia conformidade ética com as diretrizes do SUS-DF, aplicando guardrails preventivos contra autodiagnóstico ou receitas.',
    details: 'Classifica a intenção da consulta contra a matriz ética do SUS-DF. Perguntas sobre localização e acesso avançam; solicitações de receita médica são interceptadas com acolhimento preventivo.',
    tourNote: 'Triagem de segurança: A Susana verifica se a dúvida é sobre acesso a serviços. Perguntas sobre diagnósticos ou remédios são barradas aqui por ética médica.',
    position: [-6.0, 0, 2.2],
    cameraTarget: [-6.0, 1.4, 2.2],
    color: '#0d9488', // Teal
    icon: 'ShieldCheck'
  },
  {
    id: 'entities',
    stepNumber: 3,
    name: '3. Resolução de Entidades',
    shortName: 'NLU & Território DF',
    subtitle: 'NLU & Território DF',
    description: 'Processamento de Linguagem Natural (NLU) para extração de entidades clínicas, equipamentos do SUS e mapeamento geográfico no DF.',
    details: 'Identifica unidades de saúde (UPAs, UBSs, Policlínicas, CAPS), regiões de saúde do DF, níveis de urgência e especialidades para formular filtros semânticos estruturados na busca.',
    tourNote: 'NLU e Território: O modelo identifica exatamente as unidades do SUS, bairros e regiões do DF citados na pergunta para focar a pesquisa.',
    position: [-2.5, 0, -5.5],
    cameraTarget: [-2.5, 1.6, -5.5],
    color: '#06b6d4', // Cyan
    icon: 'MapPin'
  },
  {
    id: 'retrieval',
    stepNumber: 4,
    name: '4. Recuperação de Evidências',
    shortName: 'RAG Híbrido',
    subtitle: 'RAG Híbrido & Fontes Oficiais',
    description: 'Busca híbrida combinando busca vetorial semântica (pgvector 768d nomic-embed) e busca lexical (BM25) em documentos oficiais da SES-DF e IgesDF.',
    details: 'Localiza trechos com alta similaridade semântica em portarias, normativas e cartas de serviços do SUS-DF indexados com embeddings vetoriais de 768 dimensões.',
    tourNote: 'RAG Híbrido: O sistema busca trechos oficiais em documentos da SES-DF. Se os documentos oficiais não contiverem a resposta, o sistema não alucina.',
    position: [3.2, 0, -0.5],
    cameraTarget: [3.2, 1.8, -0.5],
    color: '#6366f1', // Indigo
    icon: 'Database'
  },
  {
    id: 'generation',
    stepNumber: 5,
    name: '5. Geração Fundamentada',
    shortName: 'Geração LLM',
    subtitle: 'Núcleo de LLM com Prompt Restritivo',
    description: 'Síntese da resposta pelo modelo LLM (Llama 3.2 3B via Ollama) executada sob prompt restritivo com proibição de alucinação.',
    details: 'Recebe a pergunta original combinada com os trechos oficiais recuperados. O modelo opera com diretriz restritiva rígida, respondendo estritamente com base nos fatos oficiais verificados.',
    tourNote: 'Síntese fundamentada: O modelo Llama 3.2 formula a resposta restrito unicamente aos trechos recuperados na etapa anterior.',
    position: [8.0, 0, -4.8],
    cameraTarget: [8.0, 1.5, -4.8],
    color: '#8b5cf6', // Violet
    icon: 'Cpu'
  },
  {
    id: 'output',
    stepNumber: 6,
    name: '6. Entrega com Citações',
    shortName: 'Entrega & Citações',
    subtitle: 'Streaming, Referências & Interface',
    description: 'Apresentação da resposta ao usuário em streaming, com badges de status, links diretos para auditoria das fontes oficiais e síntese.',
    details: 'Disponibiliza a resposta final com auditoria transparente de fontes da SES-DF/IgesDF, permitindo conferência pelo cidadão e garantindo integridade.',
    tourNote: 'Entrega com Citações: A resposta é apresentada com transparência total de fontes, links oficiais e indicador de desfecho da consulta.',
    position: [12.5, 0, 3.4],
    cameraTarget: [12.5, 1.4, 3.4],
    color: '#10b981', // Emerald
    icon: 'Send'
  }
];
