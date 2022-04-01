import Footer from './components/common/Footer/Footer'
import Header from './components/common/Header/Header'

function App () {
  return (
    <div className="App">
      {<Header appName={undefined} headers={undefined}/>}
      <Footer/>
    </div>
  )
}

export default App
