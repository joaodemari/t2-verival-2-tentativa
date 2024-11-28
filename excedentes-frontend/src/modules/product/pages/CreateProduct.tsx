import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ExProductForm } from "../../../components/ExProductForm/ExProductForm.tsx";
import ExSidebar from "../../../components/ExSidebar/index.tsx";
import { ICreateProduct } from "../../../core/@Types/ICreateProduct.ts";
import { postProduct } from "../../../core/services/productService.ts";

export function CreateProduct() {
  const toast = useToast();
  const navigate = useNavigate();

  const handlePostProduct = async (data: ICreateProduct) => {
    try {
      await postProduct(data);
      toast({
        title: "Produto cadastrado com sucesso",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      navigate("/estoque");
    } catch (error) {
      toast({
        title: "Erro ao cadastrar produto",
        description: "Não foi possível cadastrar o produto.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <ExSidebar />
      <ExProductForm onFormSubmit={handlePostProduct} />
    </>
  );
}
