import {
  Boxes,
  CircleDollarSign,
  MoreHorizontal,
  Package,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

const orders = [
  {
    id: "#ABK-1024",
    customer: "Priya Sharma",
    product: "Silver Helix Stud",
    amount: "₹2,499",
    status: "Paid",
    orderStatus: "Processing",
  },
  {
    id: "#ABK-1023",
    customer: "Akash Kumar",
    product: "Titanium Nose Ring",
    amount: "₹1,899",
    status: "Paid",
    orderStatus: "Shipped",
  },
  {
    id: "#ABK-1022",
    customer: "Neha Singh",
    product: "Minimal Lobe Stud",
    amount: "₹1,299",
    status: "Pending",
    orderStatus: "Confirmed",
  },
  {
    id: "#ABK-1021",
    customer: "Rahul Mehta",
    product: "Statement Conch Stud",
    amount: "₹3,199",
    status: "Paid",
    orderStatus: "Delivered",
  },
];

const salesBars = [
  42, 58, 48, 74, 64, 89, 70, 95, 76, 62, 81, 98,
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Admin = () => {
  return (
    <>
      {/* =========================
          STATS
      ========================== */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Revenue */}
        <div className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#6857f7_0%,#8d63f5_100%)] p-5 text-white shadow-[0_16px_35px_rgba(105,85,245,0.22)]">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <CircleDollarSign size={19} />
              </div>

              <span className="flex items-center gap-1 rounded-full bg-[#84ed9a] px-2 py-1 text-[9px] font-semibold text-[#145d2a]">
                <TrendingUp size={11} />
                12.8%
              </span>
            </div>

            <p className="mt-7 text-[10px] uppercase tracking-[0.16em] text-white/65">
              Total Revenue
            </p>

            <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
              ₹1,84,920
            </h3>

            <p className="mt-2 text-[10px] text-white/55">
              vs ₹1,63,980 last month
            </p>
          </div>
        </div>

        <StatCard
          icon={<ShoppingBag size={19} />}
          iconClass="bg-[#e9f5ff] text-[#4b8bdc]"
          label="Total Orders"
          value="428"
          change="+8.4%"
          positive
          footer="395 orders last month"
        />

        <StatCard
          icon={<Package size={19} />}
          iconClass="bg-[#f2edff] text-[#7359dc]"
          label="Total Products"
          value="186"
          change="+12"
          positive
          footer="12 products added this month"
        />

        <StatCard
          icon={<Boxes size={19} />}
          iconClass="bg-[#fff2e6] text-[#e98a3d]"
          label="Low Stock"
          value="14"
          change="-3"
          positive={false}
          footer="Products requiring attention"
        />
      </section>

      {/* =========================
          MIDDLE AREA
      ========================== */}
      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_0.85fr]">
        {/* Sales Overview */}
        <div className="rounded-[22px] border border-[#ece9f3] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[15px] font-semibold">
                Sales Overview
              </h2>

              <p className="mt-1 text-[10px] text-[#9d97a5]">
                Monthly revenue performance
              </p>
            </div>

            <select className="rounded-xl border border-[#ece8f1] bg-[#faf9fc] px-3 py-2 text-[10px] text-[#706a78] outline-none">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>

          <div className="mt-8 flex h-[220px] items-end gap-1.5 sm:h-[250px] sm:gap-3">
            {salesBars.map((height, index) => (
              <div
                key={index}
                className="group flex h-full flex-1 items-end"
              >
                <div
                  className="relative w-full rounded-t-lg bg-[linear-gradient(180deg,#735bff,#aa6bf0)] transition-all duration-300 group-hover:opacity-75"
                  style={{
                    height: `${height}%`,
                  }}
                >
                  <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded-lg bg-[#211d28] px-2 py-1 text-[8px] text-white group-hover:block">
                    ₹{height}k
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-12 gap-1 text-center text-[7px] text-[#aaa5b1] sm:gap-2 sm:text-[8px]">
            {months.map((month) => (
              <span key={month}>
                {month}
              </span>
            ))}
          </div>
        </div>

        {/* Order Status */}
        <div className="rounded-[22px] border border-[#ece9f3] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[15px] font-semibold">
                Order Status
              </h2>

              <p className="mt-1 text-[10px] text-[#9d97a5]">
                Current order distribution
              </p>
            </div>

            <MoreHorizontal
              size={18}
              className="text-[#aaa5b1]"
            />
          </div>

          <div className="mt-8 flex justify-center">
            <div
              className="relative flex h-40 w-40 items-center justify-center rounded-full sm:h-44 sm:w-44"
              style={{
                background:
                  "conic-gradient(#755cff 0% 42%, #5ac8a3 42% 70%, #ffb85c 70% 88%, #ff7587 88% 100%)",
              }}
            >
              <div className="flex h-[108px] w-[108px] flex-col items-center justify-center rounded-full bg-white sm:h-[118px] sm:w-[118px]">
                <span className="text-3xl font-semibold tracking-[-0.04em]">
                  428
                </span>

                <span className="mt-1 text-[9px] uppercase tracking-[0.15em] text-[#9e98a5]">
                  Orders
                </span>
              </div>
            </div>
          </div>

          <div className="mt-7 space-y-3">
            <StatusRow
              color="bg-[#755cff]"
              label="Processing"
              value="180"
              percentage="42%"
            />

            <StatusRow
              color="bg-[#5ac8a3]"
              label="Shipped"
              value="120"
              percentage="28%"
            />

            <StatusRow
              color="bg-[#ffb85c]"
              label="Delivered"
              value="76"
              percentage="18%"
            />

            <StatusRow
              color="bg-[#ff7587]"
              label="Cancelled"
              value="52"
              percentage="12%"
            />
          </div>
        </div>
      </section>

      {/* =========================
          BOTTOM AREA
      ========================== */}
      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_0.85fr]">
        {/* Recent Orders */}
        <div className="min-w-0 overflow-hidden rounded-[22px] border border-[#ece9f3] bg-white">
          <div className="flex items-center justify-between gap-4 border-b border-[#f0edf4] px-4 py-5 sm:px-6">
            <div className="min-w-0">
              <h2 className="text-[15px] font-semibold">
                Recent Orders
              </h2>

              <p className="mt-1 text-[10px] text-[#9d97a5]">
                Latest customer purchases
              </p>
            </div>

            <button
              type="button"
              className="flex-shrink-0 rounded-xl bg-[#f4f1ff] px-3 py-2 text-[9px] font-medium uppercase tracking-[0.12em] text-[#6e58d3] transition-colors hover:bg-[#ebe5ff]"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-[#f2eff5] bg-[#faf9fc]">
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[#f4f1f6] last:border-0 hover:bg-[#fcfbfe]"
                  >
                    <TableCell>
                      <span className="font-medium text-[#6753d0]">
                        {order.id}
                      </span>
                    </TableCell>

                    <TableCell>
                      {order.customer}
                    </TableCell>

                    <TableCell>
                      {order.product}
                    </TableCell>

                    <TableCell>
                      <span className="font-medium">
                        {order.amount}
                      </span>
                    </TableCell>

                    <TableCell>
                      <PaymentBadge
                        status={order.status}
                      />
                    </TableCell>

                    <TableCell>
                      <OrderBadge
                        status={order.orderStatus}
                      />
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory */}
        <div className="rounded-[22px] border border-[#ece9f3] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold">
                Inventory
              </h2>

              <p className="mt-1 text-[10px] text-[#9d97a5]">
                Stock health
              </p>
            </div>

            <Boxes
              size={18}
              className="text-[#775ee0]"
            />
          </div>

          <div className="mt-7 space-y-6">
            <InventoryProgress
              label="Healthy Stock"
              value={148}
              total={186}
              barClass="bg-[#6d5df4]"
            />

            <InventoryProgress
              label="Low Stock"
              value={24}
              total={186}
              barClass="bg-[#ffb65a]"
            />

            <InventoryProgress
              label="Out of Stock"
              value={14}
              total={186}
              barClass="bg-[#ff7185]"
            />
          </div>

          <button
            type="button"
            className="mt-8 w-full rounded-xl border border-[#e8e3f1] bg-[#faf9fc] py-3 text-[9px] font-medium uppercase tracking-[0.14em] text-[#706a78] transition-colors hover:border-[#d8d0ef] hover:bg-[#f5f1ff]"
          >
            Manage Inventory
          </button>
        </div>
      </section>
    </>
  );
};

export default Admin;

/* =========================
   DASHBOARD COMPONENTS
========================= */

type StatCardProps = {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  value: string;
  change: string;
  positive: boolean;
  footer: string;
};

const StatCard = ({
  icon,
  iconClass,
  label,
  value,
  change,
  positive,
  footer,
}: StatCardProps) => {
  return (
    <div className="rounded-[22px] border border-[#ece9f3] bg-white p-5">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <span
          className={`
            flex items-center gap-1 rounded-full px-2 py-1
            text-[9px] font-semibold
            ${
              positive
                ? "bg-[#e9f9ed] text-[#31904b]"
                : "bg-[#fff0e7] text-[#d97936]"
            }
          `}
        >
          {positive ? (
            <TrendingUp size={11} />
          ) : (
            <TrendingDown size={11} />
          )}

          {change}
        </span>
      </div>

      <p className="mt-7 text-[10px] uppercase tracking-[0.15em] text-[#9993a3]">
        {label}
      </p>

      <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
        {value}
      </h3>

      <p className="mt-2 text-[10px] text-[#aaa5b1]">
        {footer}
      </p>
    </div>
  );
};

const StatusRow = ({
  color,
  label,
  value,
  percentage,
}: {
  color: string;
  label: string;
  value: string;
  percentage: string;
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span
          className={`h-2.5 w-2.5 rounded-full ${color}`}
        />

        <span className="text-[11px] text-[#716b79]">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[11px] font-semibold">
          {value}
        </span>

        <span className="w-8 text-right text-[9px] text-[#aaa5b1]">
          {percentage}
        </span>
      </div>
    </div>
  );
};

const TableHead = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <th className="px-5 py-3 text-left text-[9px] font-medium uppercase tracking-[0.14em] text-[#9b95a2]">
      {children}
    </th>
  );
};

const TableCell = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <td className="px-5 py-4 text-[11px] text-[#6f6977]">
      {children}
    </td>
  );
};

const PaymentBadge = ({
  status,
}: {
  status: string;
}) => {
  const paid = status === "Paid";

  return (
    <span
      className={`
        inline-flex rounded-full px-2.5 py-1
        text-[9px] font-medium
        ${
          paid
            ? "bg-[#e9f9ed] text-[#36944f]"
            : "bg-[#fff5e6] text-[#d88932]"
        }
      `}
    >
      {status}
    </span>
  );
};

const OrderBadge = ({
  status,
}: {
  status: string;
}) => {
  const styles: Record<string, string> = {
    Processing:
      "bg-[#f0ecff] text-[#6d58d7]",
    Shipped:
      "bg-[#e8f4ff] text-[#4f89cc]",
    Confirmed:
      "bg-[#fff4e4] text-[#ce8431]",
    Delivered:
      "bg-[#e9f9ed] text-[#34914d]",
  };

  return (
    <span
      className={`
        inline-flex rounded-full px-2.5 py-1
        text-[9px] font-medium
        ${
          styles[status] ??
          "bg-[#f2f2f4] text-[#77717d]"
        }
      `}
    >
      {status}
    </span>
  );
};

const InventoryProgress = ({
  label,
  value,
  total,
  barClass,
}: {
  label: string;
  value: number;
  total: number;
  barClass: string;
}) => {
  const percentage = Math.round(
    (value / total) * 100
  );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] text-[#706a78]">
          {label}
        </span>

        <span className="text-[10px] font-semibold">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#f0edf4]">
        <div
          className={`h-full rounded-full ${barClass}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};