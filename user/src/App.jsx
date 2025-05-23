import { BrowserRouter, Routes, Route }  from "react-router-dom"
import Flags from "./pages/Flags"
import Home from "./pages/Home"
import About from "./pages/About"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/signin"
import Dashboard from "./pages/Dashboard"
import Header from "./components/Header"

export default function App() {
  return (
   <BrowserRouter>
   <Header>
     <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignUp/>} />
        <Route path='/sign-up' element={<SignIn />} />
        
          <Route path='/dashboard' element={<Dashboard />} />
        
        <Route path='/projects' element={<Flags />} />
        </Routes>
        </Header>
   </BrowserRouter>
  )
}
