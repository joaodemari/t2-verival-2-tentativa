import categoriesJSON from '../assets/data/categories.json';

interface Categoria {
    name: string;
    id: number;
}

export function readCategories(): Categoria[] {
    try{
        const categories = categoriesJSON.categorias;
        return categories;
    }
    catch (error){
        console.error('Erro ao ler o arquivo JSON', error);
        return [];
    }
}