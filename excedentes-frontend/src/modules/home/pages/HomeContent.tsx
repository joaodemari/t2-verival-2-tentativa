import React, { useState, useEffect } from 'react';
import http from '../../../config/axios.config';
import { Text, Button, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, VStack, IconButton,useToast, Flex, Spinner } from '@chakra-ui/react';
import HomeItemCard from '../../../components/Home/HomeItemCard';
import HomeItemCardArrow from '../../../components/Home/HomeItemCardArrow';
import { ProductsService } from '../../../core/api/products';
import { IHomeProduct } from '../../../core/@Types/IProduct';
import { addItemToCart } from '../../../core/services/ordersService';

const HomeContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [products, setProducts] = useState<IHomeProduct[]>([]);
  const [productsForSelectedCategory, setProductsByCategory] = useState<IHomeProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchNearbyProducts(latitude, longitude, 10);
        },
        (error) => {
          console.error("Erro ao obter a localização:", error);
          fetchNearbyProducts();
        }
      );
    } else {
      console.error("Geolocalização não é suportada pelo navegador.");
      fetchNearbyProducts();
    }
  }, []);

  const fetchNearbyProducts = (latitude?: number, longitude?: number, radius: number = 10) => {
    setIsLoading(true);

    new ProductsService().getProductsByLocation({ latitude, longitude, radius })
      .then(response => {
        const data = response.data;
        setProducts(data);

        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar os produtos:', error);
        setIsLoading(false);
      });
  };

  const handleCategoryClick = (category: string) => {
    if(category == selectedCategory) {
        setSelectedCategory(null);
        setProductsByCategory(products);
        return;
    }

    setSelectedCategory(category);
    setProductsByCategory(products.filter((p) => p.category == category));
  };

  const handleAddToCart = (product_id: number) => {
    const quantity = 1;

    addItemToCart(product_id, quantity)
      .then(() =>{
        toast({
          title: "Item adicionado ao carrinho com sucesso!",
          description: "O seu produto se encontra no carrinho.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch(_ => {
        toast({
          title: "Erro!",
          description: "Não foi possível incluir este produto ao seu carrinho.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  }

  if(isLoading) {
    return (
        <VStack spacing={4} width={"100%"} align="stretch">
            <Flex justify="center" align="center" height="100vh">
                <Spinner size="xl" />
            </Flex>
        </VStack>
    );
  }

  return (
    <main className='px-4 pb-4'>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <Popover>
          <PopoverTrigger>
            <Button backgroundColor="#21381B" color="white">
              Filtros
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Selecione uma Categoria</PopoverHeader>
            <PopoverBody>
              <VStack align="start">
                {categories.map(category => (
                  <Button key={category} bg={selectedCategory == category ? '#4CAF50' : undefined} color={selectedCategory == category ? '#FFFFFF' : undefined} onClick={() => handleCategoryClick(category)}>
                    {category}
                  </Button>
                ))}
                <Button onClick={() => setSelectedCategory(null)}>Todas</Button>
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </div>
      {selectedCategory ? (
        <section>
          <Text fontSize={48} color="#21381B" mb={4}>{selectedCategory}</Text>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {productsForSelectedCategory.slice(0, 15).map(product => (
                <HomeItemCard product={product} handleAddToCart={(id) => handleAddToCart(id)} />
            ))}

            {productsForSelectedCategory.length > 15 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                    <HomeItemCardArrow />
                </div>
            )}
            </div>
        </section>
      ) : (
        <>
        {categories.map(category => (
            <section>
            <Text fontSize={48} color="#21381B" mb={4}>{category}</Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {products.filter((p) => p.category == category).slice(0, 15).map(product => (
                <HomeItemCard product={product} handleAddToCart={(id) => handleAddToCart(id)} />
            ))}

            {products.filter((p) => p.category == category).length > 15 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                    <HomeItemCardArrow />
                </div>
            )}
            </div>
            </section>
        ))}
        </>
      )}
    </main>
  );
};

export default HomeContent;