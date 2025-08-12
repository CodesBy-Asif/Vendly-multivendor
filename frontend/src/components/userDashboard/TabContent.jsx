import ProfileTab from "./tabs/ProfileTab";
import OrdersTab from "./tabs/OrdersTab";
import RefundTab from "./tabs/RefundTab";
import TrackOrderTab from "./tabs/TrackOrderTab";
import AddressTab from "./tabs/AddressTab";
import InboxPage from "./tabs/Inbox";
import { useSelector } from "react-redux";

export default function TabContent({ activeTab }) {
  const { user } = useSelector((state) => state.user);
  return (
    <div className="p-4">
      {activeTab === "profile" && <ProfileTab />}
      {activeTab === "orders" && <OrdersTab />}
      {activeTab === "refund" && <RefundTab />}
      {activeTab === "inbox" && <InboxPage userType="user" userId={user._id} />}
      {activeTab === "track-order" && <TrackOrderTab />}
      {activeTab === "address" && <AddressTab />}
    </div>
  );
}
