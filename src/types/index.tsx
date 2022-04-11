import { ResumedBill } from "../pages/Quotas/Sales/EditQuotaSale";

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
    branches: Branch[];
    rule: SellerCommissionRule;
    teams: Team[];
    goals: Goal[];
    goal_amount?: number;
    conversion_percent?: number;
}

export interface Goal{
    id: number;
    user: number;
    value: number;
    company: Company;
    month: number;
    year: number;
    visits?: number;
    sales?: number;
    created_at: string;
    updated_at:string;
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
    quota_sales_id?: number;
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
    value?: number;
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

export interface ReadyQuota{
    id: number;
    sold: boolean;
    company: Company;
    segment: string;
    value?: number;
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
    bills: ResumedBill[];
    ready_quota: Quota;
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
    coordinator_value?: number;
    supervisor?: string;
    supervisor_value?: number;
    description?: string;
    sale_date: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Lead{
    id: number;
    name: string;
    email: string;
    phone: string;
    accept_newsletter: number;
    company: Company;
    notes: LeadNote[];
    user?: User;
    birthday?: string;
    status: LeadStatus;
    origin?: DataOrigin;
    cpf?: string;
    cnpj?: string;

    latest_returned?: {
        id: number;
        lead: number;
        user: User;
    };

    address?: string;
    address_code?: string;
    address_country?: string;
    address_uf?: string;
    address_city?: string;
    address_number?: string;

    created_at: string;
    updated_at: string;
    own: boolean;

    recommender?: string;
    commission?: number;

    segment?: string;
    value?: number;

    sales?: Sales[];
}

export interface LeadNote{
    id: number;
    text: string;
    status: LeadStatus;

    created_at: string;
    updated_at: string;
}

export interface LeadStatus{
    id: number;
    name: string;
    color?: string;
}

export interface DataOrigin{
    id: number;
    name: string;
}

export interface Log{
    user: User;
    action: string;
    company: Company;
    created_at: string;
    updated_at: string;
}

export interface State{
    id: number;
    name: string;
    uf: string;
}

export interface City{
    id: number;
    name: string;
    state: State;
}

export interface Schedule{
    id: number;
    status: boolean;
    datetime: string;
    city: string;
    user: User;
    lead?: Lead;
    created_at: string;
    updated_at: string;
}

export interface Sales{
    id: number;
    value: number;
    lead: Lead;
    company: Company;
    user: User;
    segment: string;
    contract: string;
    group: string;
    quota: string;
    recommender_commission: number;
    commission: number;
    date: string;
    schedule?: number;
}

export interface Branch{
    id: number;
    company: Company;
    manager: User;
    name: string;
    city: City;
    state: State;
    address: string
    email?: string
    phone?: string
    users: User[];
}

export interface Desk{
    id: number;
    name: string;
}

export interface Team{
    id: number;
    branch: Branch;
    desk: Desk;
    company: Company;
    manager: User;
    name: string;
    users: User[];
}

export interface Tenant{
    id: number;
    name: string;
    prefix: string;
}

export interface ChargeBackType{
    id: number;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface CompanyCommissionRule{
    id: number;
    name: string;
    company_id: number;
    company: Company;
    half_installment?: boolean;
    pay_in_contemplation: boolean,
    percentage_paid_in_contemplation: number;
    chargeback_type: ChargeBackType;
    chargeback_type_id: number;
    initial_value?: number;
    final_value?: number;
    created_at: string;
    updated_at: string;
    company_commission_rule_parcels: CompanyCommissionRuleParcel[];
}

export interface CompanyCommissionRuleParcel{
    id: number;
    parcel_number: number;
    percentage_to_pay: number;
    chargeback_percentage: number;
}

export interface SellerCommissionRule{
    id: number;
    name: string;
    company_id: number;
    company: Company;
    half_installment?: boolean;
    pay_in_contemplation: boolean,
    percentage_paid_in_contemplation: number;
    chargeback_type: ChargeBackType;
    chargeback_type_id: number;
    initial_value?: number;
    final_value?: number;
    created_at: string;
    updated_at: string;
    company_commission_rule_parcels: CompanyCommissionRuleParcel[];
}

export interface SellerCommissionRuleParcel{
    id: number;
    parcel_number: number;
    percentage_to_pay: number;
    chargeback_percentage: number;
}