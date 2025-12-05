const OverviewCards = ({ data }) => {
    if (!data) return null;

    const cards = [
        { 
            title: 'Total Customers', 
            value: data.totalCustomers,
            subtitle: 'Registered customers'
        },
        { 
            title: 'Total Orders', 
            value: data.totalOrders,
            subtitle: 'All time orders'
        },
        { 
            title: 'Total Revenue', 
            value: `Rs. ${data.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            subtitle: 'Lifetime revenue'
        },
        { 
            title: 'Avg Order Value', 
            value: `Rs. ${parseFloat(data.avgOrderValue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            subtitle: 'Per order average'
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-slate-200">
                    <p className="text-sm font-medium text-slate-500">{card.title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">{card.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{card.subtitle}</p>
                </div>
            ))}
        </div>
    );
};

export default OverviewCards;