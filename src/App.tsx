import { Route } from 'react-router-dom'
import About from './components/About'

function App () {
  return (
    <div className="App">
      <Route>
        <Route path="/about" element={<About />}/>
      </Route>
    </div>
  )
}

export default App
