import Preloader from './Components/Preloader.jsx'
import Experience from './Components/Experience.jsx'
import NavBar from './Components/NavBar.jsx'
import WorkSection from './Components/WorkSection.jsx'
import Footer from './Components/Footer.jsx'
import LocomotiveProvider from './LocomotiveContext.jsx'

const App = () => {
  return (
    <LocomotiveProvider>
      {/* No data-scroll-container needed in v5 — uses native scroll */}
      <div className="relative min-h-screen overflow-x-hidden">
        <Preloader />
        <NavBar />
        <Experience />
        <WorkSection />
        <Footer />
      </div>
    </LocomotiveProvider>
  )
}

export default App