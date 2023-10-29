export const deepCopy = <T>(obj: T): T => {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }

    if (Array.isArray(obj)) {
        const newArray: any[] = [];
        for (let i = 0; i < obj.length; i++) {
            newArray[i] = deepCopy(obj[i]);
        }
        return newArray as T;
    }

    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = deepCopy(obj[key]);
        }
    }

    return newObj as T;
};
