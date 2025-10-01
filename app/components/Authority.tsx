'use client'

export default function Authority() {
  return (
    <section className="section-dark" id="autoridade">
      <div className="container">
        <h2>Resultados que falam por si</h2>
        <p className="lead">Nossa trajetória é construída com cases de sucesso e números que comprovam nossa expertise.</p>
        
        <div className="authority-stats">
          <div className="stat">
            <span className="stat-number"25+</span>
            <span className="stat-text">Anos de atuação especializada em Direito Tributário</span>
          </div>
          <div className="stat">
            <span className="stat-number">R$ 87M+</span>
            <span className="stat-text">em créditos tributários recuperados nos últimos 3 anos</span>
          </div>
          <div className="stat">
            <span className="stat-number">+220</span>
            <span className="stat-text">empresas de diversos setores atendidas em todo o Brasil</span>
          </div>
          <div className="stat">
            <span className="stat-number">94%</span>
            <span className="stat-text">de sucesso em processos de recuperação de créditos</span>
          </div>
        </div>
        
        <div style={{textAlign: 'center', marginTop: '50px'}}>
          <p className="lead">Atuamos em diversos segmentos: Indústria, Comércio, Serviços, Tecnologia, Agronegócio e muito mais.</p>
        </div>
      </div>
    </section>
  );
}