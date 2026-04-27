export default function CampaignsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Campaigns</h2>
        <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark">
          New Campaign
        </button>
      </div>
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-8 text-center text-gray-400 text-sm">
          No campaigns yet. Create your first campaign to get started.
        </div>
      </div>
    </div>
  )
}
