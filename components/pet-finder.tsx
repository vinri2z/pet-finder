'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { db, storage } from '@/firebase'
import { useToast } from "@/hooks/use-toast"
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useEffect, useState } from 'react'
enum PetStatus {
  Lost = 'lost',
  Found = 'found'
}

interface Pet {
  id: string;
  status: PetStatus;
  name: string;
  species: string;
  breed: string;
  description: string;
  imageUrl: string;
}

export default function PetFinder() {
  const [searchImage, setSearchImage] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPets = async () => {
      const querySnapshot = await getDocs(collection(db, "pets"))
      const pets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pet))
      setSearchResults(pets)
    }
    fetchPets()
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSearchImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSearch = async () => {
    setIsLoading(true)
    // In a real application, you would send the image to a backend for processing
    // Here, we'll just return all pets from Firestore
    try {
      const querySnapshot = await getDocs(collection(db, "pets"))
      const pets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pet))
      setSearchResults(pets)
    } catch (error) {
      console.error("Error searching for pets:", error)
      toast({
        title: "Error",
        description: "No se pudo buscar mascotas. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

 const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    const newPet = Object.fromEntries(formData.entries()) as Omit<Pet, 'id' | 'imageUrl'>

    try {
      let imageUrl = ''
      if (searchImage) {
        console.log({searchImage})
        const imageRef = ref(storage, `pets/${searchImage.name}`)
        const snapshot = await uploadBytes(imageRef, searchImage)
        imageUrl = await getDownloadURL(snapshot.ref)
      }

      await addDoc(collection(db, "pets"), {
        ...newPet,
        imageUrl,
      })
      toast({
        title: "Éxito",
        description: "¡Mascota registrada con éxito!",
      })
      // event.currentTarget.reset()
      setSearchImage(null)
    } catch (error) {
      console.error("Error adding pet:", error)
      toast({
        title: "Error",
        description: "Error al registrar la mascota",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Buscador de Mascotas</h1>
      <Tabs defaultValue="search">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Buscar Mascota Perdida</TabsTrigger>
          <TabsTrigger value="register">Registrar Mascota</TabsTrigger>
        </TabsList>
        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Buscar Mascota Perdida</CardTitle>
              <CardDescription>Sube una imagen de la mascota que estás buscando</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="pet-image">Imagen de la Mascota</Label>
                <Input id="pet-image" type="file" accept="image/*" onChange={handleImageUpload} />
              </div>
              {searchImage && (
                <div>
                  <p>Imagen Subida:</p>
                  <img src={searchImage} alt="Uploaded pet" className="max-w-xs mt-2" />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? 'Buscando...' : 'Buscar'}
              </Button>
            </CardFooter>
          </Card>
          {searchResults.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">Resultados de la Búsqueda</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((pet) => (
                  <Card key={pet.id}>
                    <CardHeader>
                      <CardTitle>{pet.name}</CardTitle>
                      <CardDescription>{pet.species} - {pet.breed}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{pet.description}</p>
                      {pet.imageUrl && (
                        <img src={pet.imageUrl} alt={pet.name} className="mt-2 max-w-full h-auto" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Registrar Mascota</CardTitle>
              <CardDescription>Proporciona detalles sobre la mascota que has perdido/encontrado</CardDescription>
            </CardHeader>
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                
                <div className="flex space-x-2 items-center">
                  <Label htmlFor="status">La has ...</Label>
                  <Select name="status">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lost">perdido</SelectItem>
                      <SelectItem value="found">encontrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la Mascota (si se conoce)</Label>
                  <Input id="name" name="name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="species">Especie</Label>
                  <Select name="species">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar especie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Perro</SelectItem>
                      <SelectItem value="cat">Gato</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breed">Raza</Label>
                  <Input id="breed" name="breed" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea id="description" name="description" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pet-image">Imagen de la Mascota</Label>
                  <Input id="pet-image" type="file" accept="image/*" onChange={handleImageUpload} />
                </div>
                {searchImage && (
                  <div>
                    <p>Imagen Subida:</p>
                    <img src={searchImage} alt="Uploaded pet" className="max-w-xs mt-2" />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Registrando...' : 'Registrar'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}