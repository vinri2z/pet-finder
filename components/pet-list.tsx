'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from '@/supabase'
import Image from "next/image"
import { useEffect, useState } from 'react'

interface Mascota {
  id: number
  nombre: string
  tipo: string
  raza: string
  estado: string
  imagen_url: string
}

export default function ListaMascotas() {
  const [mascotas, setMascotas] = useState<Mascota[]>([])

  useEffect(() => {
    fetchMascotas()
  }, [])

  async function fetchMascotas() {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
      
      if (error) throw error
      setMascotas(data || [])
    } catch (error) {
      console.error('Error:', error)
      alert('Error al cargar las mascotas')
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mascotas.map((mascota) => (
        <Card key={mascota.id}>
          <CardHeader>
            <CardTitle>{mascota.nombre}</CardTitle>
          </CardHeader>
          <CardContent>
            <Image
              src={`${supabase.storage.from('mascotas').getPublicUrl(mascota.imagen_url).data.publicUrl}`}
              alt={mascota.nombre}
              className="w-full h-48 object-cover mb-2"
            />
            <p><strong>Tipo:</strong> {mascota.tipo}</p>
            <p><strong>Raza:</strong> {mascota.raza}</p>
            <p><strong>Estado:</strong> {mascota.estado}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}