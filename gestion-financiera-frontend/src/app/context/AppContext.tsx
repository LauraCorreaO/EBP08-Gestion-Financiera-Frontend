import { createContext, useContext, useState, ReactNode } from 'react';
import type { Transaction, Category, Budget, User } from '../types';

interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  registeredUsers: RegisteredUser[];
  registerUser: (user: RegisteredUser) => void;
  validateLogin: (email: string, password: string) => User | null;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  budgets: Budget[];
  setBudgets: (budgets: Budget[]) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);

  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Sin categoría', icon: '📋', isDefault: true },
    { id: '2', name: 'Alimentación', icon: '🍔' },
    { id: '3', name: 'Transporte', icon: '🚗' },
    { id: '4', name: 'Entretenimiento', icon: '🎬' },
    { id: '5', name: 'Servicios', icon: '💡' },
    { id: '6', name: 'Salud', icon: '⚕️' },
    { id: '7', name: 'Educación', icon: '📚' },
    { id: '8', name: 'Salario', icon: '💰' },
    { id: '9', name: 'Freelance', icon: '💻' },
    { id: '10', name: 'Inversiones', icon: '📈' },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      description: 'Salario mensual',
      amount: 3500000,
      type: 'income',
      categoryId: '8',
      date: new Date(2026, 3, 1).toISOString(),
    },
    {
      id: '2',
      description: 'Compra en supermercado',
      amount: 185000,
      type: 'expense',
      categoryId: '2',
      date: new Date(2026, 3, 3).toISOString(),
    },
    {
      id: '3',
      description: 'Gasolina',
      amount: 120000,
      type: 'expense',
      categoryId: '3',
      date: new Date(2026, 3, 4).toISOString(),
    },
    {
      id: '4',
      description: 'Proyecto freelance',
      amount: 800000,
      type: 'income',
      categoryId: '9',
      date: new Date(2026, 3, 5).toISOString(),
    },
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: '1',
      name: 'Presupuesto General',
      amount: 2500000,
      spent: 305000,
      month: '2026-04',
    },
    {
      id: '2',
      name: 'Alimentación',
      amount: 800000,
      spent: 185000,
      categoryId: '2',
      month: '2026-04',
    },
    {
      id: '3',
      name: 'Transporte',
      amount: 400000,
      spent: 120000,
      categoryId: '3',
      month: '2026-04',
    },
  ]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories([...categories, newCategory]);
  };

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
    };
    setBudgets([...budgets, newBudget]);
  };

  const updateBudget = (id: string, budgetUpdate: Partial<Budget>) => {
    setBudgets(budgets.map(b => b.id === id ? { ...b, ...budgetUpdate } : b));
  };

  const registerUser = (newUser: RegisteredUser) => {
    setRegisteredUsers([...registeredUsers, newUser]);
  };

  const validateLogin = (email: string, password: string): User | null => {
    const foundUser = registeredUsers.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      return {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      };
    }

    return null;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        registeredUsers,
        registerUser,
        validateLogin,
        transactions,
        setTransactions,
        addTransaction,
        categories,
        setCategories,
        addCategory,
        budgets,
        setBudgets,
        addBudget,
        updateBudget,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  return context;
}