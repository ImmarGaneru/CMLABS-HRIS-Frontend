import BarChartExample from './barchartexample';
import PieChartExample from './piechartexample';

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Sales Overview</h2>
          <BarChartExample />
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Product Distribution</h2>
          <PieChartExample />
        </div>
      </div>
    </div>
  );
}
