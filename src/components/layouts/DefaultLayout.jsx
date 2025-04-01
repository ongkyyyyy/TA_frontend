import { Outlet } from 'react-router-dom'
import Sidebar from '../sidebar/Sidebar'

function DefaultLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default DefaultLayout
