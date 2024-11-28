import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ExProductForm } from "../../../components/ExProductForm/ExProductForm.tsx";
import ExSidebar from "../../../components/ExSidebar/index.tsx";
import { IUpdateProduct } from "../../../core/@Types/IUpdateProduct.ts";
import { getProductById } from "../../../core/services/productService.ts";

export function DetailProduct() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const navigate = useNavigate();

  const [product, setProduct] = useState<IUpdateProduct | undefined>();

  useEffect(() => {
    const fetchProductData = async () => {
      if (id) {
        try {
          const productToDetail = await getProductById(Number(id));
          setProduct(productToDetail);
        } catch (error) {
          toast({
            title: "Erro ao carregar dados",
            description: "Não foi possível carregar os dados do produto.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      }
    };
    void fetchProductData();
  }, [id, toast]);


return (
    <>
        <ExSidebar />
        <ExProductForm product={product} onFormSubmit={ () => {navigate("/estoque")}} isInDetailMode={true}/>
    </>
);
}
