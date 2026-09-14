import { StoreProvider } from './store/StoreContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductGrid from './components/ProductGrid'
import Marquee from './components/Marquee'
import Lookbook from './components/Lookbook'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import QuickViewModal from './components/QuickViewModal'
import SearchModal from './components/SearchModal'
import SizeGuide from './components/SizeGuide'
import Toaster from './components/Toaster'

export default function App() {
  return (
    <StoreProvider>
      <a
        href="#catalogue"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:bg-obsidian focus:px-4 focus:py-2 focus:font-display focus:text-xs focus:uppercase focus:tracking-[0.2em] focus:text-cream"
      >
        Skip to collection
      </a>

      <Navbar />

      <main>
        <Hero />
        <ProductGrid />
        <Marquee />
        <Lookbook />
      </main>

      <Footer />

      {/* Overlays */}
      <SearchModal />
      <QuickViewModal />
      <CartDrawer />
      <SizeGuide />
      <Toaster />
    </StoreProvider>
  )
}
