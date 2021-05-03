export interface Company{
    id: number;
    name: string;
    address: string;
    phone?: string;
    cnpj?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Role{
    id: number;
    name: string;
    desk_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface User{
    id: number,
    name: string;
    last_name: string;
    email: string;
    image: string;
    cpf: string;
    email_verified_at: string;
    phone: string;
    role: Role;
    created_at?: Date;
    updated_at?: Date;
    company: Company;
}