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
    companies: Company[];
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
    individual: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface Provider{
    id: number;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface PartialPayment{
    id: number;
    value: number;
    payment: number;
    cash_flow: number;
    pay_date?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Payment{
    id: number;
    pendency: boolean;
    title: string;
    value: number;
    paid: number;
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
    proof: string;
    invoice: string;
    invoice2: string;
    partial_payments?: PartialPayment[];
    created_at?: Date;
    updated_at?: Date;
    invoice_date?: string;
    invoice2_date?: string;
    invoices_count?: number;
}

export interface dayPayments{
    [day: string]: Payment[];
}

export interface Invoice{
    id: number;
    date: string;
    payment: Payment;
    file: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface dayInvoices{
    [day: string]: Invoice[];
}

export interface BillCategory{
    id: number;
    name: string;
    color: string;
    individual: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface PartialBill{
    id: number;
    value: number;
    bill: number;
    cash_flow: number;
    receive_date?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface Bill{
    id: number;
    title: string;
    value: number;
    paid: number;
    expire: string;
    category: BillCategory;
    cash_desk_category: CashDeskCategory;
    company: Company;
    source?: Source;
    observation: string;
    status?: boolean;
    partial_bills?: PartialBill[];
    created_at?: Date;
    updated_at?: Date;
}

export interface dayBills{
    [day: string]: Bill[];
}

export interface Source{
    id: number;
    name: string;
    phone: string;
    email: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface CashFlowCategory{
    id: number;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface CashFlowInterface{
    id: number;
    title: string;
    value: number;
    category: CashFlowCategory;
    company: Company;
    payment: Payment;
    bill: Bill;
    created_at?: string;
    updated_at?: Date;
}

export interface Task{
    id: number;
    description: string;
    company: Company;
    author: number;
    time: string;
    status?: boolean;
    created_at?: string;
    updated_at?: Date;
}

export interface CashDeskCategory{
    id: number;
    name: string;
    color: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface CashDeskInterface{
    id: number;
    title: string;
    value: number;
    category: CashDeskCategory;
    company: Company;
    type: number;
    date: string;
    created_at?: string;
    updated_at?: Date;
}

export interface Quota{
    id: number;
    sold: boolean;
    company: Company;
    segment: string;
    value: number;
    credit: number;
    group: string;
    quota: string;
    cost: number;
    partner?: string;
    partner_cost?: number;
    passed_cost?: number;
    total_cost: number;
    seller?: string;
    cpf_cnpj: string;
    paid_percent: string;
    partner_commission?: string;
    tax?: number;
    contemplated_type: string;
    description?: string;
    purchase_date: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface QuotaSale{
    id: number;
    cancelled: boolean;
    company: Company;
    quota: Quota;
    value: number;
    passed_value: number;
    partner_value: number;
    total_cost: number;
    seller?: string;
    buyer: string;
    cpf_cnpj: string;
    profit: number;
    tax?: number;
    coordinator?: string;
    description?: string;
    sale_date: string;
    created_at?: Date;
    updated_at?: Date;
}