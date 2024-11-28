import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ExProductForm } from "../../../components/ExProductForm/ExProductForm.tsx";
import ExSidebar from "../../../components/ExSidebar/index.tsx";
import { IUpdateProduct } from "../../../core/@Types/IUpdateProduct.ts";
import { getProductById, updateProduct } from "../../../core/services/productService.ts";

export function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const navigate = useNavigate();

  const [product, setProduct] = useState<IUpdateProduct | undefined>();

  useEffect(() => {
    const fetchProductData = async () => {
      if (id) {
        try {
          const productToEdit = await getProductById(Number(id));
          setProduct(productToEdit);
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

  const handleUpdateProduct = async (data: IUpdateProduct) => {
    try {
      await updateProduct(Number(id), data);
      toast({
        title: "Produto Atualizado",
        description: "O produto foi atualizado com sucesso!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      navigate("/estoque");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorMsg =
          status === 400 || status === 404
            ? "Dados inválidos. Verifique as informações do produto."
            : "Falha ao atualizar. Tente novamente mais tarde.";
        toast({
          title: "Erro na Atualização",
          description: errorMsg,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Erro na Atualização",
          description: "Um erro desconhecido ocorreu.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      <ExSidebar />
      <ExProductForm product={product} onFormSubmit={handleUpdateProduct} />
    </>
  );
}
