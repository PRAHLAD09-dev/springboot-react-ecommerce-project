import { Home, Building2, Building, Store, MapPin } from "lucide-react";

const ADDRESS_TYPE_MAP = {
    HOME: { Icon: Home, label: "Home", style: "bg-success-100 text-success-700" },
    OFFICE: { Icon: Building2, label: "Office", style: "bg-brand-100 text-brand-700" },
    APARTMENT: { Icon: Building, label: "Apartment", style: "bg-brand-100 text-brand-700" },
    SHOP: { Icon: Store, label: "Shop", style: "bg-warning-100 text-warning-700" },
};

const DEFAULT_TYPE = { Icon: MapPin, label: "Other", style: "bg-ink-100 text-ink-700" };

export function getAddressTypeInfo(type) {
    return ADDRESS_TYPE_MAP[type] || DEFAULT_TYPE;
}
