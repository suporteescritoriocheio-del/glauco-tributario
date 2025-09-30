'use client'

export default function Process() {
  const whatsappUrl = "https://api.whatsapp.com/send?phone=554391244440";
  
  return (
    <section className="section-light">
      <div className="container">
        <h2>Como transformamos sua situação tributária em 4 passos</h2>
        <p className="lead">Um processo claro e transparente que garante resultados desde o primeiro contato.</p>
        
        <div className="process-steps">
          <div className="process-step">
            <h3>Diagnóstico Gratuito</h3>
            <p>Analisamos sua situação fiscal sem custo e identificamos oportunidades de economia e recuperação.</p>
          </div>
          
          <div className="process-step">
            <h3>Plano Estratégico</h3>
            <p>Desenvolvemos um plano personalizado com estimativas claras de resultados e prazos.</p>
          </div>
          
          <div className="process-step">
            <h3>Implementação</h3>
            <p>Executamos as estratégias com segurança jurídica e transparência total.</p>
          </div>
          
          <div className="process-step">
            <h3>Resultados e Monitoramento</h3>
            <p>Garantimos os resultados e monitoramos continuamente sua situação fiscal.</p>
          </div>
        </div>
        
        <div style={{textAlign: 'center', marginTop: '50px'}}>
          <a href={whatsappUrl} className="btn" target="_blank" rel="noopener noreferrer">
            INICIE SEU DIAGNÓSTICO GRATUITO
          </a>
        </div>
      </div>
    </section>
  );
}