import { createClient } from '@supabase/supabase-js';
 
const supabaseUrl = 'https://hxgtgypcfftztxnyfsen.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string
const supabase = createClient(supabaseUrl, supabaseKey)

// Define the Pet type
interface Pet {
  id?: number;
  name: string;
  type: string;
  age?: number;
  image_url?: string;
  created_at?: string;
}

// Function to upload pet image
export async function uploadPetImage(file: File): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from('pets')
    .upload(`public/${file.name}`, file);
    
  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  return data.Key;
}

// Function to add a new pet
export async function addPet(pet: Pet): Promise<Pet | null> {
  const { data, error } = await supabase
    .from('pets')
    .insert([pet]);

  if (error) {
    console.error('Error adding pet:', error);
    return null;
  }

  return data[0];
}
