
'use client';

export default function StatsBar() {
  const stats = [
    { label: 'Coleções Totais', value: '12,847', change: '+15.2%' },
    { label: 'Volume 24h', value: '₿ 2,847', change: '+8.7%' },
    { label: 'Proprietários Ativos', value: '847,529', change: '+12.1%' },
    { label: 'Preço Médio', value: '₿ 0.47', change: '-3.2%' }
  ];

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
              <div className={`text-xs font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
