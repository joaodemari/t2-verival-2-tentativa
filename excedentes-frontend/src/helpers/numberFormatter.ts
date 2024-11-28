export function numberFormatter(value: string) {
    if (typeof value !== "string") {
        value = String(value);
    }

    return value.replace(/\D/g, "");
}