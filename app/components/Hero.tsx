'use client'

export default function Hero() {
  const whatsappUrl = "https://web.whatsapp.com/send?phone=554391244440";
  
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-badge">Especialistas em Direito Tributário</div>
        <h1>Pare de Financiar o Governo. Recupere o Dinheiro que é <span className="highlight">Seu</span>.</h1>
        <p className="lead">A carga tributária brasileira está corroendo seu lucro? Nós transformamos impostos em vantagem competitiva e garantimos a <span className="highlight">blindagem fiscal</span> da sua empresa.</p>
        <p>Identificamos imediatamente o potencial de recuperação de créditos e implementamos estratégias legais para reduzir sua carga tributária.</p>
        <a href={whatsappUrl} className="btn btn-large" target="_blank" rel="noopener noreferrer">
          FALE COM UM ESPECIALISTA AGORA
        </a>
        <p style={{marginTop: '20px', fontSize: '0.9rem'}}>Diagnóstico Tributário Gratuito e Sem Compromisso</p>
      </div>
    </section>
  );
}