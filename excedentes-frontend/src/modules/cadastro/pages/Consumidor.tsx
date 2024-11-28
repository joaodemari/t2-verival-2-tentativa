/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Button,
  Checkbox,
  Flex,
  Image,
  Input,
  Link,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { z } from "zod";
import Logo from "/public/Excedentes.svg";
import { IClient, TipoCliente } from "../../../core/@Types/Client";
import { postConsumer } from "../../../core/services/clients";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const schema = z
  .object({
    nome: z.string().min(2, "Por favor, insira um nome válido"),
    email: z
      .string()
      .min(2, { message: "Por favor, insira um email válido" })
      .email("Formato de email inválido"),
    cpf_cnpj: z.string().min(11, { message: "Documento inválido" }),
    password: z.string().min(5, "A senha deve conter no mínimo 6 caracteres"),
    senhaConf: z.string(),
    terms: z
      .boolean()
      .refine((data) => data === true, "Você deve aceitar os termos de uso"),
  })
  .refine((data) => data.password === data.senhaConf, {
    message: "As senhas não conferem",
    path: ["senhaConf"], // field that the error is attached to
  });

const Consumidor = () => {
  const toast = useToast();
  const [formData, setFormData] = useState<
    Partial<IClient> & { senhaConf: string }
  >({
    nome: "",
    email: "",
    cpf_cnpj: "",
    password: "",
    senhaConf: "",
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IClient & { senhaConf: string; terms: boolean }>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = async (
    data: IClient & { senhaConf: string; terms: boolean }
  ) => {

    const formattedCpfCnpj = data.cpf_cnpj.replace(/\D/g, "");
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const consumer = await postConsumer({
        cpf_cnpj: formattedCpfCnpj,
        email: data.email,
        nome: data.nome,
        password: data.password,
        tipo: tipoPessoa,
      });
      console.log("consumer criado", consumer);
      navigate("/");
    } catch (error) {
      if(axios.isAxiosError(error)){
          toast({
            title: "Erro ao cadastrar",
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            description: error.response?.data.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Erro ao Cadastrar",
            description: "Falha ao cadastrar. Tente novamente.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
      }
    }
  };


  const [tipoPessoa, setTipoPessoa] = useState<TipoCliente>(
    TipoCliente.PessoaFisica
  );

  return (
    <>
      <VStack align={"center"} display={"flex"} width="100%" justify="center">
        <Image className="-ml-3 h-20"  marginBottom={50} src={Logo}/>
        <Text fontSize="24px" fontWeight="bold" alignSelf="center" color="primary">
          Cadastro
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack
            flexDirection={"column"}
            gap={2}
            width={"400px"}
            align={"left"}
          >
            <Input
              placeholder="Nome"
              size="lg"
              {...register("nome")}
              isInvalid={!!errors.nome}
              onChange={(e) => {
                setFormData({ ...formData, nome: e.target.value });
              }}
            />
            {errors["nome"]?.message && (
              <Text color={"red800"}>{String(errors["nome"]?.message)}</Text>
            )}
            <Input
              placeholder="E-mail"
              size="lg"
              {...register("email", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Email inválido",
                },
              })}
              isInvalid={!!errors.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
              }}
            />
            {errors["email"]?.message && (
              <Text color={"red800"}>{String(errors["email"]?.message)}</Text>
            )}
            (
            {tipoPessoa === TipoCliente.PessoaFisica ? (
              <Input
                placeholder="CPF"
                size="lg"
                {...register("cpf_cnpj")}
                value={formData.cpf_cnpj}
                as={InputMask}
                mask="999.999.999-99"
                maskChar={null}
                isInvalid={!!errors.cpf_cnpj}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setFormData({
                    ...formData,
                    cpf_cnpj: value.replace(/\D/g, ""),
                  });
                }}
              />
            ) : (
              <Input
                placeholder="CNPJ"
                pattern="^[0-9\.\-\/]+$"
                size="lg"
                {...register("cpf_cnpj")}
                value={formData.cpf_cnpj}
                as={InputMask}
                mask="99.999.999/0001.99"
                maskChar={null}
                isInvalid={!!errors.cpf_cnpj}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setFormData({
                    ...formData,
                    cpf_cnpj: value,
                  });
                }}
              />
            )}
            )
            {errors["cpf_cnpj"]?.message && (
              <Text color={"red"}>
                {String(errors["cpf_cnpj"]?.message)}
              </Text>
            )}
            <RadioGroup
              value={tipoPessoa}
              onChange={(value) => setTipoPessoa(value as TipoCliente)}
            >
              <Stack direction="row" alignItems="center">
                <Radio
                  name="tipoPessoa"
                  value={TipoCliente.PessoaFisica}
                  colorScheme="green"
                >
                  Pessoa Física
                </Radio>
                <Radio
                  name="tipoPessoa"
                  value={TipoCliente.PessoaJuridica}
                  colorScheme="green"
                >
                  Pessoa Jurídica
                </Radio>
              </Stack>
            </RadioGroup>
            <Input
              placeholder="Senha"
              size="lg"
              type="password"
              {...register("password")}
              isInvalid={!!errors.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
            />
            {errors["password"]?.message && (
              <Text color={"red800"}>
                {String(errors["password"]?.message)}
              </Text>
            )}
            <Input
              placeholder="Confirme a senha"
              size="lg"
              type="password"
              {...register("senhaConf")}
              isInvalid={!!errors.password}
              onChange={(e) => {
                setFormData({ ...formData, senhaConf: e.target.value });
              }}
            />
            {errors["senhaConf"]?.message && (
              <Text color={"red800"}>
                {String(errors["senhaConf"]?.message)}
              </Text>
            )}
            <Flex justifyContent="center">
              <Checkbox
                mt="5"
                colorScheme="green"
                isInvalid={!!errors.terms}
                {...register("terms")}
              >
                Li e concordo com os{" "}
                <Link href="https://google.com/" target="_new" color="#0070E0">
                  termos de uso
                </Link>
              </Checkbox>
            </Flex>
            {errors["terms"]?.message && (
              <Text color={"red800"} align={"center"}>{String(errors["terms"]?.message)}</Text>
            )}
            <Button
              className="mt-10 w-1/2 self-center"
              bg="primary"
              type="submit"
              textColor="white"
            >
              Criar Conta
            </Button>
          </VStack>
        </form>
      </VStack>
    </>
  );
};

export default Consumidor;