"use client";

import Select, { Props as SelectProps } from "react-select";

export type OptionType = {
    value: string;
    label: string;
};

export default function ClientOnlySelect(props: SelectProps<OptionType>) {
    return <Select {...props} />;
}
