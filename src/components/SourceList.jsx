import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, FileText } from 'lucide-react';

export default function SourceList({ documents = [], emptyMessage = 'Nenhum documento recuperado.' }) {
  const [expandedId, setExpandedId] = useState(documents[0]?.id || null);

  if (!documents || documents.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-white/80 border border-sus-ice text-center">
        <FileText className="w-8 h-8 text-sus-muted mx-auto mb-2 opacity-50" />
        <p className="text-xs text-sus-ink font-medium">{emptyMessage}</p>
        <p className="text-[11px] text-sus-muted mt-1">
          Nenhuma evidência documental foi associada a este processamento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {documents.map((doc, idx) => {
        const isExpanded = expandedId === doc.id;
        const scorePercent = doc.score ? Math.round(doc.score * 100) : null;

        return (
          <div
            key={doc.id || idx}
            className="rounded-2xl border border-sus-ice/90 bg-white/90 shadow-sm overflow-hidden transition-all duration-200 hover:border-blue-300"
          >
            {/* Cabeçalho do card */}
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : doc.id)}
              className="w-full text-left p-3 flex items-start justify-between gap-3 bg-white/60 hover:bg-white transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sus-ice text-sus-deep">
                    Doc #{idx + 1}
                  </span>
                  {scorePercent && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-sus-muted" title="Similaridade semântica com o vetor da consulta">
                      Similaridade: {scorePercent}%
                    </span>
                  )}
                  {doc.updatedAt && (
                    <span className="text-[10px] text-sus-muted">
                      Atualizado em {doc.updatedAt}
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-semibold text-sus-ink leading-snug truncate">
                  {doc.title}
                </h4>
              </div>

              <div className="text-sus-muted hover:text-sus-ink mt-1">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {/* Conteúdo expandido com trecho */}
            {isExpanded && (
              <div className="p-3 pt-2 text-xs border-t border-blue-100/60 bg-white space-y-2">
                {doc.excerpt && (
                  <div>
                    <span className="text-[10px] font-semibold text-sus-muted uppercase tracking-wider block mb-1">
                      Trecho Recuperado (Chunk RAG):
                    </span>
                    <blockquote className="p-2.5 rounded-xl bg-sus-bg border-l-2 border-sus-primary text-sus-ink font-mono text-[11px] leading-relaxed">
                      "{doc.excerpt}"
                    </blockquote>
                  </div>
                )}

                {doc.tags && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {doc.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 text-[10px] rounded-md bg-blue-50 text-sus-deep"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {doc.url && (
                  <div className="pt-1.5 flex justify-end">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-sus-deep hover:text-sus-primary font-medium hover:underline"
                    >
                      <span>Acessar fonte oficial</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Nota educativa de pensamento crítico */}
      <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-sus-deep leading-relaxed">
        <strong>Transparência Técnica:</strong> As pontuações de similaridade indicam apenas proximidade semântica matemática no espaço vetorial de 768 dimensões; elas não representam probabilidade de verdade nem garantia absoluta de factualidade.
      </div>
    </div>
  );
}
