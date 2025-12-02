import { Routes, Route } from 'react-router-dom'
import { Exhibit, Exhibits, Users, Login, Register, CreateExhibit } from './pages'
import { NavBar } from './components/NavBar';

export default function App () {
  return (
    <div className="app">
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Exhibits />} />
          <Route path="/users" element={<Users />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/exhibit/:id" element={<Exhibit />} />
          <Route path="/exhibit/create" element={<CreateExhibit />} />
        </Routes>
      </main>
    </div>
  )
}
