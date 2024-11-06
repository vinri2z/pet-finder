'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from '@/supabase'
import { useState } from 'react'

export default function RegistroMascota() {
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('')
  const [raza, setRaza] = useState('')
  const [estado, setEstado] = useState('')
  const [imagen, setImagen] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre || !tipo || !raza || !estado || !imagen) {
      alert('Por favor, complete todos los campos')
      return
    }
    console.log({imagen})
    try {
      // Subir la imagen a Supabase Storage
      const { data: imageData, error: imageError } = await supabase.storage
        .from('pets')
        .upload(`${Date.now()}-${imagen.name}`, imagen)
      if (imageError) throw imageError

      // Insertar los datos de la mascota en la base de datos
      const { error } = await supabase
        .from('pets')
        .insert([
          { nombre, tipo, raza, estado, imagen_url: imageData?.path },
        ])

      if (error) throw error

      alert('Mascota registrada con éxito')
      setNombre('')
      setTipo('')
      setRaza('')
      setEstado('')
      setImagen(null)
    } catch (error) {
      console.error('Error:', error)
      alert('Error al registrar la mascota')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="tipo">Tipo</Label>
        <Select onValueChange={setTipo} required>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione el tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="perro">Perro</SelectItem>
            <SelectItem value="gato">Gato</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="raza">Raza</Label>
        <Input
          id="raza"
          value={raza}
          onChange={(e) => setRaza(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="estado">Estado</Label>
        <Select onValueChange={setEstado} required>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione el estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="perdido">Perdido</SelectItem>
            <SelectItem value="encontrado">Encontrado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="imagen">Imagen</Label>
        <Input
          id="imagen"
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files?.[0] || null)}
          required
        />
      </div>
      <Button type="submit">Registrar Mascota</Button>
    </form>
  )
}