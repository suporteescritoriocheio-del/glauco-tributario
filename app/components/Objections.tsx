'use client'

export default function Objections() {
  const whatsappUrl = "https://api.whatsapp.com/send?phone=554391244440";
  
  return (
    <section className="section-gold" id="objeções">
      <div className="container">
        <h2>Superando as principais preocupações dos nossos clientes</h2>
        <p className="lead">Entendemos que o direito tributário no Brasil é complexo e gera desconfiança. Por isso, oferecemos uma metodologia baseada em <span className="highlight">segurança máxima e transparência</span>.</p>
        
        <div className="objections-container">
          <div className="objection-item">
            <h3>Honorários de Êxito</h3>
            <p>Não cobramos altos valores iniciais. Nossos honorários são majoritariamente baseados no resultado efetivo que entregamos. Você só investe significativamente se o seu caixa for beneficiado.</p>
            <div className="objection-detail">
              <p><strong>Como funciona:</strong> Cobramos uma pequena taxa inicial para cobrir custos operacionais, e o restante somente quando você recebe o benefício financeiro.</p>
            </div>
          </div>
          
          <div className="objection-item">
            <h3>Legalidade Comprovada</h3>
            <p>Só atuamos com teses tributárias já pacificadas ou com alto potencial de êxito nos tribunais superiores (STF, STJ). Não colocamos sua empresa em risco com aventuras jurídicas.</p>
            <div className="objection-detail">
              <p><strong>Nossa garantia:</strong> Todas as estratégias são baseadas em jurisprudência consolidada e pareceres de especialistas, minimizando riscos ao máximo.</p>
            </div>
          </div>
          
          <div className="objection-item">
            <h3>Foco em Resultados</h3>
            <p>Nosso diagnóstico inicial é rápido e gratuito. Em poucos dias, você saberá exatamente o potencial de crédito que a sua empresa pode recuperar, sem compromisso ou custos.</p>
            <div className="objection-detail">
              <p><strong>Transparência total:</strong> Apresentamos estimativas realistas de prazos e valores antes de qualquer compromisso formal.</p>
            </div>
          </div>
          
          <div className="objection-item">
            <h3>Atendimento Personalizado</h3>
            <p>Atendemos empresas de todos os portes e regimes tributários. Entendemos que cada negócio tem necessidades específicas e merece atenção dedicada.</p>
            <div className="objection-detail">
              <p><strong>Nossa promessa:</strong> Você terá um especialista dedicado ao seu caso, não um atendimento genérico ou automatizado.</p>
            </div>
          </div>
        </div>
        
        <div style={{textAlign: 'center', marginTop: '50px'}}>
          <a href={whatsappUrl} className="btn btn-outline" target="_blank" rel="noopener noreferrer">
            CHEGA DE DÚVIDAS. QUERO UM DIAGNÓSTICO SEM CUSTO
          </a>
        </div>
      </div>
    </section>
  );
}