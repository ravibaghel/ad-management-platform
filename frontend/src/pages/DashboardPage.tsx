export default function DashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Campaigns', value: '—' },
          { label: 'Total Impressions', value: '—' },
          { label: 'Overall CTR', value: '—' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-5">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-3xl font-semibold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
