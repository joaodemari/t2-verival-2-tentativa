/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Checkbox,
    Flex,
    Image,
    Input,
    Link,
    Text,
    Textarea,
    VStack,
    useToast,
} from "@chakra-ui/react";
import Logo from "/Excedentes.svg";
import { postContractor } from "../../../core/services/contractorService";
import { createContractorSchema } from "../../../core/schemas/createContractorSchema";
import { ICreateContractor } from "../../../core/@Types/ICreateContractor";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import axios from "axios";
import { useState } from "react";
import AddressInput from "../../../components/AddressInput";
import { postLogin } from "../../../core/services/loginService";

const Contratante = () => {
    const toast = useToast();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ICreateContractor & { terms: boolean, latitude: number, longitude: number }>({
        resolver: zodResolver(createContractorSchema),
    });

    const [latLong, setLatLong] = useState({ latitude: 0.0, longitude: 0.0 });

    const navigate = useNavigate();

    const onLoadLatLong = (lat: number, long: number) => {
        setLatLong(() => ({
            latitude: lat, longitude: long
        }))
    }

    const onSubmit = async (data: ICreateContractor & { terms: boolean, latitude: number, longitude: number }) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            await postContractor({
                email: data.email,
                name: data.name,
                password: data.password,
                confirmPassword: data.confirmPassword,
                address: {
                    formattedName: data.address.formattedName,
                    latitude: data.latitude,
                    longitude: data.longitude,
                },
                cnpj: data.cnpj.replace(/\D/g, ""),
                workingHours: data.workingHours,
            });
            
            const loginResponse = await postLogin({ email: data.email, password: data.password });
            localStorage.setItem("access_token", loginResponse.access_token);

            toast({
                title: "Login com Sucesso",
                description: "Você está logado!",
                status: "success",
                duration: 9000,
                isClosable: true,
            });

            navigate("/estoque");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast({
                    title: "Erro ao cadastrar",
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                    description: error.response?.data.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });

                return;
            }
             
                toast({
                    title: "Erro ao Cadastrar",
                    description: "Falha ao cadastrar. Tente novamente.",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
        }
    };

    return (
        <VStack className="items-center justify-center w-full h-full">
            <Image className="-ml-3 h-20" marginBottom={50} src={Logo} alt="Logo" />
            <Text fontWeight={600} fontSize="1.5rem" color="primary">
                Cadastro
            </Text>
            <form
                onSubmit={handleSubmit((data) => {
                    onSubmit({ ...data, latitude: latLong.latitude, longitude: latLong.longitude })
                }, data => {
                    console.log(data);
                })}
            >
                <Flex flexDirection="column" gap={2} align="left" width="430px">
                    <Input placeholder="Nome" {...register("name")} isInvalid={!!errors.name} />
                    {errors.name?.message && <Text color="red">{errors.name.message}</Text>}

                    <Input
                        placeholder="E-mail"
                        {...register("email", {
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Email inválido",
                            },
                        })}
                        isInvalid={!!errors.email}
                        onChange={e => setValue("email", e.target.value)}
                    />
                    {errors.email?.message && <Text color="red">{errors.email.message}</Text>}

                    <Input
                        placeholder="Senha"
                        type="password"
                        {...register("password")}
                        isInvalid={!!errors.password}
                    />
                    {errors.password?.message && <Text color="red">{errors.password.message}</Text>}

                    <Input
                        placeholder="Confirmar Senha"
                        type="password"
                        {...register("confirmPassword")}
                        isInvalid={!!errors.confirmPassword}
                    />
                    {errors.confirmPassword?.message && (
                        <Text textAlign="left" color="red">{errors.confirmPassword.message}</Text>
                    )}

                    <AddressInput isInvalid={!!errors.address?.formattedName} register={register("address.formattedName")} onLoadLatLong={(lat, long) => onLoadLatLong(lat, long)}
                    />
                    {errors.address?.formattedName?.message && (
                        <Text color="red">{errors.address.formattedName.message}</Text>
                    )}

                    <Input
                        placeholder="CNPJ"
                        pattern="^[0-9\.\-\/]+$"
                        {...register("cnpj")}
                        as={InputMask}
                        mask="99.999.999/0001.99"
                        maskChar={null}
                        isInvalid={!!errors.cnpj}
                    />
                    {errors.cnpj?.message && <Text color="red">{errors.cnpj.message}</Text>}

                    <Textarea
                        placeholder="Horário Comercial"
                        {...register("workingHours")}
                        isInvalid={!!errors.workingHours}
                    />
                    {errors.workingHours?.message && (
                        <Text color="red">{errors.workingHours.message}</Text>
                    )}

                    <Flex justifyContent="center">
                        <Checkbox mt="5" colorScheme="green" alignSelf="left" {...register("terms")}>
                            Li e concordo com os{" "}
                            <Link href="https://google.com/" target="_new" color="#0070E0">
                                termos de uso
                            </Link>
                        </Checkbox>
                    </Flex>
                    {errors.terms?.message && <Text color="red" align="center">{errors.terms.message}</Text>}

                    <Button
                        className="mt-10 w-1/2"
                        background="#21381B"
                        color="#ffffff"
                        type="submit"
                        alignSelf={"center"}
                    >
                        Criar Conta
                    </Button>
                </Flex>
            </form>
        </VStack>
    );

}

export default Contratante;