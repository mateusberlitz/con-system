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

export interface Permission{
    id: number;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface PaymentCategory{
    id: number;
    name: string;
    color: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Provider{
    id: number;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}


export interface Payment{
    id: number;
    title: string;
    value: number;
    expire: string;
    category: PaymentCategory;
    company: Company;
    provider?: Provider;
    pay_to_user?: User;
    observation: string;
    contract: string;
    group: string;
    quote: string;
    recurrence?: number;
    status?: boolean;
    file: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface dayPayments{
    [day: string]: Payment[];
}


export interface BillCategory{
    id: number;
    name: string;
    color: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Bill{
    id: number;
    title: string;
    value: number;
    expire: string;
    category: PaymentCategory;
    company: Company;
    provider?: Provider;
    pay_to_user?: User;
    observation: string;
    contract: string;
    group: string;
    quote: string;
    recurrence?: number;
    status?: boolean;
    file: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface dayBills{
    [day: string]: Bill[];
}