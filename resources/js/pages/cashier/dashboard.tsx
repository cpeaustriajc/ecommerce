import DashboardLayout from '@/layouts/dashboard-layout';
import { Head } from '@inertiajs/react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type SeriesPoint = { date: string };
type SalesPoint = SeriesPoint & { total: number };
type ItemsCreatedPoint = SeriesPoint & { count: number };
type ItemsOrderedPoint = SeriesPoint & { qty: number };

export default function CashierDashboardPage({
    chart7,
    chart30,
    itemsCreated,
    itemsOrdered,
}: {
    chart7?: SalesPoint[];
    chart30?: SalesPoint[];
    itemsCreated?: ItemsCreatedPoint[];
    itemsOrdered?: ItemsOrderedPoint[];
}) {
    const sales7 = chart7 ?? [];
    const sales30 = chart30 ?? [];
    const created = itemsCreated ?? [];
    const ordered = itemsOrdered ?? [];

    const fmtDate = (d: string) => {
        try {
            return new Date(d).toLocaleDateString();
        } catch {
            return d;
        }
    };

    return (
        <DashboardLayout>
            <Head title="Cashier Dashboard" />
            <div className="p-8">
                <h1 className="mb-4 text-2xl font-bold">Cashier Dashboard</h1>
                <p className="mb-4 text-gray-600">Overview of recent sales and item activity.</p>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <section className="mb-6">
                        <h2 className="mb-2 text-lg font-medium">Sales — Last 7 days</h2>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={sales7} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tickFormatter={fmtDate} />
                                    <YAxis />
                                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} labelFormatter={(label) => `Date: ${label}`} />
                                    <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                    <section className="mb-6">
                        <h2 className="mb-2 text-lg font-medium">Sales — Last 30 days</h2>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={sales30} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tickFormatter={fmtDate} />
                                    <YAxis />
                                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} labelFormatter={(label) => `Date: ${label}`} />
                                    <Line type="monotone" dataKey="total" stroke="#16a34a" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                    <section className="mb-6">
                        <h2 className="mb-2 text-lg font-medium">New Items Created (30 days)</h2>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={created} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tickFormatter={fmtDate} />
                                    <YAxis />
                                    <Tooltip formatter={(value: number) => `${value}`} labelFormatter={(label) => `Date: ${label}`} />
                                    <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                    <section className="mb-6">
                        <h2 className="mb-2 text-lg font-medium">Items Ordered (30 days)</h2>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={ordered} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tickFormatter={fmtDate} />
                                    <YAxis />
                                    <Tooltip formatter={(value: number) => `${value}`} labelFormatter={(label) => `Date: ${label}`} />
                                    <Line type="monotone" dataKey="qty" stroke="#ef4444" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
}
