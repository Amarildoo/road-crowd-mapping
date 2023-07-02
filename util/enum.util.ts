export function getValidEnumValue(value: string, enumObject: any): string | null {
    if (!value)
        return null;
    const enumKeys: string[] = Object.keys(enumObject).filter((key) => isNaN(Number(key)));
    const lowercaseValue: string = value.toLowerCase();

    const matchingKey = enumKeys.find((key) => key.toLowerCase() === lowercaseValue);
    return matchingKey ? enumObject[matchingKey] : null;
}