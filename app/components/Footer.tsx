'use client'

export default function Footer() {
  const whatsappUrl = "https://web.whatsapp.com/send?phone=554391244440"; 
  
  return (
    <footer id="contato">
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Entre em Contato</h3>
            <p>Agende agora mesmo seu diagnóstico tributário gratuito e sem compromisso.</p>
            <div style={{margin: '25px 0'}}>
              <a href={whatsappUrl} className="btn" style={{margin: '0 10px 10px 0'}} target="_blank" rel="noopener noreferrer">
                LIGUE AGORA
              </a>
              <a href={whatsappUrl} className="btn" style={{margin: '0 0 10px 10px'}} target="_blank" rel="noopener noreferrer">
                WHATSAPP
              </a>
            </div>
            <p>Email: contato@advocaciatributaria.com.br</p>
          </div>
          
          <div className="footer-column">
            <h3>Nossos Serviços</h3>
            <ul style={{listStyleType: 'none'}}>
              <li style={{marginBottom: '10px'}}>✓ Recuperação de Créditos Tributários</li>
              <li style={{marginBottom: '10px'}}>✓ Planejamento Tributário Estratégico</li>
              <li style={{marginBottom: '10px'}}>✓ Contencioso Administrativo e Judicial</li>
              <li style={{marginBottom: '10px'}}>✓ Due Diligence Tributária</li>
              <li style={{marginBottom: '10px'}}>✓ Consultoria Tributária Permanente</li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Áreas de Atuação</h3>
            <ul style={{listStyleType: 'none'}}>
              <li style={{marginBottom: '10px'}}>• ICMS (Interestadual e Interno)</li>
              <li style={{marginBottom: '10px'}}>• PIS e COFINS</li>
              <li style={{marginBottom: '10px'}}>• IRPJ e CSLL</li>
              <li style={{marginBottom: '10px'}}>• IPI</li>
              <li style={{marginBottom: '10px'}}>• ISS</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2023 Escritório de Advocacia Tributária. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}