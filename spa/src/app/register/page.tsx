'use client'
import AuthLayout from "@/components/authLayout";
import Button from "@/components/button";
import Input from "@/components/input";
import { registerSchema, RegisterSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { registerUser } from "../actions";
import ErrorMessage from "@/components/errorMessage";
import Link from "next/link";
import { useState } from "react";

export default function Register() {
  const { register, control, handleSubmit, setError, setFocus, formState: { errors } } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userType: "COMMON"
    }
  })
  const [loading, setLoading] = useState(false)

  const handleRegister: SubmitHandler<RegisterSchema> = async (data) => {
    setLoading(true)
    try {
      const res = await registerUser(data)
      const error = await res.error
      setError("root", { message: error.detail })
    } catch (error) {
      console.log("error:", error)
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 400);
    }
  };

  const onError: SubmitErrorHandler<RegisterSchema> = (data) => {
    console.log("erro:", data)
  }

  return (
    <AuthLayout title="Crie sua conta!">
      {errors.root && <ErrorMessage>{errors.root.message}</ErrorMessage>}
      <form onSubmit={handleSubmit(handleRegister, onError)}
        className="flex flex-col gap-3 w-full"
      >
        <Input
          label="Nome completo"
          type="text"
          register={register("fullName")}
          control={control}
        />
        <Input
          label="CPF/CNPJ"
          type="text"
          register={register("document")}
          control={control}
        />
        <Input
          label="Email"
          type="email"
          register={register("email")}
          control={control}
        />
        <Input
          label="Senha"
          type="password"
          register={register("password")}
          control={control}
        />
        <Input
          label="Tipo de usuário"
          type="radio"
          options={[{ value: "COMMON", label: "Comum" }, { value: "MERCHANT", label: "Lojista" }]}
          register={register("userType")}
          control={control}
        />
        <Button type="submit" loading={loading}>
          Criar conta
        </Button>
      </form>
      <p>
        Já tem uma conta? <Link href={'/login'} className="text-primary hover:text-primaryHover cursor-pointer">
          Entre
        </Link>
      </p>
    </AuthLayout>
  );
}


