export function priceFormatter(value: string) {
    if (typeof value !== "string") {
        value = String(value);
    }

    value = value.replace(/\D/g, "");

    value = value.replace(/(\d{1,2})$/, ".$1");

    return value;
}