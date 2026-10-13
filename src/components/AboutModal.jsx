import React from 'react';
import { X, CheckCircle2, ShieldAlert, BookOpen, Droplet } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sus-ink/30 backdrop-blur-md pointer-events-auto">
      <div className="glass-panel bg-white/95 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white p-6 space-y-4">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl btn-sus-primary flex items-center justify-center text-white shadow-liquid">
              <Droplet className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sus-ice text-sus-deep uppercase">
                  Identidade SUS Digital
                </span>
              </div>
              <h2 className="text-base font-bold text-sus-ink mt-0.5">
                O Projeto Susana e o Pensamento Crítico
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-xl text-sus-muted hover:text-sus-ink hover:bg-sus-bg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Questão Central */}
        <div className="p-3.5 rounded-2xl bg-sus-ice/60 border border-blue-200/80 text-sus-deep">
          <p className="text-xs font-semibold uppercase tracking-wider text-sus-deep mb-1">
            Questão Central da Pesquisa:
          </p>
          <p className="text-xs italic leading-relaxed text-sus-ink">
            "Como sistemas de inteligência artificial podem ajudar as pessoas a avaliar a confiabilidade de informações sem substituir seu pensamento crítico?"
          </p>
        </div>

        {/* Pilares Didáticos */}
        <div className="space-y-3 text-xs text-sus-ink leading-relaxed">
          <p>
            A <strong>Susana</strong> é uma assistente virtual voltada à localização, compreensão e consulta de informações sobre os serviços públicos de saúde do <strong>Distrito Federal</strong> (SES-DF).
          </p>

          <div className="space-y-2 pt-1">
            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white border border-sus-ice shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-sus-primary mt-0.5 shrink-0" />
              <div>
                <strong className="block text-sus-ink">RAG (Retrieval-Augmented Generation)</strong>
                A IA não responde por memorização cega. Ela recupera documentos e fontes oficiais antes de sintetizar o texto.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white border border-sus-ice shadow-sm">
              <BookOpen className="w-4 h-4 text-sus-deep mt-0.5 shrink-0" />
              <div>
                <strong className="block text-sus-ink">Rastreabilidade e Citação de Fontes</strong>
                Toda resposta apresenta as fontes extraídas para permitir a auditoria crítica pelo próprio cidadão.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white border border-sus-ice shadow-sm">
              <ShieldAlert className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <div>
                <strong className="block text-sus-ink">Limites Éticos e Segurança Clínica</strong>
                O sistema <em>nunca</em> diagnostica doenças, receita medicamentos ou substitui profissionais de saúde do SUS.
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Fechamento */}
        <div className="pt-2 flex justify-end border-t border-blue-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-2xl btn-sus-primary text-white text-xs font-semibold transition-colors shadow-sm"
          >
            Explorar visualizador 3D
          </button>
        </div>
      </div>
    </div>
  );
}
