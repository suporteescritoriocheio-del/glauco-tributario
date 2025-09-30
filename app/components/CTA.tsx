'use client'

export default function CTA() {
  const whatsappUrl = "https://web.whatsapp.com/send?phone=554391244440";
  
  return (
    <section className="section-light" id="cta-final">
      <div className="container">
        <h2>O tempo é dinheiro (e crédito)</h2>
        <p className="lead">Cada dia que passa é um dia a menos nos <span className="highlight">5 anos que você tem para recuperar impostos pagos a maior</span>. A lei fiscal muda constantemente e oportunidades podem se perder.</p>
        
        <p>Empresas que adiam a análise tributária perdem, em média, <strong>R$ 127.000 em créditos não recuperados</strong> ao longo de 5 anos. Não deixe seu dinheiro na mão do Fisco.</p>
        
        <div className="urgency-box">
          <h3>Oportunidade com prazo limitado</h3>
          <p>O direito de recuperar tributos pagos indevidamente prescreve em 5 anos. Quanto mais você espera, menos consegue recuperar. Além disso, mudanças legislativas podem fechar janelas de oportunidade a qualquer momento.</p>
        </div>
        
        <div style={{textAlign: 'center'}}>
          <a href={whatsappUrl} className="btn btn-large" target="_blank" rel="noopener noreferrer">
            QUERO FALAR AGORA COM UM ESPECIALISTA EM RECUPERAÇÃO TRIBUTÁRIA
          </a>
          <p style={{marginTop: '20px', fontSize: '0.9rem'}}>Diagnóstico completo sem custo e sem compromisso</p>
        </div>
      </div>
      
      <style jsx>{`
        .urgency-box {
          background-color: var(--gold-light);
          padding: 30px;
          border-radius: 10px;
          margin: 40px 0;
          border-left: 5px solid var(--gold);
        }
        
        .urgency-box h3 {
          color: var(--gold-darker);
        }
      `}</style>
    </section>
  );
}