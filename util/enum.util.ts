export function getValidEnumValue(value: string, enumObject: any): string | null {
    if (!value)
        return null;
    const enumKeys: string[] = Object.keys(enumObject).filter((key) => isNaN(Number(key)));
    const lowercaseValue: string = value.toLowerCase();

    const matchingKey = enumKeys.find((key) => key.toLowerCase() === lowercaseValue);
    return matchingKey ? enumObject[matchingKey] : null;
}

export function getEnumKeyFromValue(value: number, enumObject: any): string | undefined {
    for (const key in enumObject) {
        if (enumObject[key] === value)
            return key;
    }
    return undefined; // Value not found in the enum
}