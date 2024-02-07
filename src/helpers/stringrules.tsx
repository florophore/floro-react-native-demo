import { Locales } from "../../floro_infra/floro_modules/text-generator";

function ordinalSuffixOf_EN(i: number): string {
    let j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return "st";
    }
    if (j === 2 && k !== 12) {
        return "nd";
    }
    if (j === 3 && k !== 13) {
        return "rd";
    }
    return "th";
}

export function ordinalSuffix (index: number, locale: keyof Locales) {
    if (locale == "EN") {
        return ordinalSuffixOf_EN(index);
    }
    return "";
}