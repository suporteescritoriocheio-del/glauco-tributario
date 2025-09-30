import Hero from './components/Hero'
import Problems from './components/Problems'
import Solutions from './components/Solutions'
import Process from './components/Process'
import Objections from './components/Objections'
import Authority from './components/Authority'
import CTA from './components/CTA'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main>
      <Hero />
      <Problems />
      <Solutions />
      <Process />
      <Objections />
      <Authority />
      <CTA />
      <FAQ />
      <Footer />
    </main>
  )
}