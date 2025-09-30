'use client'

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const faqItems: FAQItem[] = [
    {
      question: "A Recuperação de Créditos é legal ou pode gerar problemas futuros com o Fisco?",
      answer: "Absolutamente legal. Nossa atuação é 100% baseada na legislação vigente e em teses com jurisprudência favorável. Apenas identificamos e solicitamos a devolução de impostos que, por direito, foram pagos a maior pela sua empresa. Trabalhamos com total transparência e dentro dos limites legais, sem colocar sua empresa em risco."
    },
    {
      question: "Quanto custa o serviço de Planejamento e Recuperação Tributária?",
      answer: "O diagnóstico inicial é gratuito e sem compromisso. Após a identificação do potencial de economia ou recuperação, apresentamos uma proposta com base principalmente em honorários de Êxito (success fee). Ou seja, nossa remuneração está vinculada ao dinheiro que de fato entra no caixa da sua empresa ou à economia real gerada. Cobramos uma pequena taxa inicial para custos operacionais, mas a maior parte dos honorários só é devida quando você obtém o benefício financeiro."
    },
    {
      question: "O serviço é apenas para grandes empresas?",
      answer: "Não. Atendemos empresas de todos os portes e regimes (Simples Nacional, Lucro Presumido e Lucro Real). Muitas vezes, as pequenas e médias empresas são as que mais sofrem e as que mais se beneficiam de um planejamento eficiente, pois erros no enquadramento podem ter um peso enorme no resultado financeiro. Temos soluções adaptadas para cada realidade empresarial."
    },
    {
      question: "Quanto tempo leva para ter o dinheiro de volta?",
      answer: "O tempo varia conforme a estratégia utilizada. A recuperação de créditos via compensação administrativa costuma ser mais rápida (3 a 12 meses). Já a recuperação via ação judicial pode levar mais tempo (1 a 3 anos), dependendo da complexidade do caso e do tribunal. No entanto, o Planejamento Tributário (redução de impostos futuros) gera economia imediata no mês seguinte à implementação. Durante o diagnóstico, apresentamos estimativas realistas de prazos para seu caso específico."
    },
    {
      question: "Minha empresa já está sendo fiscalizada. Vocês podem ajudar?",
      answer: "Sim, oferecemos defesa especializada em contencioso fiscal, atuando desde a fase de Notificação até a defesa final em juízo ou no âmbito administrativo. Temos vasta experiência em negociações com o Fisco e em defesas técnicas que minimizam significativamente as penalidades. Quanto antes nos procurar, mais podemos fazer para proteger seus interesses."
    }
  ];
  
  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
  return (
    <section className="section-gray" id="faq">
      <div className="container">
        <h2>Perguntas Frequentes</h2>
        <p className="lead">Tire todas suas dúvidas sobre nossos serviços e metodologia.</p>
        
        <div className="faq-container">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            >
              <div 
                className="faq-question" 
                onClick={() => toggleFAQ(index)}
              >
                {item.question}
              </div>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}