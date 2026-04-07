import { Wallet, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import type { Transaction } from '../types';

interface SummaryProps {
  transactions: Transaction[];
}

export function Summary({ transactions }: SummaryProps) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;
  const isPositive = balance >= 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Balance Card - Destacado en blanco */}
      <div className="relative bg-white p-6 rounded-xl shadow-xl border-2 border-primary/20 overflow-hidden">
        {/* Elemento de énfasis - Brillo animado */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-foreground">Balance Total</h3>
            </div>
            {/* Elemento de énfasis - Icono estrella */}
            {isPositive && balance > 0 && (
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <p className="text-4xl text-foreground">{formatCurrency(balance)}</p>
          </div>

          {/* Elemento de énfasis - Indicador de estado */}
          <div className="mt-3 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-primary' : 'bg-destructive'}`}></div>
            <span className={`text-sm ${isPositive ? 'text-primary' : 'text-destructive'}`}>
              {isPositive ? 'Balance positivo' : 'Balance negativo'}
            </span>
          </div>
        </div>
      </div>

      {/* Ingresos Card */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-foreground">Ingresos</h3>
        </div>
        <p className="text-primary text-3xl">{formatCurrency(income)}</p>
      </div>

      {/* Gastos Card */}
      <div className="bg-card border border-border p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-destructive" />
          </div>
          <h3 className="text-foreground">Gastos</h3>
        </div>
        <p className="text-destructive text-3xl">{formatCurrency(expenses)}</p>
      </div>
    </div>
  );
}
