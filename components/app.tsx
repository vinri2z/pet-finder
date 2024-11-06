'use client'

import ListaMascotas from '@/components/pet-list'
import RegistroMascota from '@/components/pet-register'

export function AppComponent() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Registro de Mascotas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Registrar Nueva Mascota</h2>
          <RegistroMascota />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Mascotas Registradas</h2>
          <ListaMascotas />
        </div>
      </div>
    </div>
  )
}