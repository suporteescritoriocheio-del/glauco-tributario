'use client'

export default function Problems() {
  const whatsappUrl = "https://web.whatsapp.com/send?phone=554391244440&text=";
  
  return (
    <section className="section-light problems-section" id="problemas">
      <div className="container">
        <h2>Você está perdendo dinheiro todos os meses sem saber</h2>
        <p className="lead">Empresas brasileiras procuram um advogado tributário não apenas por questões técnicas, mas pelas <span className="highlight">consequências dolorosas no caixa</span> que afetam diretamente a sobrevivência do negócio.</p>
        
        <div className="problems-container">
          <div className="problem-card">
            <h3>Lucro Líquido Sempre Baixo</h3>
            <p>Você trabalha incansavelmente, mas no final do mês o lucro some. O problema pode estar no pagamento indevido ou a maior de PIS e COFINS, impostos sobre o consumo mal calculados, ou enquadramento fiscal (Simples/Presumido/Real) incorreto.</p>
            <div className="problem-solution">
              <h4>Solução:</h4>
              <p>Identificamos os excessos de pagamento e recuperamos o que é seu por direito, injetando capital de volta no seu negócio.</p>
            </div>
          </div>
          
          <div className="problem-card">
            <h3>Multas e Intimações Surpresa</h3>
            <p>A cada mudança legislativa (Federal, Estadual, Municipal), sua empresa fica exposta a erros na apuração de ICMS ou IPI. A falta de atualização gera multas que poderiam ser evitadas.</p>
            <div className="problem-solution">
              <h4>Solução:</h4>
              <p>Atualizamos sua empresa frente às mudanças e defendemos seus interesses em caso de autuações, reduzindo ou eliminando multas.</p>
            </div>
          </div>
          
          <div className="problem-card">
            <h3>Medo da Fiscalização</h3>
            <p>A insegurança jurídica em operações complexas, falta de provas documentais adequadas e contencioso administrativo sem defesa especializada geram ansiedade e risco desnecessário.</p>
            <div className="problem-solution">
              <h4>Solução:</h4>
              <p>Oferecemos defesa especializada e implementamos processos que garantem conformidade e tranquilidade nas operações.</p>
            </div>
          </div>
          
          <div className="problem-card">
            <h3>Capital de Giro Preso</h3>
            <p>Créditos tributários (como o ICMS-ST) não aproveitados retêm um dinheiro que poderia estar investido no crescimento do seu negócio, limitando sua capacidade de expansão.</p>
            <div className="problem-solution">
              <h4>Solução:</h4>
              <p>Identificamos e recuperamos créditos tributários não utilizados, liberando capital para investir no crescimento do seu negócio.</p>
            </div>
          </div>
        </div>
        
        <div style={{textAlign: 'center', marginTop: '50px'}}>
          <p className="lead">Nossa missão é <span className="highlight">estancar essa hemorragia financeira</span> e blindar o futuro da sua empresa.</p>
          <a href={whatsappUrl} className="btn" target="_blank" rel="noopener noreferrer">
            QUERO BLINDAR MINHA EMPRESA E RECUPERAR CRÉDITOS
          </a>
        </div>
      </div>
    </section>
  );
}