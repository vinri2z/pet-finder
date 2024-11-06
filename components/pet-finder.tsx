'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { addPet, uploadPetImage } from '@/supabase'; // Import the Supabase functions
import { useState } from 'react'

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
  age?: number;
  image_url?: string;
  created_at?: string;
}

const PetFinder = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [newPet, setNewPet] = useState<Partial<Pet>>({});
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = await uploadPetImage(file);
      if (imageUrl) {
        setNewPet({ ...newPet, image_url: imageUrl });
      } else {
        toast({ title: 'Error', description: 'Failed to upload image' });
      }
    }
  };

  const handleAddPet = async () => {
    if (newPet.name && newPet.species && newPet.breed && newPet.status) {
      const addedPet = await addPet(newPet as Pet);
      if (addedPet) {
        setPets([...pets, addedPet]);
        toast({ title: 'Success', description: 'Pet added successfully' });
      } else {
        toast({ title: 'Error', description: 'Failed to add pet' });
      }
    } else {
      toast({ title: 'Error', description: 'Please fill in all required fields' });
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Add a Pet</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Name</Label>
          <Input value={newPet.name || ''} onChange={(e) => setNewPet({ ...newPet, name: e.target.value })} />
          <Label>Species</Label>
          <Input value={newPet.species || ''} onChange={(e) => setNewPet({ ...newPet, species: e.target.value })} />
          <Label>Breed</Label>
          <Input value={newPet.breed || ''} onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })} />
          <Label>Status</Label>
          <Select value={newPet.status || ''} onValueChange={(value) => setNewPet({ ...newPet, status: value as PetStatus })}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PetStatus.Lost}>Lost</SelectItem>
              <SelectItem value={PetStatus.Found}>Found</SelectItem>
            </SelectContent>
          </Select>
          <Label>Image</Label>
          <Input type="file" onChange={handleFileChange} />
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddPet}>Add Pet</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PetFinder;