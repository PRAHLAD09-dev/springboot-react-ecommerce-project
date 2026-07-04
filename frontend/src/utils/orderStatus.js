export const ORDER_STATUS_VARIANT = {
    CREATED: "neutral",
    PENDING: "brand",
    CONFIRMED: "brand",
    SHIPPED: "warning",
    OUT_FOR_DELIVERY: "warning",
    DELIVERED: "success",
    CANCELLED: "danger",
};

// Standard forward progression of a fulfilled order, used to render timelines.
export const ORDER_FLOW = ["CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
