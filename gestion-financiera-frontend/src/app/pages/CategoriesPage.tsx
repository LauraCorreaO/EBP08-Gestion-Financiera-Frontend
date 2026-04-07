import { useState } from 'react';
import { Plus, FolderOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export function CategoriesPage() {
  const { categories, addCategory } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📁');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error('Por favor ingresa un nombre para la categoría');
      return;
    }

    addCategory({
      name,
      icon,
    });

    toast.success('Categoría creada exitosamente');

    // Reset form
    setName('');
    setIcon('📁');
    setShowForm(false);
  };

  const commonIcons = [
    '📁', '🏠', '🚗', '🍔', '🎬', '💡', '⚕️', '📚', '🎮', '🛍️',
    '💰', '💻', '📈', '✈️', '🏋️', '☕', '🎵', '📱', '🎨', '🌟'
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-foreground mb-2">Categorías</h1>
          <p className="text-muted-foreground">
            Crea y gestiona categorías para organizar tus transacciones
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {/* Formulario de Nueva Categoría */}
      {showForm && (
        <div className="bg-card p-6 rounded-xl shadow-md border border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-foreground">Crear Nueva Categoría</h2>
            </div>

            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-foreground mb-2">
                Nombre de la categoría
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ej: Hogar, Gimnasio, Cine, etc."
                required
              />
            </div>

            {/* Selector de Icono */}
            <div>
              <label className="block text-foreground mb-2">
                Icono
              </label>
              <div className="grid grid-cols-10 gap-2 mb-3">
                {commonIcons.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setIcon(emoji)}
                    className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg transition-all ${
                      icon === emoji
                        ? 'bg-primary text-primary-foreground scale-110 shadow-md'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="O escribe tu propio emoji"
                maxLength={2}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Crear Categoría
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Categorías */}
      <div>
        <h2 className="text-foreground mb-4">Todas las Categorías</h2>

        {categories.length === 0 ? (
          <div className="bg-card p-8 rounded-xl border border-border text-center">
            <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-foreground mb-2">No hay categorías disponibles</h3>
            <p className="text-muted-foreground">
              Crea tu primera categoría para organizar tus transacciones
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-card p-4 rounded-xl border border-border hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center text-2xl shrink-0">
                    {category.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-foreground truncate">{category.name}</h3>
                    {category.isDefault && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                        Por defecto
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
