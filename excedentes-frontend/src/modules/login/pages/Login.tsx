import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  FormErrorMessage,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Logo from "/Excedentes.svg";
import { postLogin } from "../../../core/services/loginService";
import axios from "axios";
import ExButton from "../../../components/ExButton";
import RedirectionModal from "../../../components/RedirectionModal";

interface LoginFormInputs {
  email: string;
  password: string;
}

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<LoginFormInputs>({
    mode: "onBlur",
  });

  const email = watch("email");
  const password = watch("password");

  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    try {
      const loginResponse = await postLogin(data);
      const { access_token, userType } = loginResponse;
      localStorage.setItem("access_token", access_token);
      toast({
        title: "Login com Sucesso",
        description: "Você está logado!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      reset();
      navigate(userType === "client" ? "/" : "/estoque");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorMsg =
          status === 400
            ? "Usuário não encontrado. Verifique seu e-mail e senha."
            : "Falha ao logar. Tente novamente.";
        toast({
          title: "Erro de Login",
          description: errorMsg,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Erro de Login",
          description: "Um erro desconhecido ocorreu.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormFilled = email && password;

  const {
    isOpen: isRedirectionModalOpen,
    onOpen: onOpenRedirectionModal,
    onClose: onCloseRedirectionModal,
  } = useDisclosure();

  return (
    <>
      <VStack align={"center"} display={"flex"} width="100%" justify="center" my="4">
        <Image src={Logo} className="-ml-3 h-20" marginBottom={114} />
        <form>
          <VStack
            flexDirection={"column"}
            gap={2}
            width={"24rem"}
            align={"left"}
          >
            <FormControl isInvalid={!!errors.email}>
              <Input
                placeholder="E-mail"
                size="lg"
                {...register("email", {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "E-mail inválido",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <InputGroup size="lg">
                <Input
                  placeholder="Senha"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    minLength: {
                      value: 6,
                      message: "A senha deve ter pelo menos 6 caracteres",
                    },
                  })}
                />
                <InputRightElement>
                  <IconButton
                    size="xl"
                    bg="transparent"
                    variant="ghost"
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={handlePasswordVisibility}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>

            <Link
              alignSelf="flex-start"
              style={{ marginLeft: "8px" }}
              href="https://google.com/"
              target="_new"
            >
              Esqueceu a senha?
            </Link>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "6rem",
              }}
            >
              <ExButton
                content="Entrar"
                color="white"
                bgColor="primary"
                bgHover="green300"
                type="button"
                size="lg"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={handleSubmit(onSubmit)}
                isLoading={isLoading}
                disabled={!isFormFilled || !isValid}
              />
            </div>

            <Text alignSelf={"center"} marginTop={"2.5rem"}>
              Não tem uma conta?
            </Text>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "0.5rem",
              }}
            >
              <ExButton
                content="Criar conta"
                color="white"
                bgColor="#4A5568"
                bgHover="#2D3748"
                type="button"
                size="lg"
                onClick={onOpenRedirectionModal}
              />
            </div>
          </VStack>
        </form>
      </VStack>
      <RedirectionModal
        isOpen={isRedirectionModalOpen}
        onClose={onCloseRedirectionModal}
      />
    </>
  );
}
