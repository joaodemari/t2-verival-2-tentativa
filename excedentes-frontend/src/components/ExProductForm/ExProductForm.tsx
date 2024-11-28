import {
  Box,
  Flex,
  HStack,
  InputGroup,
  InputLeftAddon,
  Select,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  ICreateProduct,
  ICreateProductRequest,
} from "../../core/@Types/ICreateProduct";
import {
  IUpdateProduct,
  IUpdateProductRequest,
} from "../../core/@Types/IUpdateProduct";
import { createProductsSchema } from "../../core/schemas/createProductSchema";
import {
  isExpirationClose,
  parseDateStrWithGMT3,
  parseDateWithGMT3,
} from "../../helpers/dateValidator";
import { readCategories } from "../../helpers/readCategories";
import ExButton from "../ExButton";
import ExInput from "../ExInput";
import ImageInput from "../ImageInput";

export interface ExProductFormProps {
  product?: IUpdateProductRequest | ICreateProductRequest;
  onFormSubmit: (data: IUpdateProduct) => Promise<void> | void;
  isInDetailMode?: boolean;
}

export function ExProductForm({
  product,
  onFormSubmit,
  isInDetailMode,
}: ExProductFormProps) {
  const isInEditMode = useMemo(() => Boolean(product), [product]);
  const [isPriceDisabled, setIsPriceDisabled] = useState<boolean>(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ICreateProduct>({
    resolver: zodResolver(createProductsSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      expiration_date: product?.expiration_date
        ? parseDateStrWithGMT3(product.expiration_date as unknown as string)
        : undefined,
      price: product?.price ?? (null as unknown as number),
      brand: product?.brand ?? "",
      category: product?.category ?? "",
      bar_code: product?.bar_code ?? "",
      quantity: product?.quantity ?? (null as unknown as number),
      picture: product?.picture ?? "",
    },
  });

  const navigate = useNavigate();
  const categories = readCategories();

  const onExpirationDateChanged = useCallback(
    (value: string) => {
      const newDate = parseDateStrWithGMT3(value);
      isInEditMode && setIsPriceDisabled(isExpirationClose(newDate));
    },
    [isInEditMode]
  );

  useEffect(() => {
    if (product && product.expiration_date) {
      setValue("name", product.name);
      setValue("description", product.description);
      setValue("price", product.price);
      setValue("brand", product.brand);
      setValue("category", product.category);
      setValue("bar_code", product.bar_code);
      setValue("quantity", product.quantity);
      setValue("expiration_date", product.expiration_date);
      setValue("picture", product?.picture || "");
      onExpirationDateChanged(product.expiration_date.toString());
    }
  }, [product, setValue, isInEditMode]);

  const formTitle = useMemo(() => {
    if (isInDetailMode) {
      return "Detalhes do";
    } else {
      return isInEditMode ? "Edite seu" : "Cadastre seu";
    }
  }, [isInEditMode, isInDetailMode]);

  return (
    <>
      <Flex className="center" width="100%">
        <Box
          alignSelf="center"
          margin={{ base: 15, md: 10 }}
          padding={{ base: 18, md: 15 }}
          style={{ marginTop: 0, paddingTop: 0 }}
        >
          <Text fontSize={{ base: 23, md: 30 }} fontWeight={400}>
            {formTitle} produto
          </Text>
        </Box>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={handleSubmit(onFormSubmit, (err) => console.log(err))}>
          <Flex
            direction={{ base: "column", md: "row" }}
            flexWrap="wrap"
            alignItems="flex-start"
            alignSelf="center"
            gap={4}
          >
            <Flex
              position={{ base: "relative", md: "relative" }}
              width={{ base: "100%", md: "400px" }}
              gap={{ base: 5, md: 8 }}
              direction="column"
              marginRight={{ base: 0, md: 8 }}
            >
              <VStack spacing={2} width={{ md: "400px" }}>
                <Controller name="picture" control={control} render={() => (
                  <ImageInput
                    readonly={isInDetailMode}
                    onImageChange={(image) => setValue("picture", image)}
                  />
                )} />
                <Text fontSize={20} fontWeight={400}>
                  Foto do Produto
                </Text>
              </VStack>
              <Textarea
                placeholder="Digite uma breve descrição do produto"
                size="lg"
                resize="vertical"
                h="120px"
                maxHeight={{ base: "160px", md: "240px" }}
                width={{ base: "100%", md: "400px" }}
                position="relative"
                {...register("description")}
                readOnly={isInDetailMode}
                pointerEvents={!isInDetailMode ? "auto" : "none"}
              />
              {errors["description"]?.message && (
                <Text color={"red"} fontSize={"sm"}>
                  {errors["description"]?.message}
                </Text>
              )}
              <Controller
                name="quantity"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ExInput
                    placeholder="Quantidade"
                    type="number"
                    size="lg"
                    value={value}
                    onChangeText={onChange}
                    errorMessage={errors["quantity"]?.message}
                    readonly={isInDetailMode}
                  />
                )}
              />
            </Flex>
            <Flex
              position="relative"
              gap={{ base: 5, md: 8 }}
              direction="column"
              width={{ base: "100%", md: "400px" }}
            >
              <Controller
                name="name"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ExInput
                    placeholder="Nome do produto"
                    type="text"
                    size="lg"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors["name"]?.message}
                    readonly={isInDetailMode}
                  />
                )}
              />
              <Controller
                name="expiration_date"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ExInput
                    placeholder="Data de validade"
                    type="date"
                    size="lg"
                    value={
                      value
                        ? format(
                            typeof value === "string"
                              ? parseDateStrWithGMT3(value)
                              : parseDateWithGMT3(value),
                            "yyyy-MM-dd"
                          ).toString()
                        : ""
                    }
                    onChangeText={(e) => {
                      const newValue: string = e.target.value.trim();
                      onExpirationDateChanged(newValue);
                      onChange(newValue);
                    }}
                    readonly={isInDetailMode}
                  />
                )}
              />
              {errors.expiration_date?.message ? (
                <Text color="red.500" fontSize="sm">
                  {"Data de validade inválida"}
                </Text>
              ) : null}
              <Controller
                name="price"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <InputGroup size="lg" width={{ base: "100%", md: "400px" }}>
                    <InputLeftAddon>R$</InputLeftAddon>
                    <ExInput
                      placeholder="Preço"
                      type="money"
                      size="lg"
                      onChangeText={onChange}
                      errorMessage={errors["price"]?.message}
                      disabled={isPriceDisabled && !isInDetailMode}
                      value={value}
                      readonly={isInDetailMode}
                    />
                  </InputGroup>
                )}
              />
              <Controller
                name="brand"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ExInput
                    placeholder="Marca"
                    type="text"
                    size="lg"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors["brand"]?.message}
                    readonly={isInDetailMode}
                  />
                )}
              />
              <Select
                placeholder="Categoria"
                size="lg"
                {...register("category")}
                pointerEvents={!isInDetailMode ? "auto" : "none"}
              >
                {categories.map((categoria) => (
                  <option
                    key={categoria.id}
                    value={categoria.name}
                    label={categoria.name}
                  />
                ))}
              </Select>
              {errors["category"]?.message && (
                <Text color={"red"} fontSize={"sm"}>
                  {errors["category"]?.message}
                </Text>
              )}
              <Controller
                name="bar_code"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ExInput
                    placeholder="Código de barras"
                    type="text"
                    value={value}
                    size="lg"
                    onChangeText={onChange}
                    errorMessage={errors["bar_code"]?.message}
                    readonly={isInDetailMode}
                  />
                )}
              />
            </Flex>
          </Flex>
          <HStack
            spacing={{ base: 3, md: 8 }}
            justify={"center"}
            margin="20px 0px 20px 0px"
            padding="10px 0px 10px 0px"
          >
            <ExButton
              bgColor={isInDetailMode ? "primary" : "red500"}
              color="white"
              content={isInDetailMode ? "Voltar" : "Cancelar"}
              size="lg"
              type="button"
              onClick={() => navigate("/estoque")}
            />
            {!isInDetailMode && (
              <ExButton
                bgColor="primary"
                bgHover="green300"
                color="white"
                content={isInEditMode ? "Finalizar" : "Cadastrar"}
                size="lg"
                type="submit"
              />
            )}
          </HStack>
        </form>
      </Flex>
    </>
  );
}
