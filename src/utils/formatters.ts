export const formatCPF = (cpf: string): string => {
  if (!cpf) return "";
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export const formatPhone = (phone: string): string => {
  if (!phone) return "";

  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (phone.length === 10) {
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return phone;
};

export const formatAccountNumber = (accountNumber: number | string): string => {
  if (!accountNumber) return "";
  return accountNumber.toString().padStart(8, "0");
};

export const formatCurrency = (value: number): string => {
  if (value === null || value === undefined || isNaN(value)) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatDate = (date: string): string => {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
};

export const formatDateForBackend = (dateString: string): string => {
  if (!dateString) return "";

  const date = new Date(dateString + "T00:00:00"); 
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
